import express from 'express'
import { uploadToLocal, uploadToLocalCert } from '../config/cloudinary.js'
import { protect } from '../middleware/authMiddleware.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Upload any image (hero, about, project) → /public/images/
router.post('/image', protect, uploadToLocal.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const url = `/images/${req.file.filename}`
    res.json({ url, filename: req.file.filename })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Upload certificate → /public/certificates/
router.post('/certificate', protect, uploadToLocalCert.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const url = `/certificates/${req.file.filename}`
    res.json({ url, filename: req.file.filename })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete image
router.delete('/image/:filename', protect, (req, res) => {
  try {
    const filePath = path.join(__dirname, '../public/images', req.params.filename)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete certificate
router.delete('/certificate/:filename', protect, (req, res) => {
  try {
    const filePath = path.join(__dirname, '../public/certificates', req.params.filename)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router