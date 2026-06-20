import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Cloudinary storage for images (projects, certificates images)
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ayeshi-portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, quality: 'auto', fetch_format: 'auto' }],
  },
})

// Local storage for certificates (PDFs + images stored locally)
const certificatesDir = path.join(__dirname, '../public/certificates')
if (!fs.existsSync(certificatesDir)) fs.mkdirSync(certificatesDir, { recursive: true })

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, certificatesDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})

// Multer instances
export const uploadToCloudinary = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/
    if (allowed.test(file.mimetype)) cb(null, true)
    else cb(new Error('Only images allowed'))
  },
})

export const uploadToLocal = multer({
  storage: localStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|pdf/
    if (allowed.test(file.mimetype)) cb(null, true)
    else cb(new Error('Only images and PDFs allowed'))
  },
})

export { cloudinary }