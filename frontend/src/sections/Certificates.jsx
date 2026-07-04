import { useTheme } from '../context/ThemeContext'
import { useRef, useState, useEffect } from 'react'
import { FiExternalLink, FiAward, FiX } from 'react-icons/fi'
import { API_BASE_URL } from '../config'

const colors = ['#d4a49a', '#c9a882', '#b47c7c', '#9a9a9a', '#d4a49a', '#c9a882']

export default function Certificates() {
  const { isDark } = useTheme()
  const scrollRef = useRef(null)
  const [certificates, setCertificates] = useState([])
  const [selected, setSelected] = useState(null)
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0 })

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/certificates`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCertificates(data) })
      .catch(() => {})
  }, [])

  const text = isDark ? '#e8e0d5' : '#2c2c2c'
  const muted = isDark ? 'rgba(232,224,213,0.55)' : 'rgba(44,44,44,0.55)'
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)'
  const cardBorder = isDark ? 'rgba(232,224,213,0.1)' : 'rgba(44,44,44,0.1)'
  const baseUrl = API_BASE_URL

  return (
    <section id="certificates" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <p style={{ paddingLeft: '6vw', fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9a882', marginBottom: '16px' }}>
        03 — Certificates
      </p>
      <div style={{ paddingLeft: '6vw', marginBottom: '48px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: text, lineHeight: 1.2, marginBottom: '8px' }}>
          Credentials<span style={{ fontStyle: 'italic', color: '#b47c7c' }}> & Achievements</span>
        </h2>
        <div style={{ width: '40px', height: '1.5px', backgroundColor: '#c9a882' }} />
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: muted, marginTop: '12px', fontWeight: 300 }}>
          Click any certificate to view full size.
        </p>
      </div>

      {certificates.length === 0 ? (
        <p style={{ paddingLeft: '6vw', color: muted, fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>
          No certificates yet.
        </p>
      ) : (
        <>
          <div
            ref={scrollRef}
            style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingLeft: '6vw', paddingRight: '6vw', paddingBottom: '20px', scrollbarWidth: 'none', cursor: 'grab' }}
            onMouseDown={e => { drag.current = { down: true, startX: e.pageX - scrollRef.current.offsetLeft, scrollLeft: scrollRef.current.scrollLeft }; scrollRef.current.style.cursor = 'grabbing' }}
            onMouseLeave={() => { drag.current.down = false; scrollRef.current.style.cursor = 'grab' }}
            onMouseUp={() => { drag.current.down = false; scrollRef.current.style.cursor = 'grab' }}
            onMouseMove={e => { if (!drag.current.down) return; e.preventDefault(); scrollRef.current.scrollLeft = drag.current.scrollLeft - (e.pageX - scrollRef.current.offsetLeft - drag.current.startX) * 1.5 }}
          >
            {certificates.map((cert, i) => {
              const color = colors[i % colors.length]
              const imgSrc = cert.image
                ? cert.image.startsWith('/') ? baseUrl + cert.image : cert.image
                : null

              return (
                <div
                  key={cert._id}
                  onClick={() => setSelected({ ...cert, imgSrc })}
                  style={{ minWidth: '320px', maxWidth: '320px', flexShrink: 0, cursor: 'pointer', userSelect: 'none', transition: 'transform 0.3s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                >
                  {/* Image area */}
                  <div style={{ width: '100%', height: '200px', backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderTop: `3px solid ${color}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {imgSrc ? (
                      <img src={imgSrc} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color, padding: '20px' }}>
                        <FiAward size={32} style={{ marginBottom: '8px' }} />
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', lineHeight: 1.4 }}>{cert.title}</p>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderTop: 'none', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 500, color: text, marginBottom: '3px' }}>{cert.title}</p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: '#c9a882' }}>{cert.issuer} · {cert.date}</p>
                    </div>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                        style={{ color: muted, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = color}
                        onMouseLeave={e => e.currentTarget.style.color = muted}
                      >
                        <FiExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <p style={{ paddingLeft: '6vw', marginTop: '12px', fontFamily: 'var(--font-sans)', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted, opacity: 0.5 }}>
            Drag to explore →
          </p>
        </>
      )}

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '800px', width: '100%' }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: '#e8e0d5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', letterSpacing: '0.15em' }}>
              <FiX size={16} /> Close
            </button>
            {selected.imgSrc
              ? <img src={selected.imgSrc} alt={selected.title} style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid rgba(232,224,213,0.15)' }} />
              : <div style={{ backgroundColor: 'rgba(15,15,15,0.95)', padding: '80px', textAlign: 'center', border: '1px solid rgba(232,224,213,0.1)' }}>
                  <FiAward size={48} style={{ color: '#b47c7c', marginBottom: '16px' }} />
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#e8e0d5' }}>{selected.title}</p>
                </div>
            }
            <div style={{ backgroundColor: 'rgba(15,15,15,0.95)', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(232,224,213,0.1)', borderTop: 'none' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#e8e0d5', marginBottom: '4px' }}>{selected.title}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#c9a882' }}>{selected.issuer} · {selected.date}</p>
              </div>
              {selected.link && (
                <a href={selected.link} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b47c7c', textDecoration: 'none', border: '1px solid #b47c7c', padding: '8px 16px', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#b47c7c'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#b47c7c' }}
                >
                  <FiExternalLink size={12} /> Verify
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </section>
  )
}