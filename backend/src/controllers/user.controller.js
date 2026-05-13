const User = require("../models/user.model");
const Post = require("../models/post.model");
const Product = require("../models/product.model");
const Notification = require("../models/notification.model");
const { sendPushToUser } = require("../utils/push");

// GET /api/users/:id
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "name avatar").populate("following", "name avatar");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "bio", "location"];
    const updates = {};
    allowed.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    if (req.file) updates.avatar = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/:id/follow
exports.followUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const me = req.user._id;

    if (targetId === me.toString()) {
      return res.status(400).json({ success: false, message: "Cannot follow yourself" });
    }

    const target = await User.findById(targetId).select("+pushSubscriptions");
    if (!target) return res.status(404).json({ success: false, message: "User not found" });

    const alreadyFollowing = target.followers.includes(me);

    if (alreadyFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(targetId, { $pull: { followers: me } });
      await User.findByIdAndUpdate(me, { $pull: { following: targetId } });
      return res.json({ success: true, following: false });
    } else {
      // Follow
      await User.findByIdAndUpdate(targetId, { $addToSet: { followers: me } });
      await User.findByIdAndUpdate(me, { $addToSet: { following: targetId } });

      // Notification
      const note = await Notification.create({
        recipient: targetId,
        sender: me,
        type: "follow",
        title: "New Follower",
        body: `${req.user.name} started following you`,
        ref: { model: "User", id: me },
      });

      // Push
      await sendPushToUser(target, { title: note.title, body: note.body });

      return res.json({ success: true, following: true });
    }
  } catch (err) {
    next(err);
  }
};

// GET /api/users/leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ ecoScore: -1 })
      .limit(20)
      .select("name avatar ecoScore badges carbonSaved treesPlanted");
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id/posts
exports.getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await Post.find({ author: req.params.id, isPublic: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name avatar ecoScore");
    res.json({ success: true, posts, page });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id/products (seller products)
exports.getUserProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.params.id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/me/saved/:productId  (toggle save)
exports.toggleSavedProduct = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.productId;
    const saved = user.savedProducts.map((p) => p.toString()).includes(pid);

    if (saved) {
      user.savedProducts.pull(pid);
    } else {
      user.savedProducts.push(pid);
    }
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, saved: !saved });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/me/saved
exports.getSavedProducts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("savedProducts");
    res.json({ success: true, products: user.savedProducts });
  } catch (err) {
    next(err);
  }
};
