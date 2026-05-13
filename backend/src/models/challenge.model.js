const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  joinedAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }, // 0–100 percent
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  proofPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

const challengeSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 1000 },
    image: { type: String, default: "" },

    category: {
      type: String,
      enum: ["zero-waste", "plant-based", "energy-saving", "water-saving", "transport", "shopping", "other"],
      required: true,
    },

    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    durationDays: { type: Number, required: true, min: 1, max: 365 },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Rewards
    ecoPointsReward: { type: Number, default: 100 },
    badgeReward: { type: String, default: "" },

    // Eco impact goal
    impactGoal: {
      metric: { type: String, default: "" }, // e.g. "kg of CO₂"
      target: { type: Number, default: 0 },
    },

    participants: [participantSchema],
    participantCount: { type: Number, default: 0 },

    hashtag: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

challengeSchema.index({ isActive: 1, startDate: 1 });

module.exports = mongoose.model("Challenge", challengeSchema);
