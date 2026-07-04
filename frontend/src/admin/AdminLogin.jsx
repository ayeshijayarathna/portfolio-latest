import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('adminToken', data.token)
        navigate('/admin/dashboard')
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Server error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f0f0f',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(232,224,213,0.1)',
        borderTop: '3px solid #b47c7c',
        borderRadius: '4px',
        padding: '48px 40px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: 'var(--font-script)',
            fontSize: '2.5rem',
            color: '#b47c7c',
            marginBottom: '8px',
          }}>
            Ayeshi
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(232,224,213,0.4)',
          }}>
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(232,224,213,0.5)',
              display: 'block',
              marginBottom: '8px',
            }}>
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(232,224,213,0.12)',
                borderRadius: '3px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                color: '#e8e0d5',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
              }}
              onFocus={e => e.target.style.borderColor = '#b47c7c'}
              onBlur={e => e.target.style.borderColor = 'rgba(232,224,213,0.12)'}
            />
          </div>

          <div>
            <label style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(232,224,213,0.5)',
              display: 'block',
              marginBottom: '8px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(232,224,213,0.12)',
                borderRadius: '3px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                color: '#e8e0d5',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
              }}
              onFocus={e => e.target.style.borderColor = '#b47c7c'}
              onBlur={e => e.target.style.borderColor = 'rgba(232,224,213,0.12)'}
            />
          </div>

          {error && (
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem',
              color: '#c97b7b',
              textAlign: 'center',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '13px',
              backgroundColor: '#b47c7c',
              border: 'none',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              borderRadius: '2px',
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#9d6868' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#b47c7c' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}