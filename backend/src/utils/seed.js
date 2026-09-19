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
  const [admin, seller, user1, sarah, mike, techRenewals, artisan, bookLover, ecoCrafts, vintageFinds, ecoShop] =
    await User.create([
      { name: "EcoVibe Admin", email: "admin@ecovibe.com", password: "password123", role: "admin", ecoScore: 9999, isVerified: true },
      { name: "Green Goods Co.", email: "seller@ecovibe.com", password: "password123", role: "seller", ecoScore: 850, isVerified: true, bio: "We sell 100% sustainable products." },
      { name: "Alex Green", email: "alex@example.com", password: "password123", role: "user", ecoScore: 320, carbonSaved: 45, treesPlanted: 3, bio: "Making eco choices every day 🌱" },
      { name: "Sarah Miller", email: "sarah@example.com", password: "password123", role: "seller", ecoScore: 410, isVerified: true, bio: "Vintage furniture finds." },
      { name: "Mike Chen", email: "mike@example.com", password: "password123", role: "seller", ecoScore: 190, bio: "Decluttering my closet, sustainably." },
      { name: "Tech Renewals", email: "techrenewals@example.com", password: "password123", role: "seller", ecoScore: 720, isVerified: true, bio: "Professionally refurbished electronics." },
      { name: "Artisan Collective", email: "artisan@example.com", password: "password123", role: "seller", ecoScore: 260, bio: "Handmade decor from reclaimed materials." },
      { name: "Book Lover", email: "booklover@example.com", password: "password123", role: "seller", ecoScore: 150, bio: "Rehoming great books." },
      { name: "Eco Crafts", email: "ecocrafts@example.com", password: "password123", role: "seller", ecoScore: 300, bio: "Recycled craft supplies." },
      { name: "Vintage Finds", email: "vintagefinds@example.com", password: "password123", role: "seller", ecoScore: 500, isVerified: true, bio: "Restored mid-century pieces." },
      { name: "Eco Shop", email: "ecoshop@example.com", password: "password123", role: "seller", ecoScore: 380, bio: "Everyday sustainable essentials." },
    ]);

  // Products (matches the marketplace categories used across the frontend)
  const products = await Product.insertMany([
    {
      seller: sarah._id,
      name: "Vintage Oak Dining Table",
      description: "Beautiful reclaimed oak dining table. Seats 6 comfortably. Minor scratches add character. Perfect for sustainable living!",
      price: 245,
      category: "furniture",
      condition: "Good",
      location: "Portland, OR",
      images: ["https://images.unsplash.com/photo-1668955254766-1bb2de25cf16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
      ecoTags: ["upcycled", "reclaimed-wood"],
      isEcoVerified: true,
      stock: 1,
      recyclable: true,
    },
    {
      seller: mike._id,
      name: "Vintage Denim Jacket Collection",
      description: "Classic denim jacket from the 90s. Excellent condition, just doesn't fit anymore. Sustainable fashion at its best!",
      price: 45,
      category: "clothing",
      condition: "Like New",
      location: "Austin, TX",
      images: ["https://images.unsplash.com/photo-1614990354198-b06764dcb13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
      ecoTags: ["secondhand", "denim"],
      stock: 1,
      recyclable: true,
    },
    {
      seller: techRenewals._id,
      name: "Refurbished Laptop - Dell",
      description: "Dell laptop professionally refurbished. 8GB RAM, 256GB SSD. Perfect for students or remote work. Saving e-waste!",
      price: 320,
      category: "electronics",
      condition: "Good",
      location: "Seattle, WA",
      images: ["https://images.unsplash.com/photo-1695712551666-e0c354b1e6b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
      ecoTags: ["refurbished", "e-waste-reduction"],
      isEcoVerified: true,
      stock: 3,
      recyclable: true,
    },
    {
      seller: artisan._id,
      name: "Handmade Upcycled Wall Art",
      description: "Unique wall art created from reclaimed wood and metal. Each piece tells a story. Makes a statement in any room!",
      price: 85,
      category: "decor",
      condition: "Like New",
      location: "Denver, CO",
      images: ["https://images.unsplash.com/photo-1694537709541-672813820324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
      ecoTags: ["upcycled", "handmade"],
      stock: 1,
      recyclable: false,
    },
    {
      seller: bookLover._id,
      name: "Classic Literature Collection",
      description: "Set of 12 classic novels. Well-loved but in great reading condition. Give these stories a new home!",
      price: 35,
      category: "books",
      condition: "Good",
      location: "Boston, MA",
      images: ["https://images.unsplash.com/photo-1737205788369-77514fcab7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
      ecoTags: ["secondhand"],
      stock: 1,
      recyclable: true,
    },
    {
      seller: ecoCrafts._id,
      name: "Recycled Craft Materials Bundle",
      description: "Assorted recycled materials perfect for DIY projects. Includes fabric scraps, buttons, wood pieces, and more!",
      price: 20,
      category: "materials",
      condition: "Good",
      location: "San Francisco, CA",
      images: ["https://images.unsplash.com/photo-1691430596599-d8268793294b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
      ecoTags: ["recycled", "diy"],
      stock: 10,
      recyclable: true,
    },
    {
      seller: vintageFinds._id,
      name: "Mid-Century Modern Chair",
      description: "Beautifully restored mid-century modern chair. Reupholstered with sustainable fabric. A timeless piece for any home.",
      price: 175,
      category: "furniture",
      condition: "Like New",
      location: "Brooklyn, NY",
      images: ["https://images.unsplash.com/photo-1649003366476-2d968f76d37a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
      ecoTags: ["restored", "upcycled"],
      isEcoVerified: true,
      stock: 1,
      recyclable: true,
    },
    {
      seller: ecoShop._id,
      name: "Organic Cotton Tote Bag",
      description: "Handcrafted organic cotton tote bag. Perfect for groceries or daily use. Say goodbye to single-use plastics!",
      price: 15,
      category: "clothing",
      condition: "Like New",
      location: "Los Angeles, CA",
      images: ["https://images.unsplash.com/photo-1677753727712-c79ce4c420c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"],
      ecoTags: ["organic-cotton", "zero-waste"],
      isEcoVerified: true,
      stock: 25,
      recyclable: true,
    },
  ]);

  // Follow each other
  await User.findByIdAndUpdate(user1._id, { following: [seller._id], ecoScore: 320 });
  await User.findByIdAndUpdate(seller._id, { followers: [user1._id] });

  // Posts (EcoReels)
  await Post.insertMany([
    {
      author: user1._id,
      content: "Just picked up this vintage oak table for my dining room! Giving old furniture a second life 🌿 #upcycled #ecovibe",
      taggedProduct: products[0]._id,
      hashtags: ["upcycled", "furniture", "ecovibe"],
      ecoImpact: { carbonSaved: 15, description: "Buying secondhand furniture instead of new" },
      likesCount: 12,
    },
    {
      author: techRenewals._id,
      content: "Another laptop saved from the landfill! Refurbished and ready for its next owner 💻♻️ #ewaste #sustainable",
      taggedProduct: products[2]._id,
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      hashtags: ["ewaste", "sustainable"],
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
      title: "Buy Secondhand for a Month",
      description: "Commit to buying only secondhand or upcycled items for 30 days. See how much waste you save!",
      category: "shopping",
      difficulty: "hard",
      durationDays: 30,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ecoPointsReward: 500,
      badgeReward: "Circular Economy Champion",
      hashtag: "SecondhandChallenge",
      isFeatured: true,
      isActive: true,
    },
  ]);

  console.log("✅ Seeded: 11 users, 8 products, 2 posts, 2 challenges");
  console.log("   admin@ecovibe.com  / password123  (admin)");
  console.log("   seller@ecovibe.com / password123  (seller)");
  console.log("   alex@example.com   / password123  (user)");
  await mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });