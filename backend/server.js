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

// Serve certificates from /public/certificates
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => console.error('MongoDB error:', err))