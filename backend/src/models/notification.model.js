const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    type: {
      type: String,
      required: true,
      enum: [
        "follow",
        "like_post",
        "comment",
        "like_product",
        "challenge_invite",
        "challenge_completed",
        "new_product",
        "order_update",
        "eco_badge",
        "system",
      ],
    },

    title: { type: String, required: true },
    body: { type: String, required: true },

    // Optional references
    ref: {
      model: { type: String, enum: ["Post", "Product", "Challenge", "User"] },
      id: { type: mongoose.Schema.Types.ObjectId },
    },

    isRead: { type: Boolean, default: false },
    isPush: { type: Boolean, default: false }, // whether push was sent
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
