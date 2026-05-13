const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    images: [{ type: String }],

    category: {
      type: String,
      required: true,
      enum: [
        "food-beverage",
        "clothing",
        "home-living",
        "beauty-personal-care",
        "electronics",
        "outdoors",
        "education",
        "other",
      ],
    },

    // Eco attributes
    ecoTags: [{ type: String }], // e.g. ["organic", "zero-waste", "recycled"]
    certifications: [{ type: String }], // e.g. ["Fair Trade", "USDA Organic"]
    carbonFootprint: { type: Number, default: 0 }, // kg CO₂ per unit
    isEcoVerified: { type: Boolean, default: false },
    recyclable: { type: Boolean, default: false },

    // Inventory
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, trim: true },

    // Ratings
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    // Discovery
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Recompute rating averages
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = +(total / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
};

productSchema.index({ name: "text", description: "text", ecoTags: "text" });
productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Product", productSchema);
