import { useTheme } from '../context/ThemeContext'
import { useEffect, useRef, useState } from 'react'

const experienceData = [
  {
    id: 1,
    role: 'Junior Full Stack Developer',
    company: 'TechSolutions Pvt Ltd',
    location: 'Colombo, Sri Lanka',
    period: '2024 — Present',
    type: 'Full Time',
    description: 'Developing and maintaining web applications using React and Node.js. Collaborating with cross-functional teams to deliver high-quality software solutions.',
    responsibilities: ['Built RESTful APIs with Node.js & Express', 'Developed responsive UI components in React', 'Managed MongoDB databases and Cloudinary integrations'],
    side: 'left',
  },
  {
    id: 2,
    role: 'UI/UX Design Intern',
    company: 'Creative Agency LK',
    location: 'Colombo, Sri Lanka',
    period: 'Jun 2023 — Dec 2023',
    type: 'Internship',
    description: 'Designed user interfaces and prototypes for client projects. Conducted user research and usability testing to improve product experiences.',
    responsibilities: ['Created wireframes and prototypes in Figma', 'Conducted user research and usability testing', 'Collaborated with developers on design implementation'],
    side: 'right',
  },
  {
    id: 3,
    role: 'Business Analyst Intern',
    company: 'FinCorp Solutions',
    location: 'Colombo, Sri Lanka',
    period: 'Jan 2023 — May 2023',
    type: 'Internship',
    description: 'Analysed business processes and gathered requirements for software development projects. Created detailed documentation and process flow diagrams.',
    responsibilities: ['Gathered and documented business requirements', 'Created BPMN process flow diagrams', 'Facilitated stakeholder meetings and presentations'],
    side: 'left',
  },
  {
    id: 4,
    role: 'Freelance Web Developer',
    company: 'Self Employed',
    location: 'Remote',
    period: '2022 — 2023',
    type: 'Freelance',
    description: 'Developed custom websites and web applications for local businesses. Managed full project lifecycle from requirements to deployment.',
    responsibilities: ['Built custom WordPress and React websites', 'Handled client communication and project management', 'Deployed applications on Vercel and cPanel hosting'],
    side: 'right',
  },
]

const typeBadgeColor = {
  'Full Time': '#b47c7c',
  'Internship': '#c9a882',
  'Freelance': '#9a9a9a',
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

  const card = (
    <div style={{
      backgroundColor: cardBg,
      border: `1px solid ${cardBorder}`,
      borderLeft: isLeft ? '3px solid #b47c7c' : `1px solid ${cardBorder}`,
      borderRight: !isLeft ? '3px solid #b47c7c' : `1px solid ${cardBorder}`,
      borderRadius: '4px',
      padding: '28px',
      maxWidth: '420px',
      width: '100%',
      backdropFilter: 'blur(4px)',
    }}>
      {/* Type badge + period */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.58rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: badgeColor,
          border: `1px solid ${badgeColor}`,
          padding: '3px 10px',
          borderRadius: '2px',
        }}>
          {item.type}
        </span>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.62rem',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#c9a882',
        }}>
          {item.period}
        </p>
      </div>

      {/* Role */}
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.15rem',
        fontWeight: 600,
        color: '#b47c7c',
        marginBottom: '4px',
        lineHeight: 1.3,
      }}>
        {item.role}
      </h3>

      {/* Company + Location */}
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.82rem',
        fontWeight: 400,
        color: text,
        marginBottom: '12px',
      }}>
        {item.company} · {item.location}
      </p>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.82rem',
        fontWeight: 300,
        lineHeight: 1.75,
        color: muted,
        marginBottom: '16px',
      }}>
        {item.description}
      </p>

      {/* Responsibilities */}
      <ul style={{ paddingLeft: '0', margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {item.responsibilities.map((r, i) => (
          <li key={i} style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            fontWeight: 300,
            color: muted,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            lineHeight: 1.6,
          }}>
            <span style={{ color: '#b47c7c', marginTop: '6px', flexShrink: 0, fontSize: '0.5rem' }}>●</span>
            {r}
          </li>
        ))}
      </ul>
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
        transform: visible
          ? 'translateX(0)'
          : isLeft ? 'translateX(-40px)' : 'translateX(40px)',
        transition: `all 0.65s ease ${index * 0.15}s`,
      }}
    >
      {/* Left */}
      <div style={{ paddingRight: '32px', display: 'flex', justifyContent: 'flex-end' }}>
        {isLeft && card}
      </div>

      {/* Center dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '28px' }}>
        <div style={{
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          backgroundColor: '#b47c7c',
          boxShadow: '0 0 0 5px rgba(180,124,124,0.2)',
          flexShrink: 0,
          zIndex: 1,
        }} />
      </div>

      {/* Right */}
      <div style={{ paddingLeft: '32px' }}>
        {!isLeft && card}
      </div>
    </div>
  )
}

export default function Experience() {
  const { isDark } = useTheme()
  const text = isDark ? '#e8e0d5' : '#2c2c2c'

  return (
    <section id="experience" style={{
      minHeight: '100vh',
      padding: '100px 4vw',
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
        paddingLeft: '2vw',
      }}>
        05 — Experience
      </p>

      <div style={{ marginBottom: '64px', paddingLeft: '2vw' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.5vw, 3rem)',
          fontWeight: 400,
          color: text,
          lineHeight: 1.2,
          marginBottom: '8px',
        }}>
          Work
          <span style={{ fontStyle: 'italic', color: '#b47c7c' }}> Experience</span>
        </h2>
        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882' }} />
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Center line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '1px',
          backgroundColor: isDark ? 'rgba(180,124,124,0.25)' : 'rgba(180,124,124,0.3)',
          transform: 'translateX(-50%)',
        }} />

        {experienceData.map((item, index) => (
          <ExperienceCard key={item.id} item={item} index={index} isDark={isDark} />
        ))}
      </div>
    </section>
  )
}