const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/challenge.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", ctrl.getChallenges);
router.get("/:id", ctrl.getChallenge);

router.post("/", protect, upload.single("image"), ctrl.createChallenge);
router.delete("/:id", protect, ctrl.deleteChallenge);

router.post("/:id/join", protect, ctrl.joinChallenge);
router.put("/:id/progress", protect, ctrl.updateProgress);

module.exports = router;
