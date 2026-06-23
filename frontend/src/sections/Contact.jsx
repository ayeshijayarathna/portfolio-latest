import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { BsLinkedin, BsGithub } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { FiMapPin, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi'

const defaultProfile = {
  linkedin: 'https://linkedin.com',
  github: 'https://github.com',
  email: 'ayeshi@email.com',
  location: 'Kandy, Sri Lanka',
}

export default function Contact() {
  const { isDark } = useTheme()
  const [profile, setProfile] = useState(defaultProfile)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => { if (data?._id) setProfile(data) })
      .catch(() => {})
  }, [])

  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)'
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'
  const cardBorder = isDark ? 'rgba(232,224,213,0.1)' : 'rgba(44,44,44,0.1)'
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff'

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    backgroundColor: inputBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: '3px',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem', fontWeight: 300,
    color: text, outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleFocus = e => e.target.style.borderColor = '#b47c7c'
  const handleBlur = e => e.target.style.borderColor = cardBorder

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus(null), 5000)
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong.')
        setTimeout(() => setStatus(null), 4000)
      }
    } catch {
      setStatus('error')
      setErrorMsg('Could not connect to server.')
      setTimeout(() => setStatus(null), 4000)
    }
  }

  const socialLinks = [
    { icon: <BsLinkedin size={18} />, label: 'LinkedIn', href: profile.linkedin, value: profile.linkedin?.replace('https://', '') },
    { icon: <BsGithub size={18} />, label: 'GitHub', href: profile.github, value: profile.github?.replace('https://', '') },
    { icon: <MdEmail size={20} />, label: 'Email', href: `mailto:${profile.email}`, value: profile.email },
    { icon: <FiMapPin size={18} />, label: 'Location', href: null, value: profile.location },
  ]

  return (
    <section id="contact" style={{ minHeight: '100vh', padding: '100px 6vw', position: 'relative' }}>

      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a882', marginBottom: '16px' }}>
        07 — Contact
      </p>

      <div style={{ marginBottom: '64px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: text, lineHeight: 1.2, marginBottom: '8px' }}>
          Let's<span style={{ fontStyle: 'italic', color: '#b47c7c' }}> Connect</span>
        </h2>
        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882' }} />
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 300, color: muted, marginTop: '16px', maxWidth: '500px', lineHeight: 1.75 }}>
          Have a project in mind or just want to say hello? I'd love to hear from you.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '64px', alignItems: 'start' }} className="contact-grid">

        {/* Social Links */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b47c7c', marginBottom: '32px' }}>
            Find me here
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {socialLinks.map((link, i) => (
              <div
                key={i}
                onClick={() => link.href && window.open(link.href, '_blank')}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', border: `1px solid ${cardBorder}`, backgroundColor: cardBg, borderRadius: '4px', transition: 'all 0.3s ease', cursor: link.href ? 'pointer' : 'default' }}
                onMouseEnter={e => { if (link.href) { e.currentTarget.style.borderColor = 'rgba(180,124,124,0.4)'; e.currentTarget.style.transform = 'translateX(4px)' } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.transform = 'translateX(0)' }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(180,124,124,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b47c7c', flexShrink: 0 }}>
                  {link.icon}
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, marginBottom: '3px' }}>
                    {link.label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', fontWeight: 400, color: text }}>
                    {link.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '4px', padding: '40px' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b47c7c', marginBottom: '32px' }}>
            Send a message
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row">
              <div>
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, display: 'block', marginBottom: '8px' }}>Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder="Your name" required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, display: 'block', marginBottom: '8px' }}>Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder="your@email.com" required style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, display: 'block', marginBottom: '8px' }}>Subject</label>
              <input type="text" name="subject" value={form.subject} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder="What's this about?" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, display: 'block', marginBottom: '8px' }}>Message *</label>
              <textarea name="message" value={form.message} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder="Tell me about your project or just say hello..." required rows={6} style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }} />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                padding: '14px 32px',
                backgroundColor: status === 'success' ? '#6b9e7a' : '#b47c7c',
                border: 'none', color: '#fff',
                fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 500,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: status === 'loading' ? 0.7 : 1,
                borderRadius: '2px', alignSelf: 'flex-start',
              }}
              onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.backgroundColor = status === 'success' ? '#5a8a69' : '#9d6868' }}
              onMouseLeave={e => { if (status !== 'loading') e.currentTarget.style.backgroundColor = status === 'success' ? '#6b9e7a' : '#b47c7c' }}
            >
              {status === 'loading' ? 'Sending...'
                : status === 'success' ? <><FiCheck size={14} /> Message Sent!</>
                : <><FiSend size={14} /> Send Message</>}
            </button>

            {status === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c97b7b', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>
                <FiAlertCircle size={14} /> {errorMsg || 'Something went wrong. Please try again.'}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '80px', paddingTop: '32px', borderTop: `1px solid ${cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <p style={{ fontFamily: 'var(--font-script)', fontSize: '1.6rem', color: '#b47c7c' }}>Ayeshi</p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 300, color: muted, letterSpacing: '0.05em' }}>
          © {new Date().getFullYear()} Ayeshi I. Jayarathna. All rights reserved.
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
        input::placeholder, textarea::placeholder { opacity: 0.5; }
      `}</style>
    </section>
  )
}