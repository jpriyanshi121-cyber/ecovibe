const express = require("express");
const router = express.Router();
const { register, login, refresh, logout, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate.middleware");

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  validate,
  login
);

router.post("/refresh", refresh);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
