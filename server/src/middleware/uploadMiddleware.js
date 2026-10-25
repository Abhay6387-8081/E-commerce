import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve('../client/public/images/products');

// Folder exist nahi karta to bana do
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Product-naam se filename banao (slug-jaisa), extension original se lo
    const productName = req.body.name || 'product';
    const slug = productName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const ext = path.extname(file.originalname);
    cb(null, `${slug}-${Date.now()}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only JPG, PNG, WEBP images are allowed.'));
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max