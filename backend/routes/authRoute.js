import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body

  console.log('Login attempt:', username)
  console.log('Expected:', process.env.ADMIN_USERNAME)
  console.log('Match:', username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD)

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )
    res.json({ token })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})

export default router