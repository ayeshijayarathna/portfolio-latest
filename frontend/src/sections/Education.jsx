import { useTheme } from '../context/ThemeContext'
import { useEffect, useRef, useState } from 'react'
import { FiMapPin } from 'react-icons/fi'

function TimelineItem({ item, index, isDark, isLast }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)'
  const border = isDark ? 'rgba(232,224,213,0.08)' : 'rgba(44,44,44,0.08)'

  const tags = Array.isArray(item.tags)
    ? item.tags
    : (item.tags || '').split(',').map(t => t.trim()).filter(Boolean)

  // even index -> left side, odd index -> right side
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        position: 'relative',
        width: '100%',
        paddingBottom: !isLast ? '48px' : '0',
      }}
    >
      {/* Center dot */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '6px',
        transform: 'translateX(-50%)',
        width: '12px', height: '12px', borderRadius: '50%',
        backgroundColor: '#b47c7c', border: '2px solid #b47c7c',
        boxShadow: '0 0 0 4px rgba(180,124,124,0.15)',
        zIndex: 2,
      }} />

      {/* Content card */}
      <div style={{
        width: 'calc(50% - 40px)',
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateX(0)'
          : `translateX(${isLeft ? '-30px' : '30px'})`,
        transition: `all 0.6s ease ${index * 0.15}s`,
        textAlign: isLeft ? 'right' : 'left',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a882', marginBottom: '10px' }}>
          {item.period}
        </p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 500, color: text, marginBottom: '6px', lineHeight: 1.3 }}>
          {item.degree}
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '14px',
          flexWrap: 'wrap',
          justifyContent: isLeft ? 'flex-end' : 'flex-start',
        }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 500, color: '#b47c7c' }}>
            {item.institution}
          </p>
          {item.location && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: muted,
              fontSize: '0.78rem',
              flexDirection: isLeft ? 'row-reverse' : 'row',
            }}>
              <FiMapPin size={11} /> {item.location}
            </span>
          )}
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 300, lineHeight: 1.75, color: muted, marginBottom: '16px' }}>
          {item.description}
        </p>
        {tags.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: isLeft ? 'flex-end' : 'flex-start',
          }}>
            {tags.map(tag => (
              <span key={tag} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? 'rgba(232,224,213,0.5)' : 'rgba(44,44,44,0.5)', border: `1px solid ${border}`, padding: '3px 10px', borderRadius: '2px' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Education() {
  const { isDark } = useTheme()
  const [items, setItems] = useState([])
  const text = isDark ? '#e8e0d5' : '#2c2c2c'

  useEffect(() => {
    fetch('/api/education')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setItems(data) })
      .catch(() => {})
  }, [])

  return (
    <section id="education" style={{ minHeight: '100vh', padding: '100px 6vw', position: 'relative' }}>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a882', marginBottom: '16px' }}>
        02 — Education
      </p>
      <div style={{ marginBottom: '64px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: text, lineHeight: 1.2, marginBottom: '8px' }}>
          Academic<span style={{ fontStyle: 'italic', color: '#b47c7c' }}> Journey</span>
        </h2>
        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882' }} />
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
        {items.length === 0 ? (
          <p style={{ color: 'rgba(180,124,124,0.4)', fontFamily: 'var(--font-sans)' }}>No education entries yet.</p>
        ) : (
          <>
            {/* Center vertical line */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '6px',
              bottom: '6px',
              width: '1px',
              transform: 'translateX(-50%)',
              backgroundColor: isDark ? 'rgba(180,124,124,0.2)' : 'rgba(180,124,124,0.25)',
            }} />
            {items.map((item, index) => (
              <TimelineItem key={item._id} item={item} index={index} isDark={isDark} isLast={index === items.length - 1} />
            ))}
          </>
        )}
      </div>
    </section>
  )
}