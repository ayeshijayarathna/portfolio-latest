import { useTheme } from '../context/ThemeContext'
import { useRef, useState } from 'react'
import { FiExternalLink, FiAward } from 'react-icons/fi'

const certificates = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    issuer: 'Coursera — Meta',
    date: 'Dec 2023',
    image: null,
    link: 'https://coursera.org',
    color: '#d4a49a',
  },
  {
    id: 2,
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: 'Oct 2023',
    image: null,
    link: 'https://aws.amazon.com',
    color: '#c9a882',
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    issuer: 'Google — Coursera',
    date: 'Aug 2023',
    image: null,
    link: 'https://coursera.org',
    color: '#b47c7c',
  },
  {
    id: 4,
    title: 'Agile Project Management',
    issuer: 'PMI',
    date: 'Jun 2023',
    image: null,
    link: 'https://pmi.org',
    color: '#9a9a9a',
  },
  {
    id: 5,
    title: 'MongoDB Developer',
    issuer: 'MongoDB University',
    date: 'Mar 2023',
    image: null,
    link: 'https://university.mongodb.com',
    color: '#d4a49a',
  },
  {
    id: 6,
    title: 'React — The Complete Guide',
    issuer: 'Udemy',
    date: 'Jan 2023',
    image: null,
    link: 'https://udemy.com',
    color: '#c9a882',
  },
]

export default function Certificates() {
  const { isDark } = useTheme()
  const scrollRef = useRef(null)
  const [preview, setPreview] = useState(null)

  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)'
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'
  const cardBorder = isDark ? 'rgba(232,224,213,0.08)' : 'rgba(44,44,44,0.1)'

  return (
    <section id="certificates" style={{
      minHeight: '80vh',
      padding: '100px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>

      <p style={{
        paddingLeft: '6vw',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.65rem',
        fontWeight: 500,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: '#c9a882',
        marginBottom: '16px',
      }}>
        03 — Certificates
      </p>

      <div style={{ paddingLeft: '6vw', marginBottom: '48px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.5vw, 3rem)',
          fontWeight: 400,
          color: text,
          lineHeight: 1.2,
          marginBottom: '8px',
        }}>
          Credentials
          <span style={{ fontStyle: 'italic', color: '#b47c7c' }}> & Certifications</span>
        </h2>
        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882' }} />
      </div>

      {/* Horizontal Scroll */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          paddingLeft: '6vw',
          paddingRight: '6vw',
          paddingBottom: '16px',
          scrollbarWidth: 'none',
          cursor: 'grab',
        }}
        onMouseDown={e => {
          const el = scrollRef.current
          el.dataset.down = 'true'
          el.dataset.startX = e.pageX - el.offsetLeft
          el.dataset.scrollLeft = el.scrollLeft
          el.style.cursor = 'grabbing'
        }}
        onMouseLeave={() => {
          scrollRef.current.dataset.down = 'false'
          scrollRef.current.style.cursor = 'grab'
        }}
        onMouseUp={() => {
          scrollRef.current.dataset.down = 'false'
          scrollRef.current.style.cursor = 'grab'
        }}
        onMouseMove={e => {
          const el = scrollRef.current
          if (el.dataset.down !== 'true') return
          e.preventDefault()
          const x = e.pageX - el.offsetLeft
          const walk = (x - el.dataset.startX) * 1.5
          el.scrollLeft = el.dataset.scrollLeft - walk
        }}
      >
        {certificates.map((cert, i) => (
          <div
            key={cert.id}
            style={{
              minWidth: '260px',
              maxWidth: '260px',
              flexShrink: 0,
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              borderTop: `3px solid ${cert.color}`,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              transition: 'all 0.3s ease',
              userSelect: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)'
              e.currentTarget.style.borderColor = cert.color
              e.currentTarget.style.borderTopColor = cert.color
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = cardBorder
              e.currentTarget.style.borderTopColor = cert.color
            }}
          >
            {/* Icon */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: `${cert.color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: cert.color,
            }}>
              <FiAward size={18} />
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1rem',
              fontWeight: 500,
              color: text,
              lineHeight: 1.4,
              flex: 1,
            }}>
              {cert.title}
            </h3>

            {/* Issuer */}
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: cert.color,
            }}>
              {cert.issuer}
            </p>

            {/* Date + Link */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: `1px solid ${cardBorder}`,
            }}>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.62rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                color: muted,
              }}>
                {cert.date}
              </span>
              <a
                href={cert.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: muted,
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.color = cert.color}
                onMouseLeave={e => e.currentTarget.style.color = muted}
              >
                <FiExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <p style={{
        paddingLeft: '6vw',
        marginTop: '16px',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.62rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: muted,
        opacity: 0.5,
      }}>
        Drag to explore →
      </p>

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </section>
  )
}