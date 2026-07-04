import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { FiArrowRight } from 'react-icons/fi'
import { BsLinkedin, BsGithub } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import ScrollReveal from '../components/ScrollReveal'
import { API_BASE_URL } from '../config'

const defaultProfile = {
  name: 'Ayeshi I. Jayarathna',
  tagline: 'A fullstack engineer, UI designer, project manager and business analyst — blending quiet craft with considered strategy to build products that feel inevitable.',
  roles: ['Full Stack Engineer', 'UI/UX Designer', 'Business Analyst', 'Project Manager'],
  estYear: '2023',
  linkedin: 'https://linkedin.com',
  github: 'https://github.com',
  email: 'ayeshi@email.com',
  heroImage: '',
}

export default function Home() {
  const { isDark } = useTheme()
  const [profile, setProfile] = useState(defaultProfile)
  const [currentRole, setCurrentRole] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/profile`).then(r => r.json()).then(data => { if (data?._id) setProfile(data) }).catch(() => {})
  }, [])

  useEffect(() => {
    const roles = profile.roles || []
    if (!roles.length) return
    const role = roles[currentRole % roles.length]
    let timeout
    if (typing) {
      if (displayed.length < role.length) timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 80)
      else timeout = setTimeout(() => setTyping(false), 2000)
    } else {
      if (displayed.length > 0) timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
      else { setCurrentRole(prev => (prev + 1) % roles.length); setTyping(true) }
    }
    return () => clearTimeout(timeout)
  }, [displayed, typing, currentRole, profile.roles])

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const baseUrl = API_BASE_URL

  return (
    <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 6vw', position: 'relative', overflow: 'hidden' }}>


      {/* Left */}
      <div style={{ flex: 1, zIndex: 1, paddingTop: '80px', paddingBottom: '40px' }}>
        <ScrollReveal variant="blur" delay={0.1}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: '#b47c7c', marginBottom: '8px', lineHeight: 1.1, fontWeight: 400 }}>
            {profile.name}
          </h1>
        </ScrollReveal>

        <ScrollReveal variant="fadeLeft" delay={0.2}>
          <div style={{ width: '48px', height: '1.5px', backgroundColor: '#c9a882', marginBottom: '28px' }} />
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.3}>
          <div style={{ marginBottom: '24px', lineHeight: 1.2 }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 600, color: isDark ? '#e8e0d5' : '#2c2c2c', letterSpacing: '0.03em' }}>
              DESIGNER · DEVELOPER
            </p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 400, fontStyle: 'italic', color: isDark ? 'rgba(232,224,213,0.35)' : 'rgba(44,44,44,0.28)', letterSpacing: '0.03em' }}>
              Problem solver
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.4}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.93rem', fontWeight: 300, lineHeight: 1.8, color: isDark ? 'rgba(232,224,213,0.65)' : 'rgba(44,44,44,0.65)', maxWidth: '460px', marginBottom: '28px' }}>
            {profile.tagline}
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.5}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a882', marginBottom: '44px', minHeight: '20px' }}>
            {displayed}
            <span style={{ display: 'inline-block', width: '1.5px', height: '0.85em', backgroundColor: '#c9a882', marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', marginBottom: '44px' }}>
            <button onClick={() => scrollTo('projects')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '13px 30px', border: isDark ? '1px solid rgba(232,224,213,0.35)' : '1px solid #2c2c2c', background: 'transparent', color: isDark ? '#e8e0d5' : '#2c2c2c', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#b47c7c'; e.currentTarget.style.borderColor = '#b47c7c'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = isDark ? 'rgba(232,224,213,0.35)' : '#2c2c2c'; e.currentTarget.style.color = isDark ? '#e8e0d5' : '#2c2c2c' }}>
              View Projects <FiArrowRight size={13} />
            </button>
            <button onClick={() => scrollTo('contact')} style={{ background: 'none', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: isDark ? 'rgba(232,224,213,0.5)' : 'rgba(44,44,44,0.55)', cursor: 'pointer', transition: 'color 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#b47c7c'}
              onMouseLeave={e => e.currentTarget.style.color = isDark ? 'rgba(232,224,213,0.5)' : 'rgba(44,44,44,0.55)'}>
              Contact Me
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.7}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {[{ icon: <BsLinkedin size={15} />, href: profile.linkedin }, { icon: <BsGithub size={15} />, href: profile.github }, { icon: <MdEmail size={17} />, href: `mailto:${profile.email}` }].map((item, i) => (
              <a key={i} href={item.href} target="_blank" rel="noreferrer"
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: isDark ? '1px solid rgba(232,224,213,0.2)' : '1px solid rgba(44,44,44,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)', textDecoration: 'none', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#b47c7c'; e.currentTarget.style.color = '#b47c7c' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? 'rgba(232,224,213,0.2)' : 'rgba(44,44,44,0.2)'; e.currentTarget.style.color = isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)' }}>
                {item.icon}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Right - Avatar */}
      <ScrollReveal variant="fadeRight" delay={0.3} style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', position: 'relative', zIndex: 1, height: '100vh', maxHeight: '100vh' }}>
        <p style={{ position: 'absolute', bottom: '48px', right: '20px', fontFamily: 'var(--font-script)', fontSize: '1.5rem', color: isDark ? 'rgba(212,164,154,0.35)' : 'rgba(180,124,124,0.3)', zIndex: 0 }}>
          est. {profile.estYear}
        </p>
        <img
          src={profile.heroImage ? `${baseUrl}${profile.heroImage}` : '/avatar.png'}
          alt={profile.name}
          style={{ height: '88vh', width: 'auto', maxWidth: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block', filter: isDark ? 'brightness(0.85)' : 'none', position: 'relative', zIndex: 1 }}
        />
      </ScrollReveal>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @media (max-width: 900px) {
          #home { flex-direction: column !important; padding-top: 100px !important; }
        }
      `}</style>
    </section>
  )
}