import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import '../styles/NavbarTask.css'
import logo from '../assets/logo.svg'
import persone from '../assets/profile.jpg'

const SwitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4m0 0L3 8m4-4l4 4" />
    <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
)

const SupportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
)

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
             a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
             A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
             l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
             A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
             l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
             a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
             l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
             a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const DropdownMenu = ({ user, onClose }) => {
  const navigate = useNavigate()
  const { role, setRole } = useUser()

  const handleSwitch = () => {
    if (role === 'Freelancer') {
      setRole('Employer')
      navigate('/profile')      // Employer profile page
    } else {
      setRole('Freelancer')
      navigate('/tasks')        // Freelancer finds tasks
    }
  }

  const switchLabel = role === 'Freelancer' ? 'Switch to Employer' : 'Switch to Freelancer'

  const menuItems = [
    { icon: <SwitchIcon />,   label: switchLabel,  action: handleSwitch },
    { icon: <SupportIcon />,  label: 'Support',    action: () => {} },
    { icon: <SettingsIcon />, label: 'Settings',   action: () => {} },
  ]

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
        {menuItems.map(({ icon, label, action }) => (
          <li key={label}>
            <button
              className="dropdown__item"
              onClick={() => { action(); onClose() }}
            >
              {icon}
              {label}
            </button>
          </li>
        ))}

        <li><div className="dropdown__divider" /></li>

        <li>
          <button
            className="dropdown__item"
            onClick={() => { console.log('logout'); onClose() }}
          >
            <LogoutIcon />
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

const NavbarTask = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { profilePic, fullName, role, setRole } = useUser()

  useEffect(() => {
    const path = location.pathname;
    if (path === '/profile' || path === '/my-tasks') {
      if (role !== 'Employer') setRole('Employer');
    } else if (path === '/tasks') {
      if (role !== 'Freelancer') setRole('Freelancer');
    }
  }, [location.pathname, role, setRole]);

  const displayName = fullName
    ? `@${fullName.split(" ")[0]}`
    : '@Romioo'

  const avatar = profilePic || persone

  const user = {
    username: displayName,
    role: role,          // ← now dynamic
    avatar: avatar,
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="navbar">
      <a href="/" className="navbar__logo">
        <img src={logo} alt="Askili" />
      </a>

      <div className="navbar__right">
        <button className="navbar__post-btn" onClick={() => navigate('/add-task')}>
          Post a project
        </button>

        <div
          className="navbar__user"
          ref={dropdownRef}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <img src={avatar} alt={displayName} className="navbar__avatar" />
          <div className="navbar__user-info">
            <span className="navbar__username">{displayName}</span>
            <span className="navbar__role">{role}</span>   {/* ← dynamic */}
          </div>

          {dropdownOpen && (
            <DropdownMenu user={user} onClose={() => setDropdownOpen(false)} />
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavbarTask