import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLogOut, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSun, FiMoon, FiUpload } from 'react-icons/fi'
import { BsGrid, BsBook, BsBriefcase, BsAward, BsLightning, BsChatDots, BsPerson } from 'react-icons/bs'

const tabs = [
  { id: 'profile', label: 'Home & About', icon: <BsPerson size={16} /> },
  { id: 'projects', label: 'Projects', icon: <BsGrid size={16} /> },
  { id: 'education', label: 'Education', icon: <BsBook size={16} /> },
  { id: 'experience', label: 'Experience', icon: <BsBriefcase size={16} /> },
  { id: 'certificates', label: 'Certificates', icon: <BsAward size={16} /> },
  { id: 'skills', label: 'Skills', icon: <BsLightning size={16} /> },
  { id: 'messages', label: 'Messages', icon: <BsChatDots size={16} /> },
]

const token = () => localStorage.getItem('adminToken')
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` })

function useApi(endpoint) {
  const get = () => fetch(`/api/${endpoint}`, { headers: authHeaders() }).then(r => r.json())
  const post = body => fetch(`/api/${endpoint}`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(r => r.json())
  const put = (id, body) => fetch(`/api/${endpoint}/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) }).then(r => r.json())
  const putSingle = body => fetch(`/api/${endpoint}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) }).then(r => r.json())
  const del = id => fetch(`/api/${endpoint}/${id}`, { method: 'DELETE', headers: authHeaders() }).then(r => r.json())
  return { get, post, put, putSingle, del }
}

function getStyles(isDark) {
  const text = isDark ? '#e8e0d5' : '#1a1a1a'
  const muted = isDark ? 'rgba(232,224,213,0.55)' : 'rgba(26,26,26,0.55)'
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff'
  const cardBorder = isDark ? 'rgba(232,224,213,0.1)' : 'rgba(26,26,26,0.12)'
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f5f0'
  const inputBorder = isDark ? 'rgba(232,224,213,0.12)' : 'rgba(26,26,26,0.15)'
  const labelColor = isDark ? 'rgba(232,224,213,0.45)' : 'rgba(26,26,26,0.5)'
  return {
    text, muted, cardBg, cardBorder, inputBg, inputBorder, labelColor,
    sectionTitle: { fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400, color: text },
    addBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', backgroundColor: '#b47c7c', border: 'none', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' },
    saveBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: '#b47c7c', border: 'none', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', cursor: 'pointer', borderRadius: '2px' },
    cancelBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: 'transparent', border: `1px solid ${cardBorder}`, color: muted, fontFamily: 'var(--font-sans)', fontSize: '0.68rem', cursor: 'pointer', borderRadius: '2px' },
    iconBtn: { background: 'none', border: 'none', color: muted, cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' },
    formCard: { backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '4px', padding: '28px', marginBottom: '24px' },
    formGrid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
    formLabel: { fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: labelColor, display: 'block', marginBottom: '6px' },
    formInput: { width: '100%', padding: '10px 14px', backgroundColor: inputBg, border: `1px solid ${inputBorder}`, borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: text, outline: 'none', boxSizing: 'border-box' },
    itemCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', backgroundColor: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '4px' },
    itemTitle: { fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 500, color: text, marginBottom: '3px' },
    itemMeta: { fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: muted, fontWeight: 300 },
  }
}

// ---- IMAGE UPLOAD COMPONENT ----
function ImageUploadBox({ label, currentUrl, onUpload, isDark, endpoint = 'image' }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || null)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const s = getStyles(isDark)

  useEffect(() => { setPreview(currentUrl || null) }, [currentUrl])

  const handleFile = async file => {
    if (!file) return
    setUploading(true)
    setError('')
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append(endpoint === 'certificate' ? 'file' : 'image', file)

    try {
      const res = await fetch(`/api/upload/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
        body: formData,
      })
      const data = await res.json()
      if (res.ok) onUpload(data.url)
      else setError(data.error || 'Upload failed')
    } catch { setError('Upload failed') }
    finally { setUploading(false) }
  }

  const baseUrl = 'http://localhost:5000'
  const displayUrl = preview?.startsWith('/') ? baseUrl + preview : preview

  return (
    <div>
      <label style={s.formLabel}>{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        style={{
          border: `1px dashed rgba(180,124,124,0.45)`,
          borderRadius: '4px',
          padding: preview ? '8px' : '28px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDark ? 'rgba(180,124,124,0.04)' : 'rgba(180,124,124,0.03)',
          position: 'relative',
          transition: 'border-color 0.2s',
        }}
      >
        {displayUrl ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={displayUrl} alt="preview" style={{ maxHeight: '140px', maxWidth: '100%', display: 'block', borderRadius: '3px', objectFit: 'cover' }} />
            <button
              onClick={e => { e.stopPropagation(); setPreview(null); onUpload('') }}
              style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#c97b7b', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FiX size={11} />
            </button>
          </div>
        ) : (
          <div>
            <FiUpload size={22} style={{ color: 'rgba(180,124,124,0.5)', marginBottom: '8px' }} />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: s.muted }}>
              {uploading ? 'Uploading...' : 'Click or drag to upload'}
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: s.muted, marginTop: '4px', opacity: 0.6 }}>
              JPG, PNG, WEBP · Max 5MB
            </p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
      </div>
      {error && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#c97b7b', marginTop: '6px' }}>{error}</p>}
    </div>
  )
}

// ---- PROFILE TAB ----
function ProfileTab({ isDark }) {
  const api = useApi('profile')
  const [profile, setProfile] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const s = getStyles(isDark)

  useEffect(() => { api.get().then(data => { if (data?._id) setProfile(data) }) }, [])

  const handleChange = (key, value) => setProfile(p => ({ ...p, [key]: value }))
  const handleRolesChange = val => setProfile(p => ({ ...p, roles: val.split(',').map(r => r.trim()).filter(Boolean) }))
  const handleStatChange = (i, key, val) => {
    const stats = [...(profile.stats || [])]
    stats[i] = { ...stats[i], [key]: val }
    setProfile(p => ({ ...p, stats }))
  }
  const handleSave = async () => {
    setSaveError('')
    try {
      const res = await api.putSingle(profile)
      if (res.error) { setSaveError(res.error); return }
      setProfile(res)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setSaveError('Save failed: ' + err.message)
    }
  }

  if (!profile) return <p style={{ color: s.muted, fontFamily: 'var(--font-sans)' }}>Loading...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={s.sectionTitle}>Home & About</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {saveError && <p style={{ color: '#c97b7b', fontFamily: 'var(--font-sans)', fontSize: '0.75rem' }}>{saveError}</p>}
          <button onClick={handleSave} style={s.saveBtn}>
            {saved ? <><FiCheck size={13} /> Saved!</> : <><FiCheck size={13} /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* HOME SECTION */}
      <div style={s.formCard}>
        <p style={{ ...s.formLabel, fontSize: '0.7rem', color: '#c9a882', marginBottom: '20px' }}>HOME SECTION</p>

        {/* Hero Image Upload */}
        <div style={{ marginBottom: '20px' }}>
          <ImageUploadBox
            label="Hero Image (Right side photo)"
            currentUrl={profile.heroImage}
            onUpload={url => handleChange('heroImage', url)}
            isDark={isDark}
          />
        </div>

        <div style={s.formGrid2}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={s.formLabel}>Full Name</label>
            <input value={profile.name || ''} onChange={e => handleChange('name', e.target.value)} style={s.formInput} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={s.formLabel}>Tagline / Description</label>
            <textarea value={profile.tagline || ''} onChange={e => handleChange('tagline', e.target.value)} rows={3} style={{ ...s.formInput, resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={s.formLabel}>Roles (comma separated)</label>
            <input value={profile.roles?.join(', ') || ''} onChange={e => handleRolesChange(e.target.value)} style={s.formInput} placeholder="Full Stack Engineer, UI/UX Designer..." />
          </div>
          <div>
            <label style={s.formLabel}>Est. Year</label>
            <input value={profile.estYear || ''} onChange={e => handleChange('estYear', e.target.value)} style={s.formInput} />
          </div>
          <div>
            <label style={s.formLabel}>Location</label>
            <input value={profile.location || ''} onChange={e => handleChange('location', e.target.value)} style={s.formInput} />
          </div>
          <div>
            <label style={s.formLabel}>LinkedIn URL</label>
            <input value={profile.linkedin || ''} onChange={e => handleChange('linkedin', e.target.value)} style={s.formInput} />
          </div>
          <div>
            <label style={s.formLabel}>GitHub URL</label>
            <input value={profile.github || ''} onChange={e => handleChange('github', e.target.value)} style={s.formInput} />
          </div>
          <div>
            <label style={s.formLabel}>Facebook URL</label>
            <input value={profile.facebook || ''} onChange={e => handleChange('facebook', e.target.value)} style={s.formInput} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label style={s.formLabel}>Instagram URL</label>
            <input value={profile.instagram || ''} onChange={e => handleChange('instagram', e.target.value)} style={s.formInput} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label style={s.formLabel}>WhatsApp Number</label>
            <input value={profile.whatsapp || ''} onChange={e => handleChange('whatsapp', e.target.value)} style={s.formInput} placeholder="+94771234567" />
          </div>
          <div>
            <label style={s.formLabel}>X / Twitter URL</label>
            <input value={profile.twitter || ''} onChange={e => handleChange('twitter', e.target.value)} style={s.formInput} placeholder="https://x.com/..." />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={s.formLabel}>Email</label>
            <input value={profile.email || ''} onChange={e => handleChange('email', e.target.value)} style={s.formInput} />
          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div style={s.formCard}>
        <p style={{ ...s.formLabel, fontSize: '0.7rem', color: '#c9a882', marginBottom: '20px' }}>ABOUT SECTION</p>

        {/* About Image Upload */}
        <div style={{ marginBottom: '20px' }}>
          <ImageUploadBox
            label="About Image (Left side photo)"
            currentUrl={profile.aboutImage}
            onUpload={url => handleChange('aboutImage', url)}
            isDark={isDark}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={s.formLabel}>Heading</label>
            <input value={profile.aboutHeading || ''} onChange={e => handleChange('aboutHeading', e.target.value)} style={s.formInput} />
          </div>
          <div>
            <label style={s.formLabel}>Bio Paragraph 1</label>
            <textarea value={profile.aboutBio1 || ''} onChange={e => handleChange('aboutBio1', e.target.value)} rows={4} style={{ ...s.formInput, resize: 'vertical' }} />
          </div>
          <div>
            <label style={s.formLabel}>Bio Paragraph 2</label>
            <textarea value={profile.aboutBio2 || ''} onChange={e => handleChange('aboutBio2', e.target.value)} rows={4} style={{ ...s.formInput, resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ ...s.formLabel, marginBottom: '12px' }}>Stats</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {(profile.stats || []).map((stat, i) => (
                <div key={i} style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f5f0', border: `1px solid ${s.cardBorder}`, borderRadius: '4px', padding: '12px' }}>
                  <input value={stat.value || ''} onChange={e => handleStatChange(i, 'value', e.target.value)} placeholder="10+" style={{ ...s.formInput, marginBottom: '8px', fontSize: '0.8rem' }} />
                  <input value={stat.label || ''} onChange={e => handleStatChange(i, 'label', e.target.value)} placeholder="Projects" style={{ ...s.formInput, fontSize: '0.8rem' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- PROJECTS TAB ----
function ProjectsTab({ isDark }) {
  const api = useApi('projects')
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', description: '', tech: '', category: 'Fullstack', github: '', live: '', year: '', image: '' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saveError, setSaveError] = useState('')
  const s = getStyles(isDark)

  useEffect(() => { api.get().then(data => { if (Array.isArray(data)) setItems(data) }) }, [])
  const resetForm = () => { setForm({ title: '', description: '', tech: '', category: 'Fullstack', github: '', live: '', year: '', image: '' }); setEditing(null); setShowForm(false); setSaveError('') }
  const handleSave = async () => {
    setSaveError('')
    const payload = { ...form, tech: form.tech.split(',').map(t => t.trim()).filter(Boolean) }
    try {
      if (editing) {
        const u = await api.put(editing, payload)
        if (u.error) { setSaveError(u.error); return }
        setItems(items.map(i => i._id === editing ? u : i))
      } else {
        const c = await api.post(payload)
        if (c.error) { setSaveError(c.error); return }
        setItems([...items, c])
      }
      resetForm()
    } catch (err) {
      setSaveError('Save failed: ' + err.message)
    }
  }
  const handleEdit = item => { setForm({ ...item, tech: item.tech?.join(', ') || '' }); setEditing(item._id); setShowForm(true); setSaveError('') }
  const handleDelete = async id => { if (!confirm('Delete?')) return; await api.del(id); setItems(items.filter(i => i._id !== id)) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={s.sectionTitle}>Projects ({items.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null) }} style={s.addBtn}><FiPlus size={14} /> Add</button>
      </div>
      {showForm && (
        <div style={s.formCard}>
          {/* Project Image Upload */}
          <div style={{ marginBottom: '20px' }}>
            <ImageUploadBox
              label="Project Image"
              currentUrl={form.image}
              onUpload={url => setForm(f => ({ ...f, image: url }))}
              isDark={isDark}
            />
          </div>
          <div style={s.formGrid2}>
            {[['title','Title','Project title'],['category','Category','Fullstack / UI/UX'],['tech','Tech (comma separated)','React, Node.js...'],['github','GitHub URL','https://...'],['live','Live URL','https://...'],['year','Year','2024']].map(([key,label,ph]) => (
              <div key={key}>
                <label style={s.formLabel}>{label}</label>
                <input value={form[key] || ''} onChange={e => setForm(f => ({...f,[key]:e.target.value}))} placeholder={ph} style={s.formInput} />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={s.formLabel}>Description</label>
              <textarea value={form.description || ''} onChange={e => setForm(f => ({...f,description:e.target.value}))} rows={3} style={{...s.formInput,resize:'vertical'}} />
            </div>
          </div>
          {saveError && <p style={{ color: '#c97b7b', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', marginBottom: '12px' }}>{saveError}</p>}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleSave} style={s.saveBtn}><FiCheck size={13} /> {editing ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={s.cancelBtn}><FiX size={13} /> Cancel</button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map(item => (
          <div key={item._id} style={s.itemCard}>
            {item.image && <img src={item.image.startsWith('/') ? 'http://localhost:5000' + item.image : item.image} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }} />}
            <div style={{ flex: 1 }}>
              <p style={s.itemTitle}>{item.title}</p>
              <p style={s.itemMeta}>{item.category} · {item.year} · {item.tech?.join(', ')}</p>
            </div>
            <button onClick={() => handleEdit(item)} style={s.iconBtn}><FiEdit2 size={14} /></button>
            <button onClick={() => handleDelete(item._id)} style={{...s.iconBtn,color:'#c97b7b'}}><FiTrash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- MESSAGES TAB ----
function MessagesTab({ isDark }) {
  const api = useApi('messages')
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const s = getStyles(isDark)

  useEffect(() => { api.get().then(data => { if (Array.isArray(data)) setItems(data) }) }, [])
  const handleDelete = async id => { if (!confirm('Delete?')) return; await api.del(id); setItems(items.filter(i => i._id !== id)); if (selected?._id === id) setSelected(null) }

  return (
    <div>
      <h2 style={{ ...s.sectionTitle, marginBottom: '24px' }}>Messages ({items.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.length === 0 && <p style={{ color: s.muted, fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}>No messages yet.</p>}
          {items.map(item => (
            <div key={item._id} onClick={() => setSelected(item)} style={{ ...s.itemCard, cursor: 'pointer', borderColor: selected?._id === item._id ? '#b47c7c' : s.cardBorder }}>
              <div style={{ flex: 1 }}>
                <p style={s.itemTitle}>{item.name} <span style={{ color: '#c9a882', fontSize: '0.72rem' }}>— {item.email}</span></p>
                <p style={s.itemMeta}>{item.subject || 'No subject'} · {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); handleDelete(item._id) }} style={{...s.iconBtn,color:'#c97b7b'}}><FiTrash2 size={14} /></button>
            </div>
          ))}
        </div>
        {selected && (
          <div style={s.formCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={s.itemTitle}>{selected.name}</p>
              <button onClick={() => setSelected(null)} style={s.iconBtn}><FiX size={14} /></button>
            </div>
            <p style={s.itemMeta}>{selected.email} · {new Date(selected.createdAt).toLocaleDateString()}</p>
            {selected.subject && <p style={{ ...s.itemMeta, color: '#c9a882', marginTop: '4px' }}>{selected.subject}</p>}
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: s.text, lineHeight: 1.75, marginTop: '16px', borderTop: `1px solid ${s.cardBorder}`, paddingTop: '16px' }}>{selected.message}</p>
            <a href={`mailto:${selected.email}`} style={{ ...s.saveBtn, display: 'inline-flex', marginTop: '16px', textDecoration: 'none' }}>Reply</a>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- GENERIC TAB ----
function GenericTab({ endpoint, fields, title, isDark }) {
  const api = useApi(endpoint)
  const [items, setItems] = useState([])
  const [form, setForm] = useState(() => fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}))
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saveError, setSaveError] = useState('')
  const s = getStyles(isDark)

  useEffect(() => { api.get().then(data => { if (Array.isArray(data)) setItems(data) }) }, [])
  const resetForm = () => { setForm(fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})); setEditing(null); setShowForm(false); setSaveError('') }
  const handleSave = async () => {
    setSaveError('')
    try {
      if (editing) {
        const u = await api.put(editing, form)
        if (u.error) { setSaveError(u.error); return }
        setItems(items.map(i => i._id === editing ? u : i))
      } else {
        const c = await api.post(form)
        if (c.error) { setSaveError(c.error); return }
        setItems([...items, c])
      }
      resetForm()
    } catch (err) {
      setSaveError('Save failed: ' + err.message)
    }
  }
  const handleEdit = item => { setForm(fields.reduce((acc, f) => ({ ...acc, [f.key]: item[f.key] || '' }), {})); setEditing(item._id); setShowForm(true); setSaveError('') }
  const handleDelete = async id => { if (!confirm('Delete?')) return; await api.del(id); setItems(items.filter(i => i._id !== id)) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={s.sectionTitle}>{title} ({items.length})</h2>
        <button onClick={() => { setForm(fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})); setEditing(null); setShowForm(prev => !prev); setSaveError('') }} style={s.addBtn}><FiPlus size={14} /> Add</button>
      </div>
      {showForm && (
        <div style={s.formCard}>
          {/* Certificate image upload */}
          {endpoint === 'certificates' && (
            <div style={{ marginBottom: '20px' }}>
              <ImageUploadBox
                label="Certificate Image"
                currentUrl={form.image}
                onUpload={url => setForm(f => ({ ...f, image: url }))}
                isDark={isDark}
                endpoint="certificate"
              />
            </div>
          )}
          <div style={s.formGrid2}>
            {fields.filter(f => f.key !== 'image').map(f => (
              <div key={f.key} style={f.full ? { gridColumn: '1 / -1' } : {}}>
                <label style={s.formLabel}>{f.label}</label>
                {f.textarea
                  ? <textarea value={form[f.key] || ''} onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} rows={3} style={{...s.formInput,resize:'vertical'}} />
                  : <input value={form[f.key] || ''} onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={s.formInput} />
                }
              </div>
            ))}
          </div>
          {saveError && <p style={{ color: '#c97b7b', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', marginBottom: '12px' }}>{saveError}</p>}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleSave} style={s.saveBtn}><FiCheck size={13} /> {editing ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} style={s.cancelBtn}><FiX size={13} /> Cancel</button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map(item => (
          <div key={item._id} style={s.itemCard}>
            {item.image && (
              <img
                src={item.image.startsWith('/') ? 'http://localhost:5000' + item.image : item.image}
                alt=""
                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
                onError={e => e.target.style.display = 'none'}
              />
            )}
            <div style={{ flex: 1 }}>
              <p style={s.itemTitle}>{item[fields[0].key]}</p>
              {fields[1] && <p style={s.itemMeta}>{item[fields[1].key]}</p>}
            </div>
            <button onClick={() => handleEdit(item)} style={s.iconBtn}><FiEdit2 size={14} /></button>
            <button onClick={() => handleDelete(item._id)} style={{...s.iconBtn,color:'#c97b7b'}}><FiTrash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

const tabConfigs = {
  education: { fields: [
    { key: 'degree', label: 'Degree', placeholder: 'BSc in...' },
    { key: 'institution', label: 'Institution', placeholder: 'University of...' },
    { key: 'location', label: 'Location', placeholder: 'Colombo, Sri Lanka' },
    { key: 'period', label: 'Period', placeholder: '2020 — 2024' },
    { key: 'side', label: 'Side (left/right)', placeholder: 'left' },
    { key: 'description', label: 'Description', placeholder: 'About this...', textarea: true, full: true },
  ]},
  experience: { fields: [
    { key: 'role', label: 'Role', placeholder: 'Full Stack Developer' },
    { key: 'company', label: 'Company', placeholder: 'Company Name' },
    { key: 'location', label: 'Location', placeholder: 'Colombo, Sri Lanka' },
    { key: 'period', label: 'Period', placeholder: '2023 — Present' },
    { key: 'type', label: 'Type', placeholder: 'Full Time / Internship / Freelance' },
    { key: 'side', label: 'Side (left/right)', placeholder: 'left' },
    { key: 'description', label: 'Description', placeholder: 'About this role...', textarea: true, full: true },
  ]},
  certificates: { fields: [
    { key: 'title', label: 'Title', placeholder: 'Certificate title' },
    { key: 'issuer', label: 'Issuer', placeholder: 'Coursera / Google' },
    { key: 'date', label: 'Date', placeholder: 'Dec 2023' },
    { key: 'link', label: 'Verify URL', placeholder: 'https://...' },
    { key: 'image', label: 'Image', placeholder: '' },
  ]},
  skills: { fields: [
    { key: 'name', label: 'Skill Name', placeholder: 'React' },
    { key: 'percent', label: 'Percent (0-100)', placeholder: '90' },
    { key: 'category', label: 'Category', placeholder: 'technical / soft / tool' },
    { key: 'desc', label: 'Description', placeholder: 'Short description...' },
  ]},
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isDark, setIsDark] = useState(false)
  const navigate = useNavigate()
  const handleLogout = () => { localStorage.removeItem('adminToken'); navigate('/admin') }

  const bg = isDark ? '#0a0a0a' : '#faf7f2'
  const sidebarBg = isDark ? 'rgba(255,255,255,0.02)' : '#ffffff'
  const sidebarBorder = isDark ? 'rgba(232,224,213,0.08)' : 'rgba(44,44,44,0.1)'
  const tabActiveColor = '#b47c7c'
  const tabInactiveColor = isDark ? 'rgba(232,224,213,0.45)' : 'rgba(44,44,44,0.55)'
  const subColor = isDark ? 'rgba(232,224,213,0.35)' : 'rgba(44,44,44,0.4)'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', transition: 'background 0.3s' }}>
      <div style={{ width: '220px', flexShrink: 0, backgroundColor: sidebarBg, borderRight: `1px solid ${sidebarBorder}`, padding: '32px 0', display: 'flex', flexDirection: 'column', boxShadow: isDark ? 'none' : '2px 0 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '0 24px 24px', borderBottom: `1px solid ${sidebarBorder}` }}>
          <p style={{ fontFamily: 'var(--font-script)', fontSize: '1.8rem', color: '#b47c7c' }}>Ayeshi</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: subColor, marginTop: '4px' }}>Admin Panel</p>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 24px', background: activeTab === tab.id ? 'rgba(180,124,124,0.1)' : 'none',
              border: 'none', borderLeft: activeTab === tab.id ? '2px solid #b47c7c' : '2px solid transparent',
              color: activeTab === tab.id ? tabActiveColor : tabInactiveColor,
              fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${sidebarBorder}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setIsDark(!isDark)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: `1px solid ${sidebarBorder}`, color: tabInactiveColor, fontFamily: 'var(--font-sans)', fontSize: '0.68rem', letterSpacing: '0.1em', padding: '8px 16px', cursor: 'pointer', borderRadius: '2px', width: '100%', justifyContent: 'center' }}>
            {isDark ? <FiSun size={13} /> : <FiMoon size={13} />} {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: `1px solid ${sidebarBorder}`, color: tabInactiveColor, fontFamily: 'var(--font-sans)', fontSize: '0.68rem', letterSpacing: '0.1em', padding: '8px 16px', cursor: 'pointer', borderRadius: '2px', width: '100%', justifyContent: 'center' }}>
            <FiLogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        {activeTab === 'profile' && <ProfileTab isDark={isDark} />}
        {activeTab === 'projects' && <ProjectsTab isDark={isDark} />}
        {activeTab === 'messages' && <MessagesTab isDark={isDark} />}
        {activeTab === 'education' && <GenericTab endpoint="education" title="Education" fields={tabConfigs.education.fields} isDark={isDark} />}
        {activeTab === 'experience' && <GenericTab endpoint="experience" title="Experience" fields={tabConfigs.experience.fields} isDark={isDark} />}
        {activeTab === 'certificates' && <GenericTab endpoint="certificates" title="Certificates" fields={tabConfigs.certificates.fields} isDark={isDark} />}
        {activeTab === 'skills' && <GenericTab endpoint="skills" title="Skills" fields={tabConfigs.skills.fields} isDark={isDark} />}
      </div>
    </div>
  )
}