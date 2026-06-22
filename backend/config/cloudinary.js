import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Images directory
const imagesDir = path.join(__dirname, '../public/images')
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

// Certificates directory
const certificatesDir = path.join(__dirname, '../public/certificates')
if (!fs.existsSync(certificatesDir)) fs.mkdirSync(certificatesDir, { recursive: true })

// Local storage for images (hero, about, projects)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})

// Local storage for certificates
const certStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, certificatesDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/
  if (allowed.test(file.mimetype)) cb(null, true)
  else cb(new Error('Only images allowed'))
}

const certFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|pdf/
  if (allowed.test(file.mimetype)) cb(null, true)
  else cb(new Error('Only images and PDFs allowed'))
}

export const uploadToLocal = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
})

export const uploadToLocalCert = multer({
  storage: certStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: certFilter,
})

// Keep uploadToCloudinary as alias for compatibility
export const uploadToCloudinary = uploadToLocal