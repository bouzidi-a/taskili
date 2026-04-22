import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import logo from '../assets/logo.svg'
import '../styles/Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const { profilePic, fullName } = useUser()

  const isLoggedIn = !!fullName

  const displayName = fullName ? `@${fullName.split(" ")[0]}` : ""

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <img src={logo} alt="Askili" className="nav-logo" />
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/tasks">Find work</Link></li>
          <li><Link to="/find-freelancers">Find Freelancers</Link></li>
          {!isLoggedIn && <li><Link to="/signin">Log In</Link></li>}
          {!isLoggedIn && <li><Link to="/signup">Sign Up</Link></li>}
        </ul>

        <div className="nav-right">
          <button className="nav-post-btn" onClick={() => navigate('/add-task')}>
            Post a project
          </button>

          {isLoggedIn && (
            <div className="nav-profile">
              <div className="nav-avatar">
                {profilePic ? (
                  <img src={profilePic} alt="profile" className="nav-avatar-img" />
                ) : (
                  <div className="nav-avatar-placeholder">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="nav-profile-info">
                <span className="nav-username">{displayName}</span>
                <span className="nav-role">Freelancer</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar