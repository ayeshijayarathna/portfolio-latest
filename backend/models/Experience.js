import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  period: { type: String, required: true },
  type: { type: String, enum: ['Full Time', 'Internship', 'Freelance', 'Part Time'], default: 'Full Time' },
  description: { type: String, default: '' },
  responsibilities: [{ type: String }],
  side: { type: String, enum: ['left', 'right'], default: 'left' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Experience', experienceSchema)