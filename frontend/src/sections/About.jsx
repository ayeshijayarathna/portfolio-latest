import { useTheme } from '../context/ThemeContext'
import { useEffect, useRef, useState } from 'react'
import { FiCode, FiLayers, FiTrendingUp, FiUsers } from 'react-icons/fi'

const stats = [
  { value: 10, suffix: '+', label: 'Projects Completed', icon: <FiCode size={18} /> },
  { value: 3, suffix: '+', label: 'Years Experience', icon: <FiTrendingUp size={18} /> },
  { value: 5, suffix: '+', label: 'Technologies', icon: <FiLayers size={18} /> },
  { value: 4, suffix: '', label: 'Roles Mastered', icon: <FiUsers size={18} /> },
]

function CountUp({ target, suffix, start }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let current = 0
    const duration = 1800
    const steps = 60
    const increment = target / steps
    const interval = duration / steps

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [start, target])

  return <>{count}{suffix}</>
}

export default function About() {
  const { isDark } = useTheme()
  const sectionRef = useRef(null)
  const [animateStats, setAnimateStats] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateStats(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.6)' : 'rgba(44,44,44,0.6)'
  const border = isDark ? 'rgba(232,224,213,0.08)' : 'rgba(44,44,44,0.08)'
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(44,44,44,0.03)'

  return (
    <section id="about" ref={sectionRef} style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '100px 6vw',
      position: 'relative',
    }}>

      <p style={{
        position: 'absolute',
        top: '60px',
        left: '6vw',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.65rem',
        fontWeight: 500,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: '#c9a882',
      }}>
        01 — About
      </p>

      <div style={{
        display: 'flex',
        gap: '80px',
        alignItems: 'center',
        width: '100%',
      }} className="about-grid">

        {/* Left - Photo */}
        <div style={{ flex: '0 0 auto', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '-16px',
            bottom: '-16px',
            border: '1px solid rgba(180,124,124,0.3)',
            zIndex: 0,
          }} />
          <img
            src="/avatar.jpg"
            alt="Ayeshi Jayarathna"
            style={{
              width: '340px',
              height: '420px',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
              position: 'relative',
              zIndex: 1,
              filter: isDark ? 'brightness(0.88) grayscale(0.1)' : 'grayscale(0.05)',
            }}
          />
        </div>

        {/* Right - Content */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 400,
            color: text,
            marginBottom: '8px',
            lineHeight: 1.2,
          }}>
            Crafting digital experiences
            <span style={{ display: 'block', fontStyle: 'italic', color: '#b47c7c' }}>
              with purpose.
            </span>
          </h2>

          <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882', marginBottom: '28px' }} />

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.92rem',
            fontWeight: 300,
            lineHeight: 1.85,
            color: muted,
            marginBottom: '16px',
            maxWidth: '520px',
          }}>
            I'm Ayeshi — a fullstack engineer and UI designer who loves turning complex problems
            into elegant, user-centric solutions. With a background spanning software engineering,
            business analysis, and project management, I bring a rare multi-dimensional perspective
            to every project I touch.
          </p>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.92rem',
            fontWeight: 300,
            lineHeight: 1.85,
            color: muted,
            marginBottom: '40px',
            maxWidth: '520px',
          }}>
            I believe great products are born at the intersection of technical precision and
            thoughtful design. Whether I'm architecting a backend system, crafting pixel-perfect
            interfaces, or analysing business requirements — I bring the same quiet dedication
            to every layer of the stack.
          </p>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }} className="stats-grid">
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: '20px 16px',
                  border: `1px solid ${border}`,
                  backgroundColor: cardBg,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(180,124,124,0.4)'
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(180,124,124,0.06)' : 'rgba(180,124,124,0.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = border
                  e.currentTarget.style.backgroundColor = cardBg
                }}
              >
                <div style={{ color: '#b47c7c', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  {stat.icon}
                </div>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  color: text,
                  lineHeight: 1,
                  marginBottom: '6px',
                }}>
                  <CountUp target={stat.value} suffix={stat.suffix} start={animateStats} />
                </p>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.62rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: muted,
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            flex-direction: column !important;
            gap: 48px !important;
          }
          .about-grid img {
            width: 100% !important;
            height: 320px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}