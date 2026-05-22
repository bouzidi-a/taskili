import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useUser } from '../context/useUser'
import NavbarTask from '../components/NavbarTask'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '')
const api = (path) =>
  API_BASE.endsWith('/api') ? `${API_BASE}${path}` : `${API_BASE}/api${path}`

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

// ── Styles ─────────────────────────────────────────────────
const S = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    fontFamily: "'Segoe UI', 'Inter', sans-serif",
    backgroundColor: '#f0f4ff',
    overflow: 'hidden',
  },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },

  // Sidebar
  sidebar: {
    width: '300px',
    flexShrink: 0,
    background: '#fff',
    borderRight: '1px solid #e8e8e8',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sidebarHeader: {
    padding: '20px 20px 14px',
    borderBottom: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  sidebarTitle: { fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 12px' },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#f4f6fb', borderRadius: '10px', padding: '8px 12px',
  },
  searchInput: {
    border: 'none', background: 'transparent', outline: 'none',
    fontSize: '13px', color: '#374151', width: '100%',
  },
  convList: { flex: 1, overflowY: 'auto', padding: '8px 0' },
  convItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 20px', cursor: 'pointer',
    background: active ? '#eef2ff' : 'transparent',
    borderLeft: active ? '3px solid #3b6ef8' : '3px solid transparent',
    transition: 'background 0.15s',
  }),
  convAvatar: {
    width: '44px', height: '44px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b6ef8, #6b9aff)',
    color: '#fff', fontSize: '16px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  convInfo: { flex: 1, minWidth: 0 },
  convName: (unread) => ({
    fontSize: '14px', fontWeight: unread ? '700' : '600',
    color: '#111827', margin: '0 0 2px',
  }),
  convLast: {
    fontSize: '12px', color: '#9ca3af',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  convMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' },
  convTime: { fontSize: '11px', color: '#9ca3af' },
  convBadge: {
    minWidth: '20px', height: '20px', borderRadius: '99px',
    background: '#3b6ef8', color: '#fff', fontSize: '11px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
  },

  // Chat area
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  chatHeader: {
    padding: '0 24px', height: '68px', background: '#fff',
    borderBottom: '1px solid #e8e8e8',
    display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0,
  },
  chatHeaderAvatar: {
    width: '42px', height: '42px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b6ef8, #6b9aff)',
    color: '#fff', fontSize: '16px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  chatMessages: {
    flex: 1, overflowY: 'auto', padding: '24px',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  msgRow: (fromMe) => ({ display: 'flex', justifyContent: fromMe ? 'flex-end' : 'flex-start' }),
  msgBubble: (fromMe) => ({
    maxWidth: '65%', padding: '10px 16px',
    borderRadius: fromMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    background: fromMe ? '#3b6ef8' : '#fff',
    color: fromMe ? '#fff' : '#111827',
    fontSize: '14px', lineHeight: '1.5',
    boxShadow: fromMe ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
  }),
  msgTime: (fromMe) => ({
    fontSize: '10px', color: fromMe ? 'rgba(255,255,255,0.65)' : '#9ca3af',
    marginTop: '4px', textAlign: fromMe ? 'right' : 'left',
  }),
  chatInputArea: {
    padding: '16px 24px', background: '#fff',
    borderTop: '1px solid #e8e8e8',
    display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0,
  },
  chatInput: {
    flex: 1, height: '46px', border: '1.5px solid #e2e8f0',
    borderRadius: '12px', padding: '0 16px', fontSize: '14px',
    color: '#111827', outline: 'none', fontFamily: 'inherit',
  },
  sendBtn: {
    width: '46px', height: '46px', borderRadius: '12px',
    border: 'none', background: '#3b6ef8', color: '#fff',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s',
  },
  sendBtnDisabled: { background: '#a0b4f8', cursor: 'not-allowed' },
  emptyState: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    color: '#9ca3af', gap: '12px',
  },
  errorBanner: {
    background: '#fef2f2', color: '#dc2626', padding: '10px 16px',
    fontSize: '13px', borderBottom: '1px solid #fecaca',
  },
  loadingRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px', color: '#9ca3af', fontSize: '14px',
  },
}

// ── Helpers ────────────────────────────────────────────────
const formatTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString()
}

const getOtherParticipant = (conv, myId, role) => {
  if (role === 'employer') {
    return { name: conv.freelancer?.fullName || 'Freelancer', avatar: conv.freelancer?.avatar }
  }
  return { name: conv.employer?.fullName || 'Employer', avatar: conv.employer?.avatar }
}

const getUnread = (conv, role) =>
  role === 'employer' ? conv.unreadEmployer : conv.unreadFreelancer

// ── Chat Page ──────────────────────────────────────────────
const Chat = () => {
  const location = useLocation()
  const { role } = useUser()
  const myId = JSON.parse(localStorage.getItem('user') || '{}')._id

  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(location.state?.conversationId || null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)

  // ── Fetch conversations ──────────────────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(api('/chat/conversations'), { headers: authHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setConversations(data.conversations || [])
      // Auto-select first if none selected
      setActiveId(prev => prev || (data.conversations?.[0]?._id || null))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingConvs(false)
    }
  }, [])

  // ── Fetch messages for active conversation ───────────────
  const fetchMessages = useCallback(async (convId) => {
    if (!convId) return
    setLoadingMsgs(true)
    try {
      const res = await fetch(api(`/chat/conversations/${convId}/messages`), { headers: authHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMessages(data.messages || [])
      // Clear unread locally
      setConversations(prev =>
        prev.map(c => c._id === convId
          ? { ...c, unreadEmployer: 0, unreadFreelancer: 0 }
          : c
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingMsgs(false)
    }
  }, [])

  // ── Send message ─────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || !activeId || sending) return
    setSending(true)
    setError('')
    try {
      const res = await fetch(api(`/chat/conversations/${activeId}/messages`), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ content: input.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMessages(prev => [...prev, data.message])
      setInput('')
      // Update lastMessage in sidebar
      setConversations(prev =>
        prev.map(c => c._id === activeId
          ? { ...c, lastMessage: input.trim(), lastMessageAt: new Date().toISOString() }
          : c
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // ── Poll for new messages every 5s ──────────────────────
  useEffect(() => {
    if (!activeId) return
    pollRef.current = setInterval(() => fetchMessages(activeId), 5000)
    return () => clearInterval(pollRef.current)
  }, [activeId, fetchMessages])

  // ── Initial load ─────────────────────────────────────────
  useEffect(() => {
    const loadConversations = async () => { await fetchConversations() }
    loadConversations()
  }, [fetchConversations])

  // ── Load messages when active conversation changes ───────
  useEffect(() => {
    if (!activeId) return
    const loadMessages = async () => { await fetchMessages(activeId) }
    loadMessages()
  }, [activeId, fetchMessages])

  // ── Scroll to bottom on new messages ────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const activeConv = conversations.find(c => c._id === activeId)
  const otherUser = activeConv ? getOtherParticipant(activeConv, myId, role?.toLowerCase()) : null

  const filtered = conversations.filter(c => {
    const other = getOtherParticipant(c, myId, role?.toLowerCase())
    return other.name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div style={S.page}>
      <NavbarTask />

      <div style={S.body}>
        {/* ── Sidebar ── */}
        <div style={S.sidebar}>
          <div style={S.sidebarHeader}>
            <p style={S.sidebarTitle}>Messages</p>
            <div style={S.searchBox}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input style={S.searchInput} placeholder="Search…" value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div style={S.convList}>
            {loadingConvs ? (
              <div style={S.loadingRow}>Loading…</div>
            ) : filtered.length === 0 ? (
              <div style={S.loadingRow}>No conversations yet</div>
            ) : filtered.map(c => {
              const other = getOtherParticipant(c, myId, role?.toLowerCase())
              const unread = getUnread(c, role?.toLowerCase())
              return (
                <div key={c._id} style={S.convItem(c._id === activeId)}
                  onClick={() => setActiveId(c._id)}>
                  <div style={S.convAvatar}>
                    {other.avatar
                      ? <img src={other.avatar} alt={other.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : other.name[0]}
                  </div>
                  <div style={S.convInfo}>
                    <p style={S.convName(unread > 0)}>{other.name}</p>
                    <span style={S.convLast}>
                      {c.work?.title ? `📁 ${c.work.title}` : ''}{c.lastMessage ? ` · ${c.lastMessage}` : ''}
                    </span>
                  </div>
                  <div style={S.convMeta}>
                    <span style={S.convTime}>{formatTime(c.lastMessageAt)}</span>
                    {unread > 0 && <div style={S.convBadge}>{unread}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Chat area ── */}
        {activeConv && otherUser ? (
          <div style={S.chatArea}>
            {/* Header */}
            <div style={S.chatHeader}>
              <div style={S.chatHeaderAvatar}>
                {otherUser.avatar
                  ? <img src={otherUser.avatar} alt={otherUser.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : otherUser.name[0]}
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>{otherUser.name}</p>
                {activeConv.work?.title && (
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>📁 {activeConv.work.title}</p>
                )}
              </div>
            </div>

            {error && <div style={S.errorBanner}>{error}</div>}

            {/* Messages */}
            <div style={S.chatMessages}>
              {loadingMsgs ? (
                <div style={S.loadingRow}>Loading messages…</div>
              ) : messages.length === 0 ? (
                <div style={{ ...S.emptyState, flex: 'none', paddingTop: '40px' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>No messages yet. Say hello!</p>
                </div>
              ) : messages.map(msg => {
                const fromMe = msg.sender?._id === myId || msg.sender === myId
                return (
                  <div key={msg._id} style={S.msgRow(fromMe)}>
                    <div>
                      <div style={S.msgBubble(fromMe)}>{msg.content}</div>
                      <p style={S.msgTime(fromMe)}>{formatTime(msg.createdAt)}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={S.chatInputArea}>
              <input
                style={S.chatInput}
                placeholder="Type a message…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
              />
              <button
                style={{ ...S.sendBtn, ...(sending || !input.trim() ? S.sendBtnDisabled : {}) }}
                onClick={handleSend}
                disabled={sending || !input.trim()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div style={S.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p style={{ margin: 0, fontSize: '15px' }}>
              {loadingConvs ? 'Loading…' : 'Select a conversation to start chatting'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat