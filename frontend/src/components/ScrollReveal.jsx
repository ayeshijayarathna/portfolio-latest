import { useEffect, useRef, useState } from 'react'

// Reusable scroll reveal wrapper
// Usage: <ScrollReveal><YourComponent /></ScrollReveal>
// variants: 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scale' | 'blur'

export default function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.15,
  style = {},
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  const variants = {
    fadeUp: {
      hidden: { opacity: 0, transform: 'translateY(40px)' },
      visible: { opacity: 1, transform: 'translateY(0px)' },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    fadeLeft: {
      hidden: { opacity: 0, transform: 'translateX(-40px)' },
      visible: { opacity: 1, transform: 'translateX(0px)' },
    },
    fadeRight: {
      hidden: { opacity: 0, transform: 'translateX(40px)' },
      visible: { opacity: 1, transform: 'translateX(0px)' },
    },
    scale: {
      hidden: { opacity: 0, transform: 'scale(0.88)' },
      visible: { opacity: 1, transform: 'scale(1)' },
    },
    blur: {
      hidden: { opacity: 0, filter: 'blur(12px)', transform: 'translateY(20px)' },
      visible: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' },
    },
    scaleUp: {
      hidden: { opacity: 0, transform: 'scale(0.8) translateY(30px)' },
      visible: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    },
  }

  const v = variants[variant] || variants.fadeUp

  return (
    <div
      ref={ref}
      style={{
        ...v[visible ? 'visible' : 'hidden'],
        transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}