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

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, server-to-server, mobile apps)
    if (!origin) return callback(null, true)

    // Allow explicit whitelisted origins
    if (allowedOrigins.includes(origin)) return callback(null, true)

    // Allow any Vercel preview/production deployment of this project
    // e.g. https://portfolio-latest-3719-7p7ofdgqz-ashu2003.vercel.app
    if (/^https:\/\/portfolio-latest-[a-z0-9-]*\.vercel\.app$/.test(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`))
  },
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

// --- MongoDB connection, cached so concurrent serverless invocations share ---
// one connection attempt instead of each racing to open its own.
let connectionPromise = null

function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve()
  }
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not set!')
    return Promise.resolve()
  }
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10,
      })
      .then(() => {
        console.log('MongoDB connected')
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message)
        // Allow the next request to retry instead of being stuck on a failed promise
        connectionPromise = null
        throw err
      })
  }
  return connectionPromise
}

// Make sure DB is connected before handling any request (needed on Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    res.status(503).json({ error: 'Database connection failed', details: err.message })
  }
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