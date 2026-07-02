import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function CustomCursor() {
  const { isDark } = useTheme()
  const cursorRef = useRef(null)
  const trailRef = useRef(null)
  const [isHover, setIsHover] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const pos = useRef({ x: -100, y: -100 })
  const trail = useRef({ x: -100, y: -100 })
  const animFrame = useRef(null)
  const lastSparkle = useRef(0)

  useEffect(() => {
    document.body.style.cursor = 'none'

    const move = e => {
      pos.current = { x: e.clientX, y: e.clientY }

      // throttle sparkles — max 1 every 80ms to prevent lag
      const now = Date.now()
      if (now - lastSparkle.current > 80 && Math.random() > 0.5) {
        lastSparkle.current = now
        const sparkle = document.createElement('div')
        const size = Math.random() * 4 + 2
        sparkle.style.cssText = `
          position:fixed;
          left:${e.clientX - size/2}px;
          top:${e.clientY - size/2}px;
          width:${size}px;height:${size}px;
          border-radius:50%;
          background:${isDark ? '#d4a49a' : '#b47c7c'};
          pointer-events:none;
          z-index:99998;
          animation:sparkle-fade 0.5s ease forwards;
        `
        document.body.appendChild(sparkle)
        setTimeout(() => sparkle.remove(), 500)
      }
    }

    const over = e => {
      if (e.target.matches('a,button,[role="button"],input,textarea,select,label')) setIsHover(true)
    }
    const out = () => setIsHover(false)
    const down = () => setIsClick(true)
    const up = () => setIsClick(false)

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    window.addEventListener('mouseout', out, { passive: true })
    window.addEventListener('mousedown', down, { passive: true })
    window.addEventListener('mouseup', up, { passive: true })

    const animate = () => {
      trail.current.x += (pos.current.x - trail.current.x) * 0.12
      trail.current.y += (pos.current.y - trail.current.y) * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)`
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trail.current.x}px, ${trail.current.y}px) translate(-50%,-50%)`
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
  const accentLight = isDark ? 'rgba(212,164,154,0.12)' : 'rgba(180,124,124,0.1)'

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        @keyframes sparkle-fade {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(0) translateY(-6px); }
        }
        @keyframes cursor-pulse {
          0%,100% { box-shadow: 0 0 0 0 ${accentLight}; }
          50% { box-shadow: 0 0 0 6px ${accentLight}; }
        }
      `}</style>

      {/* Dot */}
      <div ref={cursorRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: isClick ? '7px' : '9px',
        height: isClick ? '7px' : '9px',
        backgroundColor: accent,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
        boxShadow: `0 0 ${isHover ? '8px' : '3px'} ${accent}`,
        transition: 'width 0.12s, height 0.12s',
      }} />

      {/* Ring */}
      <div ref={trailRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: isHover ? '42px' : isClick ? '26px' : '34px',
        height: isHover ? '42px' : isClick ? '26px' : '34px',
        border: `1.5px solid ${accent}`,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99998,
        willChange: 'transform',
        backgroundColor: isHover ? accentLight : 'transparent',
        transition: 'width 0.2s ease, height 0.2s ease',
        animation: isHover ? 'cursor-pulse 1.2s ease infinite' : 'none',
      }} />
    </>
  )
}