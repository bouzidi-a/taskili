import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  // Later you'll get these from your auth/user context
  const user = {
    username: "@Romioo",
    role: "Freelancer",
    photo: null, // replace with user.photo from your backend
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false); // change to true to test profile

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <img src={logo} alt="Askili" className="nav-logo" />
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/find-tasks">Find work</Link></li>
          <li><Link to="/find-freelancers">Find Freelancers</Link></li>
          {!isLoggedIn && <li><Link to="/signin">Log In</Link></li>}
          {!isLoggedIn && <li><Link to="/signup">Sign Up</Link></li>}
        </ul>

        <div className="nav-right">
          <button className="nav-post-btn" onClick={() => navigate('/add-task')}>Post a project</button>

          {isLoggedIn && (
            <div className="nav-profile">
              <div className="nav-avatar">
                {user.photo ? (
                  <img src={user.photo} alt="profile" className="nav-avatar-img" />
                ) : (
                  <div className="nav-avatar-placeholder">
                    {user.username.charAt(1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="nav-profile-info">
                <span className="nav-username">{user.username}</span>
                <span className="nav-role">{user.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;