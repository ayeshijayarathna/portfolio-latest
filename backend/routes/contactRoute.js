import express from 'express'
import nodemailer from 'nodemailer'
import Message from '../models/Message.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' })
  }

  try {
    // Save to DB
    await Message.create({ name, email, subject, message })

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: subject || `New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #faf7f2;">
          <h2 style="color: #b47c7c; font-family: Georgia, serif; font-weight: 400; margin-bottom: 4px;">New Portfolio Message</h2>
          <div style="width: 40px; height: 2px; background: #c9a882; margin-bottom: 24px;"></div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #9a9a9a; font-size: 13px; width: 80px;">Name</td><td style="padding: 8px 0; color: #2c2c2c; font-size: 14px;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #9a9a9a; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #b47c7c;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #9a9a9a; font-size: 13px;">Subject</td><td style="padding: 8px 0; color: #2c2c2c; font-size: 14px;">${subject || 'N/A'}</td></tr>
          </table>
          <div style="margin-top: 24px; padding: 20px; background: #fff; border-left: 3px solid #b47c7c;">
            <p style="color: #9a9a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Message</p>
            <p style="color: #2c2c2c; font-size: 14px; line-height: 1.8; margin: 0;">${message}</p>
          </div>
          <p style="margin-top: 24px; color: #9a9a9a; font-size: 12px;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Contact error:', err)
    // Still return success if DB saved but email failed
    res.status(200).json({ success: true, warning: 'Message saved but email may not have sent.' })
  }
})

export default router