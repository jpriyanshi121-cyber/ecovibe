const Product = require("../models/product.model");
const User = require("../models/user.model");

// GET /api/products  (list + search + filter)
exports.getProducts = async (req, res, next) => {
  try {
    const { q, category, ecoTag, minPrice, maxPrice, isEcoVerified, sort, page = 1, limit = 20 } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (ecoTag) filter.ecoTags = ecoTag;
    if (isEcoVerified === "true") filter.isEcoVerified = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) filter.$text = { $search: q };

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      rating: { averageRating: -1 },
      popular: { likesCount: -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(Number(limit))
        .populate("seller", "name avatar isVerified"),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name avatar ecoScore isVerified")
      .populate("reviews.user", "name avatar");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const product = await Product.create({
      ...req.body,
      seller: req.user._id,
      images,
      ecoTags: req.body.ecoTags ? JSON.parse(req.body.ecoTags) : [],
      certifications: req.body.certifications ? JSON.parse(req.body.certifications) : [],
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((f) => `/uploads/${f.filename}`);
    }
    if (updates.ecoTags && typeof updates.ecoTags === "string") updates.ecoTags = JSON.parse(updates.ecoTags);
    if (updates.certifications && typeof updates.certifications === "string")
      updates.certifications = JSON.parse(updates.certifications);

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, product: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

// POST /api/products/:id/like  (toggle)
exports.likeProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const uid = req.user._id;
    const liked = product.likes.map((l) => l.toString()).includes(uid.toString());

    if (liked) {
      product.likes.pull(uid);
    } else {
      product.likes.push(uid);
    }
    product.likesCount = product.likes.length;
    await product.save();

    res.json({ success: true, liked: !liked, likesCount: product.likesCount });
  } catch (err) {
    next(err);
  }
};

// POST /api/products/:id/reviews
exports.addReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ success: false, message: "You already reviewed this product" });

    product.reviews.push({ user: req.user._id, rating: req.body.rating, comment: req.body.comment });
    product.updateRating();
    await product.save();

    // Award eco points to reviewer
    await User.findByIdAndUpdate(req.user._id, { $inc: { ecoScore: 5 } });

    res.status(201).json({ success: true, averageRating: product.averageRating, numReviews: product.numReviews });
  } catch (err) {
    next(err);
  }
};
