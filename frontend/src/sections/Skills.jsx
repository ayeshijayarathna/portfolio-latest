import { useTheme } from '../context/ThemeContext'
import { useEffect, useRef, useState } from 'react'
import {
  FiCode, FiLayout, FiDatabase, FiServer, FiTool,
  FiUsers, FiMessageSquare, FiTarget, FiZap, FiLayers
} from 'react-icons/fi'
import {
  SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss,
  SiJavascript, SiTypescript, SiFigma, SiGit, SiPostman,
  SiCloudinary, SiVercel
} from 'react-icons/si'

const technicalSkills = [
  { name: 'React / Vite', percent: 90 },
  { name: 'Node.js / Express', percent: 85 },
  { name: 'MongoDB / Mongoose', percent: 80 },
  { name: 'JavaScript / TypeScript', percent: 88 },
  { name: 'UI/UX Design (Figma)', percent: 82 },
  { name: 'Tailwind CSS', percent: 90 },
  { name: 'Business Analysis', percent: 85 },
  { name: 'Project Management', percent: 78 },
]

const softSkills = [
  { name: 'Communication', icon: <FiMessageSquare size={20} />, desc: 'Clear & concise across teams' },
  { name: 'Leadership', icon: <FiUsers size={20} />, desc: 'Guide teams with empathy' },
  { name: 'Problem Solving', icon: <FiTarget size={20} />, desc: 'Analytical & creative thinking' },
  { name: 'Adaptability', icon: <FiZap size={20} />, desc: 'Fast learner, embraces change' },
  { name: 'Collaboration', icon: <FiLayers size={20} />, desc: 'Strong team player' },
  { name: 'Critical Thinking', icon: <FiTool size={20} />, desc: 'Data-driven decisions' },
]

const techIcons = [
  { icon: <SiReact size={28} />, name: 'React' },
  { icon: <SiNodedotjs size={28} />, name: 'Node.js' },
  { icon: <SiMongodb size={28} />, name: 'MongoDB' },
  { icon: <SiExpress size={28} />, name: 'Express' },
  { icon: <SiJavascript size={28} />, name: 'JavaScript' },
  { icon: <SiTypescript size={28} />, name: 'TypeScript' },
  { icon: <SiTailwindcss size={28} />, name: 'Tailwind' },
  { icon: <SiFigma size={28} />, name: 'Figma' },
  { icon: <SiGit size={28} />, name: 'Git' },
  { icon: <SiPostman size={28} />, name: 'Postman' },
  { icon: <SiCloudinary size={28} />, name: 'Cloudinary' },
  { icon: <SiVercel size={28} />, name: 'Vercel' },
]

function SkillBar({ skill, index, animate }) {
  const { isDark } = useTheme()
  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.5)' : 'rgba(44,44,44,0.5)'
  const trackBg = isDark ? 'rgba(232,224,213,0.08)' : 'rgba(44,44,44,0.08)'

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.82rem',
          fontWeight: 400,
          color: text,
        }}>
          {skill.name}
        </span>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.72rem',
          fontWeight: 500,
          color: '#c9a882',
        }}>
          {animate ? skill.percent : 0}%
        </span>
      </div>
      <div style={{
        height: '3px',
        backgroundColor: trackBg,
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
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

  return (
    <section id="skills" ref={sectionRef} style={{
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
        06 — Skills
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
          Expertise
          <span style={{ fontStyle: 'italic', color: '#b47c7c' }}> & Skills</span>
        </h2>
        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882' }} />
      </div>

      {/* Top: Skill Bars + Soft Skills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px',
        marginBottom: '72px',
      }} className="skills-top-grid">

        {/* Technical Skill Bars */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#b47c7c',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <FiCode size={14} /> Technical Skills
          </h3>
          {technicalSkills.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} index={i} animate={animate} />
          ))}
        </div>

        {/* Soft Skills */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#b47c7c',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <FiUsers size={14} /> Soft Skills
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}>
            {softSkills.map((skill, i) => (
              <div
                key={skill.name}
                style={{
                  padding: '20px',
                  border: `1px solid ${cardBorder}`,
                  backgroundColor: cardBg,
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  opacity: animate ? 1 : 0,
                  transform: animate ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${i * 0.1}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(180,124,124,0.4)'
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(180,124,124,0.06)' : 'rgba(180,124,124,0.04)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = cardBorder
                  e.currentTarget.style.backgroundColor = cardBg
                }}
              >
                <div style={{ color: '#b47c7c', marginBottom: '10px' }}>
                  {skill.icon}
                </div>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: text,
                  marginBottom: '4px',
                }}>
                  {skill.name}
                </p>
                <p style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  fontWeight: 300,
                  color: muted,
                  lineHeight: 1.5,
                }}>
                  {skill.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Tech Icon Grid */}
      <div>
        <h3 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#b47c7c',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <FiServer size={14} /> Technologies
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          {techIcons.map((tech, i) => (
            <div
              key={tech.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '20px 24px',
                border: `1px solid ${cardBorder}`,
                backgroundColor: cardBg,
                borderRadius: '4px',
                minWidth: '80px',
                transition: 'all 0.3s ease',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${i * 0.06}s`,
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(180,124,124,0.5)'
                e.currentTarget.style.color = '#b47c7c'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = cardBorder
                e.currentTarget.style.color = muted
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ color: muted, transition: 'color 0.3s' }}>
                {tech.icon}
              </div>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.62rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: muted,
                transition: 'color 0.3s',
              }}>
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .skills-top-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  )
}