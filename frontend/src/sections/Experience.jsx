import { useTheme } from '../context/ThemeContext'
import { useEffect, useRef, useState } from 'react'

const typeBadgeColor = {
  'Full Time': '#b47c7c',
  'Internship': '#c9a882',
  'Freelance': '#9a9a9a',
  'Part Time': '#d4a49a',
}

function ExperienceCard({ item, index, isDark }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const isLeft = item.side === 'left'
  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.6)' : 'rgba(44,44,44,0.6)'
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)'
  const cardBorder = isDark ? 'rgba(232,224,213,0.1)' : 'rgba(44,44,44,0.1)'
  const badgeColor = typeBadgeColor[item.type] || '#b47c7c'

  const responsibilities = Array.isArray(item.responsibilities)
    ? item.responsibilities
    : (item.responsibilities || '').split('\n').filter(Boolean)

  const card = (
    <div style={{
      backgroundColor: cardBg,
      border: `1px solid ${cardBorder}`,
      borderLeft: isLeft ? '3px solid #b47c7c' : `1px solid ${cardBorder}`,
      borderRight: !isLeft ? '3px solid #b47c7c' : `1px solid ${cardBorder}`,
      borderRadius: '4px', padding: '28px', maxWidth: '420px', width: '100%',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: badgeColor, border: `1px solid ${badgeColor}`, padding: '3px 10px', borderRadius: '2px' }}>
          {item.type}
        </span>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a882' }}>
          {item.period}
        </p>
      </div>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600, color: '#b47c7c', marginBottom: '4px', lineHeight: 1.3 }}>
        {item.role}
      </h3>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 400, color: text, marginBottom: '12px' }}>
        {item.company}{item.location ? ` · ${item.location}` : ''}
      </p>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 300, lineHeight: 1.75, color: muted, marginBottom: '16px' }}>
        {item.description}
      </p>
      {responsibilities.length > 0 && (
        <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {responsibilities.map((r, i) => (
            <li key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 300, color: muted, display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.6 }}>
              <span style={{ color: '#b47c7c', marginTop: '6px', flexShrink: 0, fontSize: '0.5rem' }}>●</span>
              {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 40px 1fr',
        alignItems: 'start',
        marginBottom: '48px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : isLeft ? 'translateX(-40px)' : 'translateX(40px)',
        transition: `all 0.65s ease ${index * 0.15}s`,
      }}
    >
      <div style={{ paddingRight: '32px', display: 'flex', justifyContent: 'flex-end' }}>{isLeft && card}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '28px' }}>
        <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#b47c7c', boxShadow: '0 0 0 5px rgba(180,124,124,0.2)', flexShrink: 0, zIndex: 1 }} />
      </div>
      <div style={{ paddingLeft: '32px' }}>{!isLeft && card}</div>
    </div>
  )
}

export default function Experience() {
  const { isDark } = useTheme()
  const [items, setItems] = useState([])
  const text = isDark ? '#e8e0d5' : '#2c2c2c'

  useEffect(() => {
    fetch('/api/experience')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setItems(data) })
      .catch(() => {})
  }, [])

  return (
    <section id="experience" style={{ padding: '40px 4vw', position: 'relative' }}>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a882', marginBottom: '16px', paddingLeft: '2vw' }}>
        05 — Experience
      </p>
      <div style={{ marginBottom: '64px', paddingLeft: '2vw' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: text, lineHeight: 1.2, marginBottom: '8px' }}>
          Work<span style={{ fontStyle: 'italic', color: '#b47c7c' }}> Experience</span>
        </h2>
        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882' }} />
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: isDark ? 'rgba(180,124,124,0.25)' : 'rgba(180,124,124,0.3)', transform: 'translateX(-50%)' }} />
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'rgba(180,124,124,0.4)', fontFamily: 'var(--font-sans)', paddingTop: '40px' }}>No experience entries yet.</p>
        ) : (
          items.map((item, index) => <ExperienceCard key={item._id} item={item} index={index} isDark={isDark} />)
        )}
      </div>
    </section>
  )
}