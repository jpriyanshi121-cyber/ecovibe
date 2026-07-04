require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error("❌ FATAL: MONGODB_URI environment variable is missing");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL: JWT_SECRET environment variable is missing");
  process.exit(1);
}

// Connect to database and start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`\n🌿 EcoVibe API running on port ${PORT}`);
      console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
      console.log(`   Docs        : http://localhost:${PORT}/api/health\n`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });