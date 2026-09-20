const Order = require("../models/order.model");
const Product = require("../models/product.model");

const SHIPPING_FEE = 15;
const TAX_RATE = 0.08;
const CARBON_OFFSET_FEE = 5;

// POST /api/orders  — checkout: cartItems = [{ productId, quantity }]
exports.createOrder = async (req, res, next) => {
  try {
    const { cartItems, shippingAddress } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    const required = ["fullName", "phone", "line1", "city", "state", "zip"];
    for (const field of required) {
      if (!shippingAddress?.[field]) {
        return res.status(400).json({ success: false, message: `Shipping ${field} is required` });
      }
    }

    // Look up real product data server-side — never trust price/name sent by the client
    const orderItems = [];
    for (const { productId, quantity } of cartItems) {
      const qty = Math.max(1, Number(quantity) || 1);
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `A product in your cart no longer exists` });
      }
      if (product.stock < qty) {
        return res.status(400).json({ success: false, message: `Not enough stock for "${product.name}"` });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        quantity: qty,
        seller: product.seller,
      });
    }

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = SHIPPING_FEE;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const carbonOffsetFee = CARBON_OFFSET_FEE;
    const total = subtotal + shippingFee + tax + carbonOffsetFee;

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      subtotal,
      shippingFee,
      tax,
      carbonOffsetFee,
      total,
      shippingAddress,
    });

    // Decrement stock now that the order is placed
    await Promise.all(
      orderItems.map((i) => Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.quantity } }))
    );

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders — the logged-in user's own orders, newest first
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/sales/mine — orders containing products this user sold
exports.getMySales = async (req, res, next) => {
  try {
    const orders = await Order.find({ "items.seller": req.user._id }).sort({ createdAt: -1 });
    // Only return the items within each order that belong to this seller
    const sales = orders.map((o) => ({
      _id: o._id,
      buyer: o.buyer,
      status: o.status,
      createdAt: o.createdAt,
      items: o.items.filter((i) => i.seller.toString() === req.user._id.toString()),
    }));
    res.json({ success: true, sales });
  } catch (err) {
    next(err);
  }
};
// GET /api/orders/dashboard/mine — real seller analytics: revenue, sales, top products, monthly trend
exports.getSellerDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user._id.toString();
    const orders = await Order.find({ "items.seller": sellerId });

    let totalRevenue = 0;
    let totalSales = 0;
    const productStats = {};
    const monthly = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.seller.toString() !== sellerId) return;
        const lineTotal = item.price * item.quantity;
        totalRevenue += lineTotal;
        totalSales += item.quantity;

        if (!productStats[item.name]) productStats[item.name] = { name: item.name, sales: 0, revenue: 0 };
        productStats[item.name].sales += item.quantity;
        productStats[item.name].revenue += lineTotal;

        const monthKey = order.createdAt.toLocaleString("en-US", { month: "short", year: "2-digit" });
        if (!monthly[monthKey]) monthly[monthKey] = { month: monthKey, sales: 0, revenue: 0 };
        monthly[monthKey].sales += item.quantity;
        monthly[monthKey].revenue += lineTotal;
      });
    });

    const activeListings = await Product.countDocuments({ seller: sellerId, isActive: true });
    const topProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const salesData = Object.values(monthly);

    res.json({
      success: true,
      dashboard: { totalRevenue, totalSales, activeListings, topProducts, salesData, totalOrders: orders.length },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};