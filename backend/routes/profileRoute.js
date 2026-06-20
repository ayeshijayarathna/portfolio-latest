import express from 'express'
import Profile from '../models/Profile.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public - get profile
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne()
    if (!profile) {
      profile = await Profile.create({
        name: 'Ayeshi I. Jayarathna',
        tagline: 'A fullstack engineer, UI designer, project manager and business analyst — blending quiet craft with considered strategy to build products that feel inevitable.',
        roles: ['Full Stack Engineer', 'UI/UX Designer', 'Business Analyst', 'Project Manager'],
        estYear: '2022',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
        email: 'ayeshi@email.com',
        location: 'Kandy, Sri Lanka',
        aboutHeading: 'Crafting digital experiences with purpose.',
        aboutBio1: "I'm Ayeshi — a fullstack engineer and UI designer who loves turning complex problems into elegant, user-centric solutions.",
        aboutBio2: "I believe great products are born at the intersection of technical precision and thoughtful design.",
        stats: [
          { value: '10+', label: 'Projects Completed' },
          { value: '3+', label: 'Years Experience' },
          { value: '5+', label: 'Technologies' },
          { value: '4', label: 'Roles Mastered' },
        ],
      })
    }
    res.json(profile)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin - update profile
router.put('/', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne()
    if (!profile) {
      profile = await Profile.create(req.body)
    } else {
      profile = await Profile.findByIdAndUpdate(profile._id, req.body, { new: true })
    }
    res.json(profile)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router