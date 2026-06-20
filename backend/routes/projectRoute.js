import express from 'express'
import Project from '../models/Project.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public - get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin - create project
router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Admin - update project
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(project)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Admin - delete project
router.delete('/:id', protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router