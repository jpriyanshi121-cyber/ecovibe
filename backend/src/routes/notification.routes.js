const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/notification.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/vapid-public-key", ctrl.getVapidKey);

router.get("/", protect, ctrl.getNotifications);
router.put("/read-all", protect, ctrl.markAllRead);
router.put("/:id/read", protect, ctrl.markRead);
router.post("/subscribe", protect, ctrl.subscribe);
router.delete("/subscribe", protect, ctrl.unsubscribe);
router.post("/send-test", protect, ctrl.sendTest);

module.exports = router;
