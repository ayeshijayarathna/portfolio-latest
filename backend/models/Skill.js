import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percent: { type: Number, min: 0, max: 100, default: 80 },
  category: { type: String, enum: ['technical', 'soft', 'tool'], default: 'technical' },
  icon: { type: String, default: '' },
  desc: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Skill', skillSchema)