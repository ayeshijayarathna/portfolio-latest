import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Ayeshi I. Jayarathna' },
  tagline: { type: String, default: '' },
  roles: [{ type: String }],
  estYear: { type: String, default: '2022' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  email: { type: String, default: '' },
  location: { type: String, default: 'Kandy, Sri Lanka' },
  heroImage: { type: String, default: '' },    
  aboutImage: { type: String, default: '' }, 
  aboutHeading: { type: String, default: 'Crafting digital experiences with purpose.' },
  aboutBio1: { type: String, default: '' },
  aboutBio2: { type: String, default: '' },
  stats: [{ value: String, label: String }],
}, { timestamps: true })

export default mongoose.model('Profile', profileSchema)