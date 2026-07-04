import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import contactRoute from './routes/contactRoute.js'
import projectRoute from './routes/projectRoute.js'
import authRoute from './routes/authRoute.js'
import profileRoute from './routes/profileRoute.js'
import educationRoute from './routes/educationRoute.js'
import experienceRoute from './routes/experienceRoute.js'
import certificateRoute from './routes/certificateRoute.js'
import skillRoute from './routes/skillRoute.js'
import messageRoute from './routes/messageRoute.js'
import uploadRoute from './routes/uploadRoute.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Static files
app.use('/images', express.static(path.join(__dirname, 'public/images')))
app.use('/certificates', express.static(path.join(__dirname, 'public/certificates')))

// Routes
app.use('/api/auth', authRoute)
app.use('/api/contact', contactRoute)
app.use('/api/projects', projectRoute)
app.use('/api/profile', profileRoute)
app.use('/api/education', educationRoute)
app.use('/api/experience', experienceRoute)
app.use('/api/certificates', certificateRoute)
app.use('/api/skills', skillRoute)
app.use('/api/messages', messageRoute)
app.use('/api/upload', uploadRoute)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// --- MongoDB connection, cached so we don't reconnect on every serverless call ---
let isConnected = false

async function connectDB() {
  if (isConnected) return
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not set!')
    return
  }
  try {
    await mongoose.connect(process.env.MONGO_URI)
    isConnected = true
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
  }
}

// Make sure DB is connected before handling any request (needed on Vercel)
app.use(async (req, res, next) => {
  await connectDB()
  next()
})

// Only start a real listening server when running locally.
// On Vercel, process.env.VERCEL is automatically set to "1",
// and Vercel itself handles invoking the app per-request.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
}

export default app