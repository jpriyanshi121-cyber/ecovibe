const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, ctrl.createOrder);
router.get("/", protect, ctrl.getMyOrders);
router.get("/sales/mine", protect, ctrl.getMySales);
router.get("/:id", protect, ctrl.getOrder);

module.exports = router;