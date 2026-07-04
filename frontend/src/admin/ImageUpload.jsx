import { useState, useRef } from 'react'
import { FiUpload, FiX, FiCheck } from 'react-icons/fi'
import { API_BASE_URL } from '../config'

// Reusable image upload component for admin dashboard
export function ImageUpload({ onUpload, currentUrl, endpoint = 'image', label = 'Upload Image', accept = 'image/*' }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || null)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append(endpoint === 'certificate' ? 'file' : 'image', file)

    // Preview
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(file)

    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${API_BASE_URL}/api/upload/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        const url = data.url || data.path
        onUpload(url)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const labelStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.6rem',
    fontWeight: 500,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(232,224,213,0.45)',
    display: 'block',
    marginBottom: '8px',
  }

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        style={{
          border: '1px dashed rgba(180,124,124,0.4)',
          borderRadius: '4px',
          padding: preview ? '8px' : '24px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          position: 'relative',
          backgroundColor: 'rgba(180,124,124,0.04)',
        }}
      >
        {preview ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={preview} alt="preview" style={{ maxHeight: '120px', maxWidth: '100%', display: 'block', borderRadius: '2px' }} />
            <button
              onClick={e => { e.stopPropagation(); setPreview(null); onUpload('') }}
              style={{ position: 'absolute', top: '-8px', right: '-8px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#c97b7b', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FiX size={10} />
            </button>
          </div>
        ) : (
          <div>
            {uploading ? (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#c9a882' }}>Uploading...</p>
            ) : (
              <>
                <FiUpload size={20} style={{ color: 'rgba(180,124,124,0.6)', marginBottom: '8px' }} />
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(232,224,213,0.4)' }}>
                  Click or drag to upload
                </p>
              </>
            )}
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
      </div>
      {error && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#c97b7b', marginTop: '6px' }}>{error}</p>}
    </div>
  )
}