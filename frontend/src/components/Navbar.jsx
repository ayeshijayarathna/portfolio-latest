import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { BsSun, BsMoon } from 'react-icons/bs'
import { RiMenuLine, RiCloseLine } from 'react-icons/ri'

const navLinks = ['Home', 'About', 'Education', 'Certificates', 'Experience', 'Projects', 'Skills']

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, link) => {
    e.preventDefault()
    const section = document.getElementById(link.toLowerCase())
    if (section) section.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: scrolled ? '12px 48px' : '20px 48px',
      backgroundColor: scrolled
        ? isDark ? 'rgba(15,15,15,0.95)' : 'rgba(250,247,242,0.95)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      borderBottom: scrolled
        ? isDark ? '1px solid rgba(212,164,154,0.15)' : '1px solid rgba(212,164,154,0.3)'
        : 'none'
    }}>

      {/* Logo */}
      <span style={{
        fontFamily: 'var(--font-script)',
        fontSize: '1.8rem',
        color: '#d4a49a',
        cursor: 'pointer'
      }} onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}>
        Ayeshi
      </span>

      {/* Desktop Nav */}
      <ul className="desktop-nav" style={{
        display: 'flex',
        gap: '28px',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        alignItems: 'center',
      }}>
        {navLinks.map(link => (
          <li key={link}>
            <a
              href={'#' + link.toLowerCase()}
              onClick={(e) => handleNavClick(e, link)}
              onMouseEnter={e => e.target.style.color = '#d4a49a'}
              onMouseLeave={e => e.target.style.color = isDark ? '#e8e0d5' : '#2c2c2c'}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: isDark ? '#e8e0d5' : '#2c2c2c',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              {link}
            </a>
          </li>
        ))}

        {/* Contact Button */}
        <li>
          <button
            onClick={scrollToContact}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '8px 20px',
              border: '1px solid #b47c7c',
              backgroundColor: 'transparent',
              color: '#b47c7c',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#b47c7c'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#b47c7c'
            }}
          >
            Contact
          </button>
        </li>
      </ul>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDark ? '#e8e0d5' : '#2c2c2c',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
        >
          {isDark ? <BsSun size={18} /> : <BsMoon size={18} />}
        </button>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDark ? '#e8e0d5' : '#2c2c2c',
            alignItems: 'center',
          }}
        >
          {menuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: isDark ? 'rgba(15,15,15,0.98)' : 'rgba(250,247,242,0.98)',
          backdropFilter: 'blur(10px)',
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          borderBottom: '1px solid rgba(212,164,154,0.3)'
        }}>
          {navLinks.map(link => (
            <a
              key={link}
              href={'#' + link.toLowerCase()}
              onClick={(e) => handleNavClick(e, link)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: isDark ? '#e8e0d5' : '#2c2c2c',
                textDecoration: 'none',
              }}
            >
              {link}
            </a>
          ))}
          <button
            onClick={scrollToContact}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '10px 20px',
              border: '1px solid #b47c7c',
              backgroundColor: 'transparent',
              color: '#b47c7c',
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            Contact
          </button>
        </div>
      )}
    </nav>
  )
}