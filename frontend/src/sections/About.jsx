import { useTheme } from '../context/ThemeContext'
import { useEffect, useRef, useState } from 'react'
import { FiCode, FiLayers, FiTrendingUp, FiUsers } from 'react-icons/fi'

const defaultProfile = {
  aboutHeading: 'Crafting digital experiences with purpose.',
  aboutBio1: "I'm Ayeshi — a fullstack engineer and UI designer who loves turning complex problems into elegant, user-centric solutions. With a background spanning software engineering, business analysis, and project management, I bring a rare multi-dimensional perspective to every project I touch.",
  aboutBio2: "I believe great products are born at the intersection of technical precision and thoughtful design. Whether I'm architecting a backend system, crafting pixel-perfect interfaces, or analysing business requirements — I bring the same quiet dedication to every layer of the stack.",
  stats: [
    { value: '10+', label: 'Projects Completed' },
    { value: '3+', label: 'Years Experience' },
    { value: '5+', label: 'Technologies' },
    { value: '4', label: 'Roles Mastered' },
  ],
}

const statIcons = [<FiCode size={18} />, <FiTrendingUp size={18} />, <FiLayers size={18} />, <FiUsers size={18} />]

function CountUp({ target, start }) {
  const [count, setCount] = useState(0)
  const num = parseInt(target) || 0

  useEffect(() => {
    if (!start || !num) return
    let current = 0
    const steps = 60
    const increment = num / steps
    const timer = setInterval(() => {
      current += increment
      if (current >= num) { setCount(num); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 1800 / steps)
    return () => clearInterval(timer)
  }, [start, num])

  const suffix = target?.replace(/[0-9]/g, '') || ''
  return <>{count}{suffix}</>
}

export default function About() {
  const { isDark } = useTheme()
  const sectionRef = useRef(null)
  const [animateStats, setAnimateStats] = useState(false)
  const [profile, setProfile] = useState(defaultProfile)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => { if (data?._id) setProfile(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimateStats(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.6)' : 'rgba(44,44,44,0.6)'
  const border = isDark ? 'rgba(232,224,213,0.08)' : 'rgba(44,44,44,0.08)'
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(44,44,44,0.03)'

  const headingParts = profile.aboutHeading?.split('with purpose') || [profile.aboutHeading, '']

  return (
    <section id="about" ref={sectionRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 6vw', position: 'relative' }}>

      <p style={{
        position: 'absolute', top: '60px', left: '6vw',
        fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500,
        letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a882',
      }}>
        01 — About
      </p>

      <div style={{ display: 'flex', gap: '80px', alignItems: 'center', width: '100%' }} className="about-grid">

        {/* Photo */}
        <div style={{ flex: '0 0 auto', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: '16px', left: '16px', right: '-16px', bottom: '-16px',
            border: '1px solid rgba(180,124,124,0.3)', zIndex: 0,
          }} />
          <img src="/avatar.jpg" alt="Ayeshi Jayarathna" style={{
            width: '340px', height: '420px', objectFit: 'cover', objectPosition: 'top center',
            display: 'block', position: 'relative', zIndex: 1,
            filter: isDark ? 'brightness(0.88) grayscale(0.1)' : 'grayscale(0.05)',
          }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 400, color: text, marginBottom: '8px', lineHeight: 1.2,
          }}>
            {headingParts[0]}
            <span style={{ display: 'block', fontStyle: 'italic', color: '#b47c7c' }}>
              with purpose.
            </span>
          </h2>

          <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882', marginBottom: '28px' }} />

          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.92rem', fontWeight: 300,
            lineHeight: 1.85, color: muted, marginBottom: '16px', maxWidth: '520px',
          }}>
            {profile.aboutBio1}
          </p>

          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.92rem', fontWeight: 300,
            lineHeight: 1.85, color: muted, marginBottom: '40px', maxWidth: '520px',
          }}>
            {profile.aboutBio2}
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="stats-grid">
            {(profile.stats || []).map((stat, i) => (
              <div key={i}
                style={{ padding: '20px 16px', border: `1px solid ${border}`, backgroundColor: cardBg, textAlign: 'center', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180,124,124,0.4)'; e.currentTarget.style.backgroundColor = isDark ? 'rgba(180,124,124,0.06)' : 'rgba(180,124,124,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.backgroundColor = cardBg }}
              >
                <div style={{ color: '#b47c7c', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  {statIcons[i] || <FiCode size={18} />}
                </div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: text, lineHeight: 1, marginBottom: '6px' }}>
                  <CountUp target={stat.value} start={animateStats} />
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid { flex-direction: column !important; gap: 48px !important; }
          .about-grid img { width: 100% !important; height: 320px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}