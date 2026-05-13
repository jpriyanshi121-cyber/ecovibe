const Challenge = require("../models/challenge.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const { sendPushToUser } = require("../utils/push");

// GET /api/challenges
exports.getChallenges = async (req, res, next) => {
  try {
    const { category, difficulty, active, featured, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (active === "true") filter.isActive = true;
    if (featured === "true") filter.isFeatured = true;

    const [challenges, total] = await Promise.all([
      Challenge.find(filter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate("creator", "name avatar"),
      Challenge.countDocuments(filter),
    ]);

    res.json({ success: true, challenges, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

// GET /api/challenges/:id
exports.getChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate("creator", "name avatar ecoScore")
      .populate("participants.user", "name avatar ecoScore");
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found" });
    res.json({ success: true, challenge });
  } catch (err) {
    next(err);
  }
};

// POST /api/challenges
exports.createChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.create({
      ...req.body,
      creator: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });
    res.status(201).json({ success: true, challenge });
  } catch (err) {
    next(err);
  }
};

// POST /api/challenges/:id/join  (toggle join/leave)
exports.joinChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found" });

    const uid = req.user._id.toString();
    const existing = challenge.participants.find((p) => p.user.toString() === uid);

    if (existing) {
      // Leave
      challenge.participants = challenge.participants.filter((p) => p.user.toString() !== uid);
      challenge.participantCount = challenge.participants.length;
      await challenge.save();
      return res.json({ success: true, joined: false });
    }

    // Join
    challenge.participants.push({ user: req.user._id, joinedAt: new Date() });
    challenge.participantCount = challenge.participants.length;
    await challenge.save();

    res.json({ success: true, joined: true });
  } catch (err) {
    next(err);
  }
};

// PUT /api/challenges/:id/progress
exports.updateProgress = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found" });

    const uid = req.user._id.toString();
    const participant = challenge.participants.find((p) => p.user.toString() === uid);
    if (!participant) return res.status(400).json({ success: false, message: "You have not joined this challenge" });

    const newProgress = Math.min(100, Math.max(0, Number(req.body.progress)));
    participant.progress = newProgress;

    // Auto-complete at 100%
    if (newProgress >= 100 && !participant.completed) {
      participant.completed = true;
      participant.completedAt = new Date();

      // Award eco points & badge
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { ecoScore: challenge.ecoPointsReward || 100 },
        ...(challenge.badgeReward ? { $addToSet: { badges: challenge.badgeReward } } : {}),
      });

      const note = await Notification.create({
        recipient: req.user._id,
        type: "challenge_completed",
        title: "Challenge Complete! 🎉",
        body: `You completed "${challenge.title}" and earned ${challenge.ecoPointsReward} eco points!`,
        ref: { model: "Challenge", id: challenge._id },
      });

      const userDoc = await User.findById(req.user._id).select("+pushSubscriptions");
      await sendPushToUser(userDoc, { title: note.title, body: note.body });
    }

    if (req.body.proofPost) participant.proofPost = req.body.proofPost;

    await challenge.save();
    res.json({ success: true, progress: participant.progress, completed: participant.completed });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/challenges/:id  (creator or admin)
exports.deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found" });
    if (challenge.creator.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    await challenge.deleteOne();
    res.json({ success: true, message: "Challenge deleted" });
  } catch (err) {
    next(err);
  }
};
