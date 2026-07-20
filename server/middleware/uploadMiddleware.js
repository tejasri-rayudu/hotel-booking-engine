const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads", "rooms"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `room-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

// Only allow image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowedTypes.test(file.mimetype);

    if (extValid && mimeValid) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
});

module.exports = upload;