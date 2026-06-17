import { useTheme } from '../context/ThemeContext'
import { useEffect, useRef, useState } from 'react'
import { FiMapPin } from 'react-icons/fi'

const educationData = [
  {
    id: 1,
    degree: 'BSc (Hons) in Information Technology',
    institution: 'University of Moratuwa',
    location: 'Moratuwa, Sri Lanka',
    period: '2020 — 2024',
    description: 'Specialized in Software Engineering and Information Systems. Graduated with First Class Honours.',
    tags: ['Software Engineering', 'Database Systems', 'UI/UX', 'Project Management'],
  },
  {
    id: 2,
    degree: 'Diploma in Business Analysis',
    institution: 'ICBT Campus',
    location: 'Colombo, Sri Lanka',
    period: '2022 — 2023',
    description: 'Studied business process modelling, requirements engineering, and agile methodologies.',
    tags: ['Business Analysis', 'Agile', 'BPMN', 'Requirements Engineering'],
  },
  {
    id: 3,
    degree: 'Advanced Level — Physical Science',
    institution: 'Visakha Vidyalaya',
    location: 'Colombo, Sri Lanka',
    period: '2017 — 2019',
    description: 'Completed A/L with strong results in Combined Mathematics, Physics and Chemistry.',
    tags: ['Mathematics', 'Physics', 'Chemistry'],
  },
]

function TimelineItem({ item, index, isDark }) {
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

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        gap: '32px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-30px)',
        transition: `all 0.6s ease ${index * 0.15}s`,
      }}
    >
      {/* Timeline line + dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#b47c7c',
          border: '2px solid #b47c7c',
          boxShadow: '0 0 0 4px rgba(180,124,124,0.15)',
          marginTop: '6px',
          flexShrink: 0,
        }} />
        {index < educationData.length - 1 && (
          <div style={{
            width: '1px',
            flex: 1,
            backgroundColor: isDark ? 'rgba(180,124,124,0.2)' : 'rgba(180,124,124,0.25)',
            marginTop: '8px',
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        paddingBottom: index < educationData.length - 1 ? '48px' : '0',
      }}>
        {/* Period */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.62rem',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#c9a882',
          marginBottom: '10px',
        }}>
          {item.period}
        </p>

        {/* Degree */}
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.25rem',
          fontWeight: 500,
          color: text,
          marginBottom: '6px',
          lineHeight: 1.3,
        }}>
          {item.degree}
        </h3>

        {/* Institution + Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.82rem',
            fontWeight: 500,
            color: '#b47c7c',
          }}>
            {item.institution}
          </p>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: muted, fontSize: '0.78rem' }}>
            <FiMapPin size={11} /> {item.location}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.88rem',
          fontWeight: 300,
          lineHeight: 1.75,
          color: muted,
          maxWidth: '560px',
          marginBottom: '16px',
        }}>
          {item.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {item.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isDark ? 'rgba(232,224,213,0.5)' : 'rgba(44,44,44,0.5)',
              border: `1px solid ${border}`,
              padding: '3px 10px',
              borderRadius: '2px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Education() {
  const { isDark } = useTheme()
  const text = isDark ? '#e8e0d5' : '#2c2c2c'

  return (
    <section id="education" style={{
      minHeight: '100vh',
      padding: '100px 6vw',
      position: 'relative',
    }}>

      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.65rem',
        fontWeight: 500,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: '#c9a882',
        marginBottom: '16px',
      }}>
        02 — Education
      </p>

      <div style={{ marginBottom: '64px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.5vw, 3rem)',
          fontWeight: 400,
          color: text,
          lineHeight: 1.2,
          marginBottom: '8px',
        }}>
          Academic
          <span style={{ fontStyle: 'italic', color: '#b47c7c' }}> Journey</span>
        </h2>
        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882' }} />
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: '700px' }}>
        {educationData.map((item, index) => (
          <TimelineItem key={item.id} item={item} index={index} isDark={isDark} />
        ))}
      </div>
    </section>
  )
}