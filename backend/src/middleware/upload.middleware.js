const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename: remove path separators and special characters
    const sanitized = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .substring(0, 100); // Limit length
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const filename = `${timestamp}-${random}-${sanitized}`;
    cb(null, filename);
  },
});

// File filter — accepts images for post/product photos, and video for EcoReels
const imageMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const videoMimes = ["video/mp4", "video/webm", "video/quicktime"];

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    if (videoMimes.includes(file.mimetype)) return cb(null, true);
    return cb(new Error("Only mp4, webm or mov videos are allowed"), false);
  }
  if (imageMimes.includes(file.mimetype)) return cb(null, true);
  return cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max (covers short video clips; images stay small in practice)
  },
});

module.exports = upload;