import express from 'express'
import { uploadToCloudinary, uploadToLocal, cloudinary } from '../config/cloudinary.js'
import { protect } from '../middleware/authMiddleware.js'
import fs from 'fs'

const router = express.Router()

// Upload image to Cloudinary (for projects)
router.post('/image', protect, uploadToCloudinary.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete image from Cloudinary
router.delete('/image/:public_id', protect, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.public_id)
    res.json({ message: 'Deleted from Cloudinary' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Upload certificate (image or PDF) to local /public/certificates
router.post('/certificate', protect, uploadToLocal.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    // Return path relative to public folder
    const relativePath = `/certificates/${req.file.filename}`
    res.json({ path: relativePath, filename: req.file.filename })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete certificate from local storage
router.delete('/certificate/:filename', protect, async (req, res) => {
  try {
    const filePath = `./public/certificates/${req.params.filename}`
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router