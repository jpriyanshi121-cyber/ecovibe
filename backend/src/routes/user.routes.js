const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/leaderboard", ctrl.getLeaderboard);
router.get("/me/saved", protect, ctrl.getSavedProducts);
router.put("/me", protect, upload.single("avatar"), ctrl.updateProfile);
router.post("/me/saved/:productId", protect, ctrl.toggleSavedProduct);

router.get("/:id", ctrl.getUser);
router.post("/:id/follow", protect, ctrl.followUser);
router.get("/:id/posts", ctrl.getUserPosts);
router.get("/:id/products", ctrl.getUserProducts);

module.exports = router;
