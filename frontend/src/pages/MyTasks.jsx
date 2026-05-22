import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarTask from '../components/NavbarTask'
import logo from '../assets/logo.svg'
import '../styles/Profile.css'

const MyTasks = () => {
  const navigate = useNavigate()

  const [works,   setWorks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState("")

  useEffect(() => {
    const fetchMyWorks = async () => {
      setLoading(true)
      setError("")
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/works/mine", {
          headers: { "Authorization": `Bearer ${token}` },
        })
        if (res.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          navigate("/signin")
          return
        }
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || "Failed to load your tasks.")
          return
        }
        setWorks(data.works || data.data || data || [])
      } catch {
        setError("Network error. Could not load tasks.")
      } finally {
        setLoading(false)
      }
    }
    fetchMyWorks()
  }, [navigate])

  const handleRemoveTask = async (workId) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`/api/works/${workId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      })
      if (res.ok) {
        setWorks(prev => prev.filter(w => w._id !== workId))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const formatBudget = (budget) => {
    if (!budget) return "—"
    return `$${budget.min} – $${budget.max}`
  }

  const getBudgetType = (budget) => {
    if (!budget) return ""
    return budget.type || "fixed"
  }

  const getCategoryColor = (category) => {
    const colors = {
      'tech': '#6366f1',
      'education': '#0ea5e9',
      'health': '#10b981',
      'house': '#f59e0b',
      'design': '#ec4899',
      'default': '#1a4eb8'
    }
    const key = (category || '').toLowerCase().replace(/_/g, ' ')
    for (const [k, v] of Object.entries(colors)) {
      if (key.includes(k)) return v
    }
    return colors.default
  }

  return (
    <div className="mytasks-page">
      <NavbarTask />

      {/* Sub Navigation */}
      <div className="mytasks-subnav">
        <div className="mytasks-subnav-inner">
          <a href="/profile">My Profile</a>
          <a href="/my-tasks" className="active">My Tasks</a>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="mytasks-hero">
        <div className="mytasks-hero-inner">
          <h1>My Posted Tasks</h1>
          <p>Manage and track all your active task listings</p>
          <button className="mytasks-post-btn" onClick={() => navigate('/add-task')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Post a New Task
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mytasks-main">

        {/* Stats Bar */}
        {!loading && !error && works.length > 0 && (
          <div className="mytasks-stats">
            <div className="stat-chip">
              <span className="stat-num">{works.length}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-chip">
              <span className="stat-num">{works.filter(w => (w.status || 'open') === 'open').length}</span>
              <span className="stat-label">Open</span>
            </div>
            <div className="stat-chip">
              <span className="stat-num">{works.reduce((s, w) => s + (w.totalBids ?? 0), 0)}</span>
              <span className="stat-label">Total Bids</span>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="mytasks-list">
          {loading ? (
            <div className="mytasks-state">
              <div className="state-spinner"></div>
              <p>Loading your tasks…</p>
            </div>
          ) : error ? (
            <div className="mytasks-state mytasks-state--error">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p>{error}</p>
            </div>
          ) : works.length === 0 ? (
            <div className="mytasks-empty">
              <div className="empty-illustration">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15" x2="12" y2="15"/></svg>
              </div>
              <h2>No Tasks Posted Yet</h2>
              <p>You haven't posted any tasks. Create one now to start receiving bids.</p>
              <button className="mytasks-post-btn" onClick={() => navigate('/add-task')}>
                Post Your First Task
              </button>
            </div>
          ) : (
            works.map((work, i) => (
              <div
                key={work._id}
                className="task-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Left accent bar */}
                <div
                  className="task-card__accent"
                  style={{ background: getCategoryColor(work.category) }}
                />

                <div className="task-card__body">
                  {/* Top row */}
                  <div className="task-card__top">
                    <div className="task-card__meta">
                      <span
                        className="task-card__category"
                        style={{
                          background: getCategoryColor(work.category) + '18',
                          color: getCategoryColor(work.category)
                        }}
                      >
                        {work.category?.replace(/_/g, ' ') || 'General'}
                      </span>
                      <span className={`task-card__status task-card__status--${(work.status || 'open').toLowerCase()}`}>
                        {work.status || 'open'}
                      </span>
                    </div>
                    <button
                      className="task-card__remove"
                      onClick={() => handleRemoveTask(work._id)}
                      title="Remove task"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                      Remove
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="task-card__title">{work.title}</h3>

                  {/* Description */}
                  <p className="task-card__desc">{work.description}</p>

                  {/* Bottom row */}
                  <div className="task-card__bottom">
                    <div className="task-card__details">
                      <span className="task-card__detail">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {work.location}
                      </span>
                      <span className="task-card__detail">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        {work.totalBids ?? 0} bid{work.totalBids !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="task-card__budget">
                      <span className="budget-label">Budget</span>
                      <span className="budget-amount">{formatBudget(work.budget)}</span>
                      <span className="budget-type">{getBudgetType(work.budget)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mytasks-footer">
        <div className="footer-cols">
          <div className="f-col about">
            <img src={logo} alt="ASKILI" className="logo-img footer-logo" />
            <p>Powerful Freelance Marketplace System with ability to change the Users (Freelancers &amp; Clients)</p>
          </div>
          <div className="f-col">
            <h4>For Clients</h4>
            <ul>
              <li>Find Freelancers</li>
              <li>Post Project</li>
            </ul>
          </div>
          <div className="f-col">
            <h4>For Freelancers</h4>
            <ul>
              <li>Find Work</li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Call Us</h4>
            <ul>
              <li>✉️ taskili@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="copyright">2022 Spacelance. All right reserved</div>
      </footer>
    </div>
  )
}

export default MyTasks