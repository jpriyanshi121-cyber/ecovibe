const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const { sendPushToUser } = require("../utils/push");

// GET /api/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender", "name avatar");

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.json({ success: true, notifications, unreadCount, page });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/read-all
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/:id/read
exports.markRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// POST /api/notifications/subscribe  — save push subscription
exports.subscribe = async (req, res, next) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys) return res.status(400).json({ success: false, message: "Invalid subscription object" });

    const user = await User.findById(req.user._id).select("+pushSubscriptions");
    const exists = user.pushSubscriptions.some((s) => s.endpoint === endpoint);

    if (!exists) {
      user.pushSubscriptions.push({ endpoint, keys });
      await user.save({ validateBeforeSave: false });
    }

    res.json({ success: true, message: "Push subscription saved" });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notifications/subscribe  — remove push subscription
exports.unsubscribe = async (req, res, next) => {
  try {
    const { endpoint } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { pushSubscriptions: { endpoint } },
    });
    res.json({ success: true, message: "Push subscription removed" });
  } catch (err) {
    next(err);
  }
};

// GET /api/notifications/vapid-public-key
exports.getVapidKey = (req, res) => {
  res.json({ success: true, publicKey: process.env.VAPID_PUBLIC_KEY });
};

// POST /api/notifications/send-test  (admin only)
exports.sendTest = async (req, res, next) => {
  try {
    const userDoc = await User.findById(req.user._id).select("+pushSubscriptions");
    await sendPushToUser(userDoc, {
      title: "🌿 EcoVibe Test",
      body: "Push notifications are working!",
    });
    res.json({ success: true, message: "Test push sent" });
  } catch (err) {
    next(err);
  }
};
