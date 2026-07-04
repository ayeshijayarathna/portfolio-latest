import { useTheme } from '../context/ThemeContext'
import { useEffect, useRef, useState } from 'react'
import { FiCode, FiUsers, FiServer } from 'react-icons/fi'
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss, SiJavascript, SiTypescript, SiFigma, SiGit, SiPostman, SiCloudinary, SiVercel } from 'react-icons/si'
import { API_BASE_URL } from '../config'

const techIcons = {
  React: <SiReact size={26} />, 'Node.js': <SiNodedotjs size={26} />, MongoDB: <SiMongodb size={26} />,
  Express: <SiExpress size={26} />, JavaScript: <SiJavascript size={26} />, TypeScript: <SiTypescript size={26} />,
  Tailwind: <SiTailwindcss size={26} />, Figma: <SiFigma size={26} />, Git: <SiGit size={26} />,
  Postman: <SiPostman size={26} />, Cloudinary: <SiCloudinary size={26} />, Vercel: <SiVercel size={26} />,
}

function SkillBar({ skill, index, animate, isDark }) {
  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 400, color: text }}>{skill.name}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 500, color: '#c9a882' }}>{skill.percent}%</span>
      </div>
      <div style={{ height: '3px', backgroundColor: isDark ? 'rgba(232,224,213,0.08)' : 'rgba(44,44,44,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: animate ? `${skill.percent}%` : '0%',
          background: 'linear-gradient(90deg, #b47c7c, #c9a882)',
          borderRadius: '2px',
          transition: `width 1s ease ${index * 0.1}s`,
        }} />
      </div>
    </div>
  )
}

export default function Skills() {
  const { isDark } = useTheme()
  const sectionRef = useRef(null)
  const [animate, setAnimate] = useState(false)
  const [skills, setSkills] = useState([])

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/skills`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSkills(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect() } },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)'
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'
  const cardBorder = isDark ? 'rgba(232,224,213,0.08)' : 'rgba(44,44,44,0.1)'

  const technical = skills.filter(s => s.category === 'technical')
  const soft = skills.filter(s => s.category === 'soft')
  const tools = skills.filter(s => s.category === 'tool')

  return (
    <section id="skills" ref={sectionRef} style={{ minHeight: '100vh', padding: '100px 6vw', position: 'relative' }}>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a882', marginBottom: '16px' }}>
        06 — Skills
      </p>
      <div style={{ marginBottom: '64px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: text, lineHeight: 1.2, marginBottom: '8px' }}>
          Expertise<span style={{ fontStyle: 'italic', color: '#b47c7c' }}> & Skills</span>
        </h2>
        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882' }} />
      </div>

      {skills.length === 0 ? (
        <p style={{ color: muted, fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>No skills added yet.</p>
      ) : (
        <>
          {/* Technical + Soft */}
          {(technical.length > 0 || soft.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', marginBottom: '72px' }} className="skills-top-grid">
              {technical.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b47c7c', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiCode size={14} /> Technical Skills
                  </h3>
                  {technical.map((skill, i) => (
                    <SkillBar key={skill._id} skill={skill} index={i} animate={animate} isDark={isDark} />
                  ))}
                </div>
              )}

              {soft.length > 0 && (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b47c7c', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiUsers size={14} /> Soft Skills
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    {soft.map((skill, i) => (
                      <div key={skill._id}
                        style={{ padding: '18px', border: `1px solid ${cardBorder}`, backgroundColor: cardBg, borderRadius: '4px', transition: 'all 0.3s ease', opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transitionDelay: `${i * 0.1}s` }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(180,124,124,0.4)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = cardBorder}
                      >
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 500, color: text, marginBottom: '4px' }}>{skill.name}</p>
                        {skill.desc && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 300, color: muted, lineHeight: 1.5 }}>{skill.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tech Icon Grid */}
          {tools.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b47c7c', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiServer size={14} /> Technologies
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                {tools.map((tech, i) => (
                  <div key={tech._id}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 22px', border: `1px solid ${cardBorder}`, backgroundColor: cardBg, borderRadius: '4px', minWidth: '76px', transition: 'all 0.3s ease', opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transitionDelay: `${i * 0.06}s`, cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180,124,124,0.5)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ color: muted }}>
                      {techIcons[tech.name] || <FiCode size={26} />}
                    </div>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.08em', color: muted }}>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .skills-top-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}