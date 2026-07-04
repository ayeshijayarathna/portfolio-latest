import { useTheme } from '../context/ThemeContext'
import { useState, useRef, useEffect } from 'react'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { API_BASE_URL, fetchWithRetry } from '../config'

const allTechFilters = ['All', 'React', 'Node.js', 'MongoDB', 'Express', 'Tailwind', 'Figma']

export default function Projects() {
  const { isDark } = useTheme()
  const [projects, setProjects] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')
  const scrollRef = useRef(null)
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0 })

  useEffect(() => {
    fetchWithRetry(`${API_BASE_URL}/api/projects`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setProjects(data) })
      .catch(() => {})
  }, [])

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.tech?.includes(activeFilter))

  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)'
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'
  const cardBorder = isDark ? 'rgba(232,224,213,0.08)' : 'rgba(44,44,44,0.1)'

  // Dynamic tech filters from loaded projects
  const techSet = new Set(['All'])
  projects.forEach(p => p.tech?.forEach(t => techSet.add(t)))
  const techFilters = projects.length > 0 ? Array.from(techSet) : allTechFilters

  const baseUrl = API_BASE_URL

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
        04 — Projects
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
        {techFilters.map(tech => (
          <button
            key={tech}
            onClick={() => setActiveFilter(tech)}
            style={{
              padding: '7px 18px',
              border: activeFilter === tech ? '1px solid #b47c7c' : `1px solid ${cardBorder}`,
              backgroundColor: activeFilter === tech ? '#b47c7c' : 'transparent',
              color: activeFilter === tech ? '#fff' : muted,
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

      {/* Horizontal Scroll */}
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
          drag.current = { down: true, startX: e.pageX - scrollRef.current.offsetLeft, scrollLeft: scrollRef.current.scrollLeft }
          scrollRef.current.style.cursor = 'grabbing'
        }}
        onMouseLeave={() => { drag.current.down = false; scrollRef.current.style.cursor = 'grab' }}
        onMouseUp={() => { drag.current.down = false; scrollRef.current.style.cursor = 'grab' }}
        onMouseMove={e => {
          if (!drag.current.down) return
          e.preventDefault()
          scrollRef.current.scrollLeft = drag.current.scrollLeft - (e.pageX - scrollRef.current.offsetLeft - drag.current.startX) * 1.5
        }}
      >
        {projects.length === 0 ? (
          <p style={{ color: muted, fontFamily: 'var(--font-sans)', fontSize: '0.9rem', padding: '40px 0' }}>
            No projects yet. Add some from the admin dashboard.
          </p>
        ) : filtered.length === 0 ? (
          <p style={{ color: muted, fontFamily: 'var(--font-sans)', fontSize: '0.9rem', padding: '40px 0' }}>
            No projects found for this filter.
          </p>
        ) : (
          filtered.map(project => {
            const imgSrc = project.image
              ? project.image.startsWith('/') ? baseUrl + project.image : project.image
              : null

            return (
              <div
                key={project._id || project.id}
                style={{
                  minWidth: '320px',
                  maxWidth: '320px',
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  userSelect: 'none',
                  overflow: 'hidden',
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
                {/* Project Image */}
                {imgSrc && (
                  <div style={{ width: '100%', height: '160px', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={imgSrc}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => e.target.parentNode.style.display = 'none'}
                    />
                  </div>
                )}

                {/* Card Content */}
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  {/* Category + Year */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 500,
                      letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a882',
                    }}>
                      {project.category}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: muted, letterSpacing: '0.1em' }}>
                      {project.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 500,
                    color: text, lineHeight: 1.3,
                  }}>
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 300,
                    lineHeight: 1.7, color: muted, flex: 1,
                  }}>
                    {project.description}
                  </p>

                  {/* Tech tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {project.tech?.map(t => (
                      <span key={t} style={{
                        fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500,
                        letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b47c7c',
                        border: '1px solid rgba(180,124,124,0.3)', padding: '3px 10px', borderRadius: '2px',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: '16px', paddingTop: '8px', borderTop: `1px solid ${cardBorder}` }}>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, textDecoration: 'none', transition: 'color 0.2s ease' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#b47c7c'}
                        onMouseLeave={e => e.currentTarget.style.color = muted}
                      >
                        <FiGithub size={13} /> GitHub
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, textDecoration: 'none', transition: 'color 0.2s ease' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#b47c7c'}
                        onMouseLeave={e => e.currentTarget.style.color = muted}
                      >
                        <FiExternalLink size={13} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Scroll hint */}
      <p style={{
        paddingLeft: '6vw', marginTop: '16px',
        fontFamily: 'var(--font-sans)', fontSize: '0.62rem',
        letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, opacity: 0.6,
      }}>
        Drag to explore →
      </p>

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </section>
  )
}