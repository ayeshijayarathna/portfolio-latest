import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { FiArrowRight } from 'react-icons/fi'
import { BsLinkedin, BsGithub } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

const roles = ['Full Stack Engineer', 'UI/UX Designer', 'Business Analyst', 'Project Manager']

export default function Home() {
  const { isDark } = useTheme()
  const [currentRole, setCurrentRole] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const role = roles[currentRole]
    let timeout
    if (typing) {
      if (displayed.length < role.length) {
        timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 80)
      } else {
        timeout = setTimeout(() => setTyping(false), 2000)
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
      } else {
        setCurrentRole((prev) => (prev + 1) % roles.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, typing, currentRole])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 6vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isDark
          ? 'radial-gradient(ellipse at 70% 50%, rgba(180,124,124,0.08) 0%, transparent 60%)'
          : 'radial-gradient(ellipse at 70% 50%, rgba(212,164,154,0.18) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      {/* Left Content */}
      <div style={{ flex: 1, zIndex: 1, paddingTop: '80px', paddingBottom: '40px' }}>

        {/* Script Name */}
       <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
        color: '#b47c7c',
        marginBottom: '8px',
        lineHeight: 1.1,
        fontWeight: 400,
        letterSpacing: '0.02em',
        }}>
        Ayeshi I. Jayarathna
        </h1>

        {/* Divider */}
        <div style={{
          width: '48px',
          height: '1.5px',
          backgroundColor: '#c9a882',
          marginBottom: '28px',
        }} />

        {/* Roles */}
        <div style={{ marginBottom: '24px', lineHeight: 1.2 }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            fontWeight: 600,
            color: isDark ? '#e8e0d5' : '#2c2c2c',
            letterSpacing: '0.03em',
          }}>
            DESIGNER · ENGINEER
          </p>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: isDark ? 'rgba(232,224,213,0.35)' : 'rgba(44,44,44,0.28)',
            letterSpacing: '0.03em',
          }}>
            Storyteller
          </p>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.93rem',
          fontWeight: 300,
          lineHeight: 1.8,
          color: isDark ? 'rgba(232,224,213,0.65)' : 'rgba(44,44,44,0.65)',
          maxWidth: '460px',
          marginBottom: '28px',
        }}>
          A fullstack engineer, UI designer, project manager and business analyst —
          blending quiet craft with considered strategy to build products that feel inevitable.
        </p>

        {/* Typewriter */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.68rem',
          fontWeight: 500,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#c9a882',
          marginBottom: '44px',
          minHeight: '20px',
        }}>
          {displayed}
          <span style={{
            display: 'inline-block',
            width: '1.5px',
            height: '0.85em',
            backgroundColor: '#c9a882',
            marginLeft: '2px',
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          }} />
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          flexWrap: 'wrap',
          marginBottom: '44px',
        }}>
          <button
            onClick={() => scrollTo('projects')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 30px',
              border: isDark ? '1px solid rgba(232,224,213,0.35)' : '1px solid #2c2c2c',
              background: 'transparent',
              color: isDark ? '#e8e0d5' : '#2c2c2c',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#b47c7c'
              e.currentTarget.style.borderColor = '#b47c7c'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = isDark ? 'rgba(232,224,213,0.35)' : '#2c2c2c'
              e.currentTarget.style.color = isDark ? '#e8e0d5' : '#2c2c2c'
            }}
          >
            View Projects <FiArrowRight size={13} />
          </button>

          <button
            onClick={() => scrollTo('contact')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: isDark ? 'rgba(232,224,213,0.5)' : 'rgba(44,44,44,0.55)',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#b47c7c'}
            onMouseLeave={e => e.currentTarget.style.color = isDark ? 'rgba(232,224,213,0.5)' : 'rgba(44,44,44,0.55)'}
          >
            Contact Me
          </button>
        </div>

        {/* Social Icons */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          {[
            { icon: <BsLinkedin size={15} />, href: 'https://linkedin.com' },
            { icon: <BsGithub size={15} />, href: 'https://github.com' },
            { icon: <MdEmail size={17} />, href: 'mailto:ayeshi@email.com' },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: isDark ? '1px solid rgba(232,224,213,0.2)' : '1px solid rgba(44,44,44,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#b47c7c'
                e.currentTarget.style.color = '#b47c7c'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = isDark ? 'rgba(232,224,213,0.2)' : 'rgba(44,44,44,0.2)'
                e.currentTarget.style.color = isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)'
              }}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Right - Avatar */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'relative',
        zIndex: 1,
        height: '100vh',
        maxHeight: '100vh',
      }}>

        {/* est. text */}
        <p style={{
          position: 'absolute',
          bottom: '48px',
          right: '20px',
          fontFamily: 'var(--font-script)',
          fontSize: '1.5rem',
          color: isDark ? 'rgba(212,164,154,0.35)' : 'rgba(180,124,124,0.3)',
          zIndex: 0,
        }}>
          est. 2022
        </p>

        {/* Avatar - full height, bottom aligned */}
        <img
          src="/avatar.png"
          alt="Ayeshi Jayarathna"
          style={{
            height: '88vh',
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
            filter: isDark ? 'brightness(0.85)' : 'none',
            position: 'relative',
            zIndex: 1,
          }}
        />
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 900px) {
          #home {
            flex-direction: column !important;
            padding-top: 100px !important;
            align-items: flex-start !important;
          }
          #home > div:last-child {
            height: 400px !important;
            width: 100% !important;
            justify-content: center !important;
          }
          #home > div:last-child img {
            height: 400px !important;
            width: auto !important;
          }
        }
      `}</style>
    </section>
  )
}