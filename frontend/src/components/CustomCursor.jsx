import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function CustomCursor() {
  const { isDark } = useTheme()
  const cursorRef = useRef(null)
  const trailRef = useRef(null)
  const [isHover, setIsHover] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const trail = useRef({ x: 0, y: 0 })
  const animFrame = useRef(null)
  const sparkles = useRef([])

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none'

    const move = e => {
      pos.current = { x: e.clientX, y: e.clientY }

      // Sparkle on move
      if (Math.random() > 0.7) {
        const sparkle = document.createElement('div')
        const size = Math.random() * 5 + 3
        sparkle.style.cssText = `
          position: fixed;
          left: ${e.clientX - size / 2}px;
          top: ${e.clientY - size / 2}px;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${isDark ? '#d4a49a' : '#b47c7c'};
          pointer-events: none;
          z-index: 99998;
          animation: sparkle-fade 0.6s ease forwards;
        `
        document.body.appendChild(sparkle)
        setTimeout(() => sparkle.remove(), 600)
      }
    }

    const over = e => {
      const el = e.target
      if (el.matches('a, button, [role="button"], input, textarea, select, label')) {
        setIsHover(true)
      }
    }
    const out = () => setIsHover(false)
    const down = () => setIsClick(true)
    const up = () => setIsClick(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mouseout', out)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)

    // Smooth trail animation
    const animate = () => {
      trail.current.x += (pos.current.x - trail.current.x) * 0.12
      trail.current.y += (pos.current.y - trail.current.y) * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.left = pos.current.x + 'px'
        cursorRef.current.style.top = pos.current.y + 'px'
      }
      if (trailRef.current) {
        trailRef.current.style.left = trail.current.x + 'px'
        trailRef.current.style.top = trail.current.y + 'px'
      }
      animFrame.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mouseout', out)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      cancelAnimationFrame(animFrame.current)
    }
  }, [isDark])

  const accent = isDark ? '#d4a49a' : '#b47c7c'
  const accentLight = isDark ? 'rgba(212,164,154,0.15)' : 'rgba(180,124,124,0.12)'

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        @keyframes sparkle-fade {
          0% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(0) translateY(-8px); }
        }
        @keyframes cursor-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>

      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: isClick ? '8px' : '10px',
          height: isClick ? '8px' : '10px',
          backgroundColor: accent,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.15s, height 0.15s, background 0.3s',
          boxShadow: `0 0 ${isHover ? '10px' : '4px'} ${accent}`,
          mixBlendMode: isDark ? 'screen' : 'multiply',
        }}
      />

      {/* Trail ring */}
      <div
        ref={trailRef}
        style={{
          position: 'fixed',
          width: isHover ? '44px' : isClick ? '28px' : '36px',
          height: isHover ? '44px' : isClick ? '28px' : '36px',
          border: `1.5px solid ${accent}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.3s',
          backgroundColor: isHover ? accentLight : 'transparent',
          animation: isHover ? 'cursor-pulse 1.2s ease infinite' : 'none',
        }}
      />
    </>
  )
}