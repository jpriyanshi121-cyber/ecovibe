const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 500 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 1000 },
    images: [{ type: String }],

    // Optional product tag
    taggedProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },

    // Optional challenge tag
    taggedChallenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", default: null },

    // Eco metrics shared in post
    ecoImpact: {
      carbonSaved: { type: Number, default: 0 },
      wasteReduced: { type: Number, default: 0 }, // kg
      description: { type: String, default: "" },
    },

    hashtags: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    comments: [commentSchema],
    commentsCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });

module.exports = mongoose.model("Post", postSchema);
