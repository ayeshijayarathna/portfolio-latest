import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLogOut, FiPlus, FiEdit2, FiTrash2, FiMail, FiCheck, FiX } from 'react-icons/fi'
import { BsGrid, BsBook, BsBriefcase, BsAward, BsLightning, BsChatDots } from 'react-icons/bs'

const tabs = [
  { id: 'projects', label: 'Projects', icon: <BsGrid size={16} /> },
  { id: 'education', label: 'Education', icon: <BsBook size={16} /> },
  { id: 'experience', label: 'Experience', icon: <BsBriefcase size={16} /> },
  { id: 'certificates', label: 'Certificates', icon: <BsAward size={16} /> },
  { id: 'skills', label: 'Skills', icon: <BsLightning size={16} /> },
  { id: 'messages', label: 'Messages', icon: <BsChatDots size={16} /> },
]

function useApi(endpoint) {
  const token = localStorage.getItem('adminToken')
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const get = () => fetch(`/api/${endpoint}`, { headers }).then(r => r.json())
  const post = body => fetch(`/api/${endpoint}`, { method: 'POST', headers, body: JSON.stringify(body) }).then(r => r.json())
  const put = (id, body) => fetch(`/api/${endpoint}/${id}`, { method: 'PUT', headers, body: JSON.stringify(body) }).then(r => r.json())
  const del = id => fetch(`/api/${endpoint}/${id}`, { method: 'DELETE', headers }).then(r => r.json())

  return { get, post, put, del }
}

// ---- PROJECTS TAB ----
function ProjectsTab() {
  const api = useApi('projects')
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', description: '', tech: '', category: 'Fullstack', github: '', live: '', year: '' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { api.get().then(setItems) }, [])

  const handleSave = async () => {
    const payload = { ...form, tech: form.tech.split(',').map(t => t.trim()).filter(Boolean) }
    if (editing) {
      const updated = await api.put(editing, payload)
      setItems(items.map(i => i._id === editing ? updated : i))
    } else {
      const created = await api.post(payload)
      setItems([...items, created])
    }
    setForm({ title: '', description: '', tech: '', category: 'Fullstack', github: '', live: '', year: '' })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = item => {
    setForm({ ...item, tech: item.tech.join(', ') })
    setEditing(item._id)
    setShowForm(true)
  }

  const handleDelete = async id => {
    if (!confirm('Delete this project?')) return
    await api.del(id)
    setItems(items.filter(i => i._id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={sectionTitle}>Projects ({items.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', tech: '', category: 'Fullstack', github: '', live: '', year: '' }) }} style={addBtn}>
          <FiPlus size={14} /> Add Project
        </button>
      </div>

      {showForm && (
        <div style={formCard}>
          <div style={formGrid}>
            {[
              { key: 'title', label: 'Title', placeholder: 'Project title' },
              { key: 'category', label: 'Category', placeholder: 'Fullstack / UI/UX / Analytics' },
              { key: 'tech', label: 'Tech (comma separated)', placeholder: 'React, Node.js, MongoDB' },
              { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/...' },
              { key: 'live', label: 'Live URL', placeholder: 'https://...' },
              { key: 'year', label: 'Year', placeholder: '2024' },
            ].map(f => (
              <div key={f.key}>
                <label style={formLabel}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder} style={formInput} />
              </div>
            ))}
          </div>
          <div>
            <label style={formLabel}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Project description..." rows={3} style={{ ...formInput, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={handleSave} style={saveBtn}><FiCheck size={13} /> {editing ? 'Update' : 'Save'}</button>
            <button onClick={() => { setShowForm(false); setEditing(null) }} style={cancelBtn}><FiX size={13} /> Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map(item => (
          <div key={item._id} style={itemCard}>
            <div style={{ flex: 1 }}>
              <p style={itemTitle}>{item.title}</p>
              <p style={itemMeta}>{item.category} · {item.year} · {item.tech?.join(', ')}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(item)} style={iconBtn}><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(item._id)} style={{ ...iconBtn, color: '#c97b7b' }}><FiTrash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- MESSAGES TAB ----
function MessagesTab() {
  const api = useApi('messages')
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => { api.get().then(setItems) }, [])

  const handleDelete = async id => {
    if (!confirm('Delete this message?')) return
    await api.del(id)
    setItems(items.filter(i => i._id !== id))
    if (selected?._id === id) setSelected(null)
  }

  return (
    <div>
      <h2 style={{ ...sectionTitle, marginBottom: '24px' }}>Messages ({items.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.length === 0 && <p style={{ color: 'rgba(232,224,213,0.4)', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}>No messages yet.</p>}
          {items.map(item => (
            <div key={item._id} onClick={() => setSelected(item)} style={{
              ...itemCard,
              cursor: 'pointer',
              borderColor: selected?._id === item._id ? '#b47c7c' : 'rgba(232,224,213,0.08)',
            }}>
              <div style={{ flex: 1 }}>
                <p style={itemTitle}>{item.name} <span style={{ color: '#c9a882', fontSize: '0.72rem' }}>— {item.email}</span></p>
                <p style={itemMeta}>{item.subject || 'No subject'} · {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); handleDelete(item._id) }} style={{ ...iconBtn, color: '#c97b7b' }}><FiTrash2 size={14} /></button>
            </div>
          ))}
        </div>
        {selected && (
          <div style={formCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <p style={itemTitle}>{selected.name}</p>
              <button onClick={() => setSelected(null)} style={iconBtn}><FiX size={14} /></button>
            </div>
            <p style={itemMeta}>{selected.email} · {new Date(selected.createdAt).toLocaleDateString()}</p>
            {selected.subject && <p style={{ ...itemMeta, color: '#c9a882', marginTop: '4px' }}>{selected.subject}</p>}
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'rgba(232,224,213,0.8)', lineHeight: 1.75, marginTop: '16px', borderTop: '1px solid rgba(232,224,213,0.08)', paddingTop: '16px' }}>
              {selected.message}
            </p>
            <a href={`mailto:${selected.email}`} style={{ ...saveBtn, display: 'inline-flex', marginTop: '16px', textDecoration: 'none' }}>
              <FiMail size={13} /> Reply
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- GENERIC TAB (Education, Experience, Certificates, Skills) ----
function GenericTab({ endpoint, fields, title }) {
  const api = useApi(endpoint)
  const [items, setItems] = useState([])
  const [form, setForm] = useState(() => fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}))
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { api.get().then(setItems) }, [])

  const handleSave = async () => {
    if (editing) {
      const updated = await api.put(editing, form)
      setItems(items.map(i => i._id === editing ? updated : i))
    } else {
      const created = await api.post(form)
      setItems([...items, created])
    }
    setForm(fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}))
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = item => {
    setForm(fields.reduce((acc, f) => ({ ...acc, [f.key]: item[f.key] || '' }), {}))
    setEditing(item._id)
    setShowForm(true)
  }

  const handleDelete = async id => {
    if (!confirm(`Delete this ${title.toLowerCase()} entry?`)) return
    await api.del(id)
    setItems(items.filter(i => i._id !== id))
  }

  const primaryField = fields[0]
  const secondaryField = fields[1]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={sectionTitle}>{title} ({items.length})</h2>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})) }} style={addBtn}>
          <FiPlus size={14} /> Add
        </button>
      </div>

      {showForm && (
        <div style={formCard}>
          <div style={formGrid}>
            {fields.map(f => (
              <div key={f.key} style={f.full ? { gridColumn: '1 / -1' } : {}}>
                <label style={formLabel}>{f.label}</label>
                {f.textarea ? (
                  <textarea value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder} rows={3} style={{ ...formInput, resize: 'vertical' }} />
                ) : (
                  <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder} style={formInput} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={handleSave} style={saveBtn}><FiCheck size={13} /> {editing ? 'Update' : 'Save'}</button>
            <button onClick={() => { setShowForm(false); setEditing(null) }} style={cancelBtn}><FiX size={13} /> Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map(item => (
          <div key={item._id} style={itemCard}>
            <div style={{ flex: 1 }}>
              <p style={itemTitle}>{item[primaryField.key]}</p>
              {secondaryField && <p style={itemMeta}>{item[secondaryField.key]}</p>}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(item)} style={iconBtn}><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(item._id)} style={{ ...iconBtn, color: '#c97b7b' }}><FiTrash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Shared Styles ----
const sectionTitle = { fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400, color: '#e8e0d5' }
const addBtn = { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', backgroundColor: '#b47c7c', border: 'none', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }
const saveBtn = { display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: '#b47c7c', border: 'none', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', cursor: 'pointer', borderRadius: '2px' }
const cancelBtn = { display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px', backgroundColor: 'transparent', border: '1px solid rgba(232,224,213,0.2)', color: 'rgba(232,224,213,0.6)', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', cursor: 'pointer', borderRadius: '2px' }
const iconBtn = { background: 'none', border: 'none', color: 'rgba(232,224,213,0.5)', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }
const formCard = { backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,224,213,0.1)', borderRadius: '4px', padding: '28px', marginBottom: '24px' }
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }
const formLabel = { fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(232,224,213,0.45)', display: 'block', marginBottom: '6px' }
const formInput = { width: '100%', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(232,224,213,0.12)', borderRadius: '3px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#e8e0d5', outline: 'none', boxSizing: 'border-box' }
const itemCard = { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(232,224,213,0.08)', borderRadius: '4px', transition: 'border-color 0.2s' }
const itemTitle = { fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 500, color: '#e8e0d5', marginBottom: '3px' }
const itemMeta = { fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'rgba(232,224,213,0.45)', fontWeight: 300 }

// ---- Tab configs ----
const tabConfigs = {
  education: {
    fields: [
      { key: 'degree', label: 'Degree', placeholder: 'BSc in...' },
      { key: 'institution', label: 'Institution', placeholder: 'University of...' },
      { key: 'location', label: 'Location', placeholder: 'Colombo, Sri Lanka' },
      { key: 'period', label: 'Period', placeholder: '2020 — 2024' },
      { key: 'side', label: 'Side (left/right)', placeholder: 'left' },
      { key: 'description', label: 'Description', placeholder: 'About this degree...', textarea: true, full: true },
    ],
  },
  experience: {
    fields: [
      { key: 'role', label: 'Role', placeholder: 'Full Stack Developer' },
      { key: 'company', label: 'Company', placeholder: 'Company Name' },
      { key: 'location', label: 'Location', placeholder: 'Colombo, Sri Lanka' },
      { key: 'period', label: 'Period', placeholder: '2023 — Present' },
      { key: 'type', label: 'Type', placeholder: 'Full Time / Internship / Freelance' },
      { key: 'side', label: 'Side (left/right)', placeholder: 'left' },
      { key: 'description', label: 'Description', placeholder: 'About this role...', textarea: true, full: true },
    ],
  },
  certificates: {
    fields: [
      { key: 'title', label: 'Title', placeholder: 'Certificate title' },
      { key: 'issuer', label: 'Issuer', placeholder: 'Coursera / Google...' },
      { key: 'date', label: 'Date', placeholder: 'Dec 2023' },
      { key: 'link', label: 'Verify URL', placeholder: 'https://...' },
      { key: 'image', label: 'Image URL', placeholder: '/certificates/cert1.jpg' },
    ],
  },
  skills: {
    fields: [
      { key: 'name', label: 'Skill Name', placeholder: 'React' },
      { key: 'percent', label: 'Percent (0-100)', placeholder: '90' },
      { key: 'category', label: 'Category', placeholder: 'technical / soft / tool' },
      { key: 'desc', label: 'Description', placeholder: 'Short description...' },
    ],
  },
}

// ---- MAIN DASHBOARD ----
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex' }}>

      {/* Sidebar */}
      <div style={{
        width: '220px',
        flexShrink: 0,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(232,224,213,0.08)',
        padding: '32px 0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(232,224,213,0.08)' }}>
          <p style={{ fontFamily: 'var(--font-script)', fontSize: '1.8rem', color: '#b47c7c' }}>Ayeshi</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(232,224,213,0.35)', marginTop: '4px' }}>Admin Panel</p>
        </div>

        <nav style={{ flex: 1, padding: '24px 0' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                background: activeTab === tab.id ? 'rgba(180,124,124,0.12)' : 'none',
                border: 'none',
                borderLeft: activeTab === tab.id ? '2px solid #b47c7c' : '2px solid transparent',
                color: activeTab === tab.id ? '#b47c7c' : 'rgba(232,224,213,0.45)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: '1px solid rgba(232,224,213,0.15)',
              color: 'rgba(232,224,213,0.45)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              padding: '8px 16px',
              cursor: 'pointer',
              borderRadius: '2px',
              width: '100%',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c97b7b'; e.currentTarget.style.color = '#c97b7b' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,224,213,0.15)'; e.currentTarget.style.color = 'rgba(232,224,213,0.45)' }}
          >
            <FiLogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'education' && <GenericTab endpoint="education" title="Education" fields={tabConfigs.education.fields} />}
        {activeTab === 'experience' && <GenericTab endpoint="experience" title="Experience" fields={tabConfigs.experience.fields} />}
        {activeTab === 'certificates' && <GenericTab endpoint="certificates" title="Certificates" fields={tabConfigs.certificates.fields} />}
        {activeTab === 'skills' && <GenericTab endpoint="skills" title="Skills" fields={tabConfigs.skills.fields} />}
      </div>
    </div>
  )
}