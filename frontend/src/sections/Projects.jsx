import { useTheme } from '../context/ThemeContext'
import { useState, useRef } from 'react'
import { FiGithub, FiExternalLink } from 'react-icons/fi'

const allProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A fullstack e-commerce solution with real-time inventory, payment integration, and admin dashboard.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express'],
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2024',
    category: 'Fullstack',
  },
  {
    id: 2,
    title: 'Portfolio CMS',
    description: 'A custom content management system built for creatives to manage their portfolio with JWT auth.',
    tech: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com',
    live: null,
    year: '2024',
    category: 'Fullstack',
  },
  {
    id: 3,
    title: 'UI Design System',
    description: 'A comprehensive design system with reusable components, tokens, and documentation.',
    tech: ['React', 'Figma', 'Tailwind'],
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2023',
    category: 'UI/UX',
  },
  {
    id: 4,
    title: 'Business Analytics Dashboard',
    description: 'Real-time analytics dashboard for tracking KPIs, sales trends, and team performance.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com',
    live: null,
    year: '2023',
    category: 'Analytics',
  },
  {
    id: 5,
    title: 'Task Management App',
    description: 'A collaborative project management tool with drag-and-drop, notifications and role-based access.',
    tech: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2023',
    category: 'Fullstack',
  },
  {
    id: 6,
    title: 'Landing Page Builder',
    description: 'Drag and drop landing page builder with live preview and export functionality.',
    tech: ['React', 'Figma', 'Tailwind'],
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2022',
    category: 'UI/UX',
  },
]

const allTech = ['All', 'React', 'Node.js', 'MongoDB', 'Express', 'Tailwind', 'Figma']

export default function Projects() {
  const { isDark } = useTheme()
  const [activeFilter, setActiveFilter] = useState('All')
  const scrollRef = useRef(null)

  const filtered = activeFilter === 'All'
    ? allProjects
    : allProjects.filter(p => p.tech.includes(activeFilter))

  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)'
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'
  const cardBorder = isDark ? 'rgba(232,224,213,0.08)' : 'rgba(44,44,44,0.1)'

  return (
    <section id="projects" style={{
      minHeight: '100vh',
      padding: '100px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Section label */}
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
        02 — Projects
      </p>

      {/* Heading */}
      <div style={{ paddingLeft: '6vw', marginBottom: '40px' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.5vw, 3rem)',
          fontWeight: 400,
          color: text,
          lineHeight: 1.2,
          marginBottom: '8px',
        }}>
          Selected Work
          <span style={{ fontStyle: 'italic', color: '#b47c7c' }}> & Projects</span>
        </h2>
        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882' }} />
      </div>

      {/* Filter Buttons */}
      <div style={{
        paddingLeft: '6vw',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '48px',
      }}>
        {allTech.map(tech => (
          <button
            key={tech}
            onClick={() => setActiveFilter(tech)}
            style={{
              padding: '7px 18px',
              border: activeFilter === tech
                ? '1px solid #b47c7c'
                : `1px solid ${cardBorder}`,
              backgroundColor: activeFilter === tech
                ? '#b47c7c'
                : 'transparent',
              color: activeFilter === tech
                ? '#fff'
                : muted,
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              borderRadius: '2px',
            }}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          paddingLeft: '6vw',
          paddingRight: '6vw',
          paddingBottom: '24px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: 'grab',
        }}
        onMouseDown={e => {
          const el = scrollRef.current
          el.dataset.down = 'true'
          el.dataset.startX = e.pageX - el.offsetLeft
          el.dataset.scrollLeft = el.scrollLeft
          el.style.cursor = 'grabbing'
        }}
        onMouseLeave={e => {
          scrollRef.current.dataset.down = 'false'
          scrollRef.current.style.cursor = 'grab'
        }}
        onMouseUp={e => {
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
        {filtered.length === 0 ? (
          <p style={{ color: muted, fontFamily: 'var(--font-sans)', fontSize: '0.9rem', padding: '40px 0' }}>
            No projects found for this filter.
          </p>
        ) : (
          filtered.map((project, i) => (
            <div
              key={project.id}
              style={{
                minWidth: '320px',
                maxWidth: '320px',
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.3s ease',
                flexShrink: 0,
                userSelect: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(180,124,124,0.45)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = cardBorder
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.62rem',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#c9a882',
                }}>
                  {project.category}
                </span>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.62rem',
                  color: muted,
                  letterSpacing: '0.1em',
                }}>
                  {project.year}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.3rem',
                fontWeight: 500,
                color: text,
                lineHeight: 1.3,
              }}>
                {project.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: muted,
                flex: 1,
              }}>
                {project.description}
              </p>

              {/* Tech tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.tech.map(t => (
                  <span key={t} style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#b47c7c',
                    border: '1px solid rgba(180,124,124,0.3)',
                    padding: '3px 10px',
                    borderRadius: '2px',
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div style={{ display: 'flex', gap: '16px', paddingTop: '8px', borderTop: `1px solid ${cardBorder}` }}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: muted,
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#b47c7c'}
                  onMouseLeave={e => e.currentTarget.style.color = muted}
                >
                  <FiGithub size={13} /> GitHub
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: muted,
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#b47c7c'}
                    onMouseLeave={e => e.currentTarget.style.color = muted}
                  >
                    <FiExternalLink size={13} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          ))
        )}
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
        opacity: 0.6,
      }}>
        Drag to explore →
      </p>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}