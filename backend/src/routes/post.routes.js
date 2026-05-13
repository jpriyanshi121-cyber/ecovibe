const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", ctrl.getFeed);
router.get("/following", protect, ctrl.getFollowingFeed);
router.get("/:id", ctrl.getPost);

router.post("/", protect, upload.array("images", 4), ctrl.createPost);
router.delete("/:id", protect, ctrl.deletePost);

router.post("/:id/like", protect, ctrl.likePost);
router.post("/:id/comments", protect, ctrl.addComment);
router.delete("/:id/comments/:commentId", protect, ctrl.deleteComment);

module.exports = router;
