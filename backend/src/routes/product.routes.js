const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/product.controller");
const { protect, requireRole } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", ctrl.getProducts);
router.get("/:id", ctrl.getProduct);

router.post("/", protect, requireRole("seller", "admin"), upload.array("images", 6), ctrl.createProduct);
router.put("/:id", protect, upload.array("images", 6), ctrl.updateProduct);
router.delete("/:id", protect, ctrl.deleteProduct);

router.post("/:id/like", protect, ctrl.likeProduct);
router.post("/:id/reviews", protect, ctrl.addReview);

module.exports = router;
