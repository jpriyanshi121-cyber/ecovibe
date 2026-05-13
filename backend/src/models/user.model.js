const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: "" },
    bio: { type: String, maxlength: 280, default: "" },
    location: { type: String, default: "" },

    // Eco-specific
    ecoScore: { type: Number, default: 0 },
    badges: [{ type: String }],
    carbonSaved: { type: Number, default: 0 }, // kg CO₂
    treesPlanted: { type: Number, default: 0 },

    // Social
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // Auth
    role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, select: false },

    // Push
    pushSubscriptions: [
      {
        endpoint: String,
        keys: { p256dh: String, auth: String },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.pushSubscriptions;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
