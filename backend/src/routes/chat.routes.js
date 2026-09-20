const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/chat.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, ctrl.chat);

module.exports = router;