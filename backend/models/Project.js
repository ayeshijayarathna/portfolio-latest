import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tech: [{ type: String }],
  category: { type: String, default: 'Fullstack' },
  github: { type: String, default: '' },
  live: { type: String, default: '' },
  image: { type: String, default: '' },
  year: { type: String, default: new Date().getFullYear().toString() },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)