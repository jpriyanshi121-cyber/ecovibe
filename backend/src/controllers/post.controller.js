const Post = require("../models/post.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const { sendPushToUser } = require("../utils/push");

// GET /api/posts  — global feed
exports.getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const { hashtag } = req.query;

    const filter = { isPublic: true };
    if (hashtag) filter.hashtags = hashtag.replace("#", "");

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name avatar ecoScore")
      .populate("taggedProduct", "name images price")
      .populate("taggedChallenge", "title category");

    res.json({ success: true, posts, page });
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/following — posts from followed users
exports.getFollowingFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const me = await User.findById(req.user._id).select("following");
    const authorIds = [...me.following, req.user._id];

    const posts = await Post.find({ author: { $in: authorIds }, isPublic: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name avatar ecoScore")
      .populate("taggedProduct", "name images price");

    res.json({ success: true, posts, page });
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/:id
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name avatar ecoScore")
      .populate("comments.user", "name avatar")
      .populate("taggedProduct", "name images price");
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const hashtags = (req.body.content.match(/#\w+/g) || []).map((h) => h.replace("#", "").toLowerCase());

    const post = await Post.create({
      author: req.user._id,
      content: req.body.content,
      images,
      taggedProduct: req.body.taggedProduct || null,
      taggedChallenge: req.body.taggedChallenge || null,
      ecoImpact: req.body.ecoImpact ? JSON.parse(req.body.ecoImpact) : {},
      hashtags,
    });

    // Award eco points
    await User.findByIdAndUpdate(req.user._id, { $inc: { ecoScore: 10 } });

    const populated = await Post.findById(post._id).populate("author", "name avatar ecoScore");
    res.status(201).json({ success: true, post: populated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    await post.deleteOne();
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/:id/like  (toggle)
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author");
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const uid = req.user._id;
    const liked = post.likes.map((l) => l.toString()).includes(uid.toString());

    if (liked) {
      post.likes.pull(uid);
    } else {
      post.likes.push(uid);

      // Notify author (not self-likes)
      if (post.author._id.toString() !== uid.toString()) {
        const note = await Notification.create({
          recipient: post.author._id,
          sender: uid,
          type: "like_post",
          title: "Post Liked",
          body: `${req.user.name} liked your post`,
          ref: { model: "Post", id: post._id },
        });
        const authorDoc = await require("../models/user.model").findById(post.author._id).select("+pushSubscriptions");
        await sendPushToUser(authorDoc, { title: note.title, body: note.body });
      }
    }

    post.likesCount = post.likes.length;
    await post.save();
    res.json({ success: true, liked: !liked, likesCount: post.likesCount });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/:id/comments
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author");
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comment = { user: req.user._id, text: req.body.text };
    post.comments.push(comment);
    post.commentsCount = post.comments.length;
    await post.save();

    // Notify author
    if (post.author._id.toString() !== req.user._id.toString()) {
      const note = await Notification.create({
        recipient: post.author._id,
        sender: req.user._id,
        type: "comment",
        title: "New Comment",
        body: `${req.user.name} commented on your post`,
        ref: { model: "Post", id: post._id },
      });
      const authorDoc = await User.findById(post.author._id).select("+pushSubscriptions");
      await sendPushToUser(authorDoc, { title: note.title, body: note.body });
    }

    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/posts/:id/comments/:commentId
exports.deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    comment.deleteOne();
    post.commentsCount = post.comments.length;
    await post.save();
    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};
