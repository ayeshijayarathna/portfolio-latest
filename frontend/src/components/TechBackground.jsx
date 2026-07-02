import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function TechBackground() {
  const canvasRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animFrame
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init()
    }

    class Node {
      constructor(x, y, big) {
        this.x = x; this.y = y; this.baseX = x; this.baseY = y
        this.driftX = (Math.random() - 0.5) * 0.1
        this.driftY = (Math.random() - 0.5) * 0.1
        this.size = big ? Math.random() * 1.8 + 1.4 : Math.random() * 1 + 0.4
        this.phase = Math.random() * Math.PI * 2
        this.speed = Math.random() * 0.012 + 0.006
        this.warm = Math.random() > 0.45
        this.big = big
      }
      update(w, h) {
        this.baseX += this.driftX; this.baseY += this.driftY
        if (this.baseX < -30) this.baseX = w + 30
        if (this.baseX > w + 30) this.baseX = -30
        if (this.baseY < -30) this.baseY = h + 30
        if (this.baseY > h + 30) this.baseY = -30
        this.x = this.baseX; this.y = this.baseY
        this.phase += this.speed
      }
    }

    class Bokeh {
      constructor(w, h, forceLeft) {
        const skew = Math.pow(Math.random(), 1.8)
        this.x = forceLeft ? w * skew * 0.6 : Math.random() * w
        this.y = Math.random() * h
        this.r = Math.random() * 50 + 20
        this.alpha = Math.random() * 0.07 + 0.025
        this.driftX = (Math.random() - 0.5) * 0.05
        this.driftY = (Math.random() - 0.5) * 0.05
        this.warm = Math.random() > 0.5
      }
      update(w, h) {
        this.x += this.driftX; this.y += this.driftY
        if (this.x < -120) this.x = w + 120
        if (this.x > w + 120) this.x = -120
        if (this.y < -120) this.y = h + 120
        if (this.y > h + 120) this.y = -120
      }
    }

    let nodes = [], bokehs = []

    // palette per mode
    const getPalette = () => isDark
      ? { warm: '212,164,154', cool: '232,224,213', bokehWarm: '212,164,154', bokehCool: '180,200,220' }
      : { warm: '180,124,124', cool: '180,124,124',  bokehWarm: '180,124,124', bokehCool: '201,168,130' }

    function init() {
      const w = canvas.width, h = canvas.height
      const totalArea = w * h
      const count = Math.min(110, Math.max(40, Math.floor(totalArea / 13000)))
      nodes = []
      for (let i = 0; i < count; i++) {
        const x = w * 0.42 + Math.random() * w * 0.58
        const y = Math.random() * h
        nodes.push(new Node(x, y, Math.random() > 0.85))
      }
      bokehs = []
      for (let i = 0; i < 22; i++) bokehs.push(new Bokeh(w, h, true))
    }

    function draw() {
      const w = canvas.width, h = canvas.height
      const p = getPalette()
      ctx.clearRect(0, 0, w, h)
      time += 1

      // LEFT: soft bokeh blur circles
      bokehs.forEach(b => {
        b.update(w, h)
        const color = b.warm ? p.bokehWarm : p.bokehCool
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, `rgba(${color},${b.alpha})`)
        grad.addColorStop(0.5, `rgba(${color},${b.alpha * 0.4})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })

      nodes.forEach(n => n.update(w, h))
      const md = Math.min(150, w / 7)

      // RIGHT: sharp connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < md) {
            const xMid = (nodes[i].x + nodes[j].x) / 2
            if (xMid < w * 0.42) continue
            const horizFade = Math.min(1, (xMid - w * 0.42) / (w * 0.25))
            const alpha = (1 - dist / md) * 0.5 * horizFade
            if (alpha <= 0.01) continue
            const lineColor = (nodes[i].warm || nodes[j].warm) ? p.warm : p.cool
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${lineColor},${alpha})`
            ctx.lineWidth = 0.8
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // RIGHT: glowing nodes
      nodes.forEach(n => {
        if (n.x < w * 0.42) return
        const horizFade = Math.min(1, (n.x - w * 0.42) / (w * 0.25))
        const pulse = (Math.sin(n.phase) + 1) / 2
        const r = n.size + pulse * (n.big ? 1.4 : 0.6)
        const colorRgb = n.warm ? p.warm : p.cool

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * (n.big ? 7 : 4))
        grad.addColorStop(0, `rgba(${colorRgb},${(n.big ? 0.6 : 0.35) * horizFade})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * (n.big ? 7 : 4), 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${colorRgb},${0.95 * horizFade})`
        ctx.fill()
      })

      animFrame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}