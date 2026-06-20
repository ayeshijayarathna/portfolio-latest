import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, default: '' },
  period: { type: String, required: true },
  description: { type: String, default: '' },
  tags: [{ type: String }],
  side: { type: String, enum: ['left', 'right'], default: 'left' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Education', educationSchema)