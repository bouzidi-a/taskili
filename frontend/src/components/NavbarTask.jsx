import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/useUser'
import '../styles/NavbarTask.css'
import logo from '../assets/logo.svg'
import persone from '../assets/profile.jpg'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '')
const api = (path) =>
  API_BASE.endsWith('/api') ? `${API_BASE}${path}` : `${API_BASE}/api${path}`
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

// ── Icons ──────────────────────────────────────────────────
const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const ChatBubbleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const SwitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4m0 0L3 8m4-4l4 4" /><path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
)
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const formatTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diffMins = Math.floor((now - d) / 60000)
  if (diffMins < 1)  return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24)  return `${diffHrs}h ago`
  return 'Yesterday'
}

// ── Notification Panel ─────────────────────────────────────
const NotificationPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(api('/notifications'), { headers: authHeaders() })
        const data = await res.json()
        if (res.ok) setNotifications(data.notifications || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  const markAllRead = async () => {
    try {
      await fetch(api('/notifications/read-all'), { method: 'PUT', headers: authHeaders() })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error(error)
    }
  }

  const handleClick = async (n) => {
    if (!n.read) {
      await fetch(api(`/notifications/${n._id}/read`), { method: 'PUT', headers: authHeaders() })
      setNotifications(prev => prev.map(item => item._id === n._id ? { ...item, read: true } : item))
    }
    onClose()
    if (n.link) navigate(n.link)
  }

  return (
    <div className="navbar__panel navbar__panel--notif">
      <div className="panel__header">
        <span className="panel__title">Notifications</span>
        <button className="panel__action-btn" onClick={markAllRead}>Mark all read</button>
      </div>
      <ul className="panel__list">
        {loading ? (
          <li style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>Loading…</li>
        ) : notifications.length === 0 ? (
          <li style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No notifications</li>
        ) : notifications.map(n => (
          <li key={n._id}
            className={`panel__item panel__item--clickable ${!n.read ? 'panel__item--unread' : ''}`}
            onClick={() => handleClick(n)}>
            <div className="panel__avatar-circle">
              {n.type === 'new_bid' ? '📋' : n.type === 'new_message' ? '💬' : n.type === 'bid_accepted' ? '✅' : '🔔'}
            </div>
            <div className="panel__body">
              <p className="panel__text">{n.message}</p>
              <span className="panel__time">{formatTime(n.createdAt)}</span>
            </div>
            {!n.read && <div className="panel__dot" />}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Chat Preview Panel ─────────────────────────────────────
const ChatPanel = ({ onClose, role }) => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(api('/chat/conversations'), { headers: authHeaders() })
        const data = await res.json()
        if (res.ok) setConversations(data.conversations || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  const getOther = (c) => {
    const r = role?.toLowerCase()
    return r === 'employer'
      ? { name: c.freelancer?.fullName || 'Freelancer', avatar: c.freelancer?.avatar }
      : { name: c.employer?.fullName || 'Employer', avatar: c.employer?.avatar }
  }

  const getUnread = (c) => {
    const r = role?.toLowerCase()
    return r === 'employer' ? c.unreadEmployer : c.unreadFreelancer
  }

  const totalUnread = conversations.reduce((s, c) => s + getUnread(c), 0)

  return (
    <div className="navbar__panel navbar__panel--chat">
      <div className="panel__header">
        <span className="panel__title">Messages {totalUnread > 0 && `(${totalUnread})`}</span>
        <button className="panel__action-btn" onClick={() => { navigate('/chat'); onClose() }}>See all</button>
      </div>
      <ul className="panel__list">
        {loading ? (
          <li style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>Loading…</li>
        ) : conversations.length === 0 ? (
          <li style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No conversations yet</li>
        ) : conversations.slice(0, 5).map(c => {
          const other = getOther(c)
          const unread = getUnread(c)
          return (
            <li key={c._id}
              className={`panel__item panel__item--clickable ${unread > 0 ? 'panel__item--unread' : ''}`}
              onClick={() => { navigate('/chat', { state: { conversationId: c._id } }); onClose() }}>
              <div className="panel__avatar-circle">
                {other.avatar
                  ? <img src={other.avatar} alt={other.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : other.name[0]}
              </div>
              <div className="panel__body">
                <p className="panel__text"><strong>{other.name}</strong></p>
                <span className="panel__time">{c.lastMessage || 'No messages yet'}</span>
              </div>
              {unread > 0 && <div className="panel__badge">{unread}</div>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ── Dropdown Menu ──────────────────────────────────────────
const DropdownMenu = ({ user, onClose }) => {
  const navigate = useNavigate()
  const { role, setRole } = useUser()

  const handleSwitch = () => {
    const newRole = role === 'Freelancer' ? 'Employer' : 'Freelancer'
    setRole(newRole)
    onClose()
    navigate(newRole === 'Employer' ? '/profile' : '/tasks')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('pendingUserId')
    onClose()
    navigate('/signin')
  }

  return (
    <div className="navbar__dropdown">
      <div className="dropdown__header">
        <img src={user.avatar} alt={user.username} className="dropdown__avatar" />
        <div className="dropdown__user-info">
          <span className="dropdown__username">{user.username}</span>
          <span className="dropdown__role">{user.role}</span>
        </div>
      </div>
      <ul className="dropdown__menu">
        <li>
          <button className="dropdown__item" onClick={handleSwitch}>
            <SwitchIcon />
            {role === 'Freelancer' ? 'Switch to Employer' : 'Switch to Freelancer'}
          </button>
        </li>
        <li>
          <button className="dropdown__item" onClick={onClose}>
            <SettingsIcon /> Settings
          </button>
        </li>
        <li><div className="dropdown__divider" /></li>
        <li>
          <button className="dropdown__item" onClick={handleLogout}>
            <LogoutIcon /> Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

// ── Main NavbarTask ────────────────────────────────────────
const NavbarTask = () => {
  const [activePanel, setActivePanel] = useState(null)
  const [unreadNotifs, setUnreadNotifs]   = useState(0)
  const [unreadChats, setUnreadChats]     = useState(0)
  const navbarRef = useRef(null)
  const navigate  = useNavigate()
  const { profilePic, fullName, role } = useUser()

  const displayName = fullName ? `@${fullName.split(' ')[0]}` : '@User'
  const avatar = profilePic || persone

  // ── Poll unread counts every 30s ─────────────────────────
  const fetchCounts = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const [nRes, cRes] = await Promise.all([
        fetch(api('/notifications'), { headers: authHeaders() }),
        fetch(api('/chat/conversations'), { headers: authHeaders() }),
      ])
      if (nRes.ok) {
        const nd = await nRes.json()
        setUnreadNotifs(nd.unread || 0)
      }
      if (cRes.ok) {
        const cd = await cRes.json()
        const r = role?.toLowerCase()
        const total = (cd.conversations || []).reduce((s, c) =>
          s + (r === 'employer' ? c.unreadEmployer : c.unreadFreelancer), 0)
        setUnreadChats(total)
      }
    } catch (error) {
      console.error('Failed to fetch unread counts', error)
    }
  }, [role])

  useEffect(() => {
    const initCounts = async () => {
      await fetchCounts()
    }
    initCounts()
    const id = setInterval(fetchCounts, 30000)
    return () => clearInterval(id)
  }, [fetchCounts])

  const toggle = (panel) => {
    setActivePanel(prev => prev === panel ? null : panel)
    // Refresh counts when closing notif/chat panels
    if (activePanel === 'notif' || activePanel === 'chat') fetchCounts()
  }

  useEffect(() => {
    const handler = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) setActivePanel(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav className="navbar" ref={navbarRef}>
      <a href="/" className="navbar__logo">
        <img src={logo} alt="Askili" />
      </a>

      <div className="navbar__right">
        {role === 'Employer' && (
          <button className="navbar__post-btn" onClick={() => navigate('/add-task')}>
            Post a project
          </button>
        )}

        {/* ── Icon buttons + panels ── */}
        <div className="navbar__icons">
          <button
            className={`navbar__icon-btn ${activePanel === 'notif' ? 'navbar__icon-btn--active' : ''}`}
            onClick={() => toggle('notif')} aria-label="Notifications">
            <BellIcon />
            {unreadNotifs > 0 && <span className="navbar__badge">{unreadNotifs}</span>}
          </button>

          <button
            className={`navbar__icon-btn ${activePanel === 'chat' ? 'navbar__icon-btn--active' : ''}`}
            onClick={() => toggle('chat')} aria-label="Messages">
            <ChatBubbleIcon />
            {unreadChats > 0 && <span className="navbar__badge">{unreadChats}</span>}
          </button>

          {activePanel === 'notif' && (
            <NotificationPanel onClose={() => setActivePanel(null)} />
          )}
          {activePanel === 'chat' && (
            <ChatPanel onClose={() => setActivePanel(null)} role={role} />
          )}
        </div>

        {/* ── User ── */}
        <div className="navbar__user">
          <div className="navbar__user-clickable" onClick={() => navigate('/profile')}>
            <img src={avatar} alt={displayName} className="navbar__avatar" />
            <div className="navbar__user-info">
              <span className="navbar__username">{displayName}</span>
              <span className="navbar__role">{role}</span>
            </div>
          </div>
          <button className="navbar__chevron"
            onClick={(e) => { e.stopPropagation(); toggle('menu') }} aria-label="Open menu">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {activePanel === 'menu' && (
            <DropdownMenu
              user={{ username: displayName, role, avatar }}
              onClose={() => setActivePanel(null)}
            />
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavbarTask