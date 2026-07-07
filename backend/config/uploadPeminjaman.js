const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/peminjaman");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const uploadPeminjaman = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error("Hanya file PDF, DOC, DOCX, JPG, PNG, atau WEBP yang diperbolehkan"));
    }
    cb(null, true);
  },
});

module.exports = { uploadPeminjaman, uploadDir };
