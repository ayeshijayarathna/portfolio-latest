import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Ayeshi I. Jayarathna' },
  tagline: { type: String, default: 'A fullstack engineer, UI designer, project manager and business analyst — blending quiet craft with considered strategy to build products that feel inevitable.' },
  roles: [{ type: String }],
  estYear: { type: String, default: '2022' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  email: { type: String, default: '' },
  location: { type: String, default: 'Kandy, Sri Lanka' },
  aboutHeading: { type: String, default: 'Crafting digital experiences with purpose.' },
  aboutBio1: { type: String, default: '' },
  aboutBio2: { type: String, default: '' },
  stats: [{ value: String, label: String }],
}, { timestamps: true })

export default mongoose.model('Profile', profileSchema)