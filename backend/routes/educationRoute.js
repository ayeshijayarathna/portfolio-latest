import express from 'express'
import Education from '../models/Education.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const items = await Education.find().sort({ order: 1, createdAt: -1 })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', protect, async (req, res) => {
  try {
    const item = await Education.create(req.body)
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(400).json({ error: err.message }) }
})

export default router