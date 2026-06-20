import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import contactRoute from './routes/contactRoute.js'
import projectRoute from './routes/projectRoute.js'
import authRoute from './routes/authRoute.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoute)
app.use('/api/contact', contactRoute)
app.use('/api/projects', projectRoute)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// MongoDB + Server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => console.error('MongoDB error:', err))