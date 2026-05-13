require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Post = require("../models/post.model");
const Challenge = require("../models/challenge.model");

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "ecovibe" });
  console.log("🌿 Connected to MongoDB for seeding...");

  await Promise.all([User.deleteMany(), Product.deleteMany(), Post.deleteMany(), Challenge.deleteMany()]);

  // Users
  const [admin, seller, user1] = await User.insertMany([
    { name: "EcoVibe Admin", email: "admin@ecovibe.com", password: "password123", role: "admin", ecoScore: 9999, isVerified: true },
    { name: "Green Goods Co.", email: "seller@ecovibe.com", password: "password123", role: "seller", ecoScore: 850, isVerified: true, bio: "We sell 100% sustainable products." },
    { name: "Alex Green", email: "alex@example.com", password: "password123", role: "user", ecoScore: 320, carbonSaved: 45, treesPlanted: 3, bio: "Making eco choices every day 🌱" },
  ]);

  // Products
  const products = await Product.insertMany([
    {
      seller: seller._id,
      name: "Bamboo Water Bottle 750ml",
      description: "Handcrafted bamboo water bottle with stainless steel interior. 100% plastic-free, keeps drinks cold for 24h.",
      price: 34.99,
      category: "home-living",
      ecoTags: ["bamboo", "plastic-free", "reusable"],
      certifications: ["Fair Trade"],
      isEcoVerified: true,
      stock: 150,
      carbonFootprint: 0.3,
      recyclable: true,
      images: [],
    },
    {
      seller: seller._id,
      name: "Organic Cotton Tote Bag",
      description: "GOTS-certified organic cotton tote. Perfect grocery bag, replaces 500+ plastic bags over its lifetime.",
      price: 18.00,
      category: "clothing",
      ecoTags: ["organic", "cotton", "zero-waste"],
      certifications: ["GOTS Certified", "OEKO-TEX"],
      isEcoVerified: true,
      stock: 500,
      carbonFootprint: 1.1,
      recyclable: true,
      images: [],
    },
    {
      seller: seller._id,
      name: "Beeswax Food Wraps (Set of 3)",
      description: "Reusable beeswax wraps, the sustainable alternative to plastic wrap. Compostable at end of life.",
      price: 22.50,
      category: "home-living",
      ecoTags: ["beeswax", "compostable", "zero-waste", "plastic-free"],
      certifications: ["USDA Organic"],
      isEcoVerified: true,
      stock: 200,
      carbonFootprint: 0.5,
      recyclable: false,
      images: [],
    },
  ]);

  // Follow each other
  await User.findByIdAndUpdate(user1._id, { following: [seller._id], ecoScore: 320 });
  await User.findByIdAndUpdate(seller._id, { followers: [user1._id] });

  // Posts
  await Post.insertMany([
    {
      author: user1._id,
      content: "Just switched to a #bamboo toothbrush and bamboo water bottle! Small steps, big impact 🌿 #zerowaste #ecovibe",
      taggedProduct: products[0]._id,
      hashtags: ["bamboo", "zerowaste", "ecovibe"],
      ecoImpact: { carbonSaved: 1.2, description: "Replacing plastic bottles for 1 year" },
      likesCount: 12,
    },
    {
      author: seller._id,
      content: "Our new beeswax wraps are finally restocked! 🐝 Say goodbye to single-use plastic wrap forever. #plasticfree #sustainable",
      taggedProduct: products[2]._id,
      hashtags: ["plasticfree", "sustainable"],
      likesCount: 34,
    },
  ]);

  // Challenges
  await Challenge.insertMany([
    {
      creator: admin._id,
      title: "7-Day Zero Plastic Challenge",
      description: "Go 7 days without purchasing any single-use plastic. Track your progress and share your wins!",
      category: "zero-waste",
      difficulty: "medium",
      durationDays: 7,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ecoPointsReward: 200,
      badgeReward: "Plastic-Free Warrior",
      hashtag: "ZeroPlasticChallenge",
      isFeatured: true,
      isActive: true,
    },
    {
      creator: admin._id,
      title: "30-Day Plant-Based Journey",
      description: "Eat plant-based for 30 days and see the difference it makes for your health and the planet.",
      category: "plant-based",
      difficulty: "hard",
      durationDays: 30,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ecoPointsReward: 500,
      badgeReward: "Green Plate Champion",
      hashtag: "PlantBasedChallenge",
      isFeatured: true,
      isActive: true,
    },
  ]);

  console.log("✅ Seeded: 3 users, 3 products, 2 posts, 2 challenges");
  console.log("   admin@ecovibe.com  / password123  (admin)");
  console.log("   seller@ecovibe.com / password123  (seller)");
  console.log("   alex@example.com   / password123  (user)");
  await mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });
