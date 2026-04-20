import React from 'react';
import NavbarTask from '../components/NavbarTask';
import '../styles/Profile.css';
import logo from '../assets/logo.svg';

// Reusing assets if present, otherwise just placeholder URLs.
import coverImg from '../assets/Profile.jpg'; 

const Profile = () => {
  return (
    <div className="profile-page">
      <NavbarTask />
      
      {/* Sub Navigation */}
      <div className="profile-subnav">
        <div className="profile-subnav-container">
          <a href="#" className="active">My Profile</a>
          <a href="#">My Tasks</a>
          <a href="#">Tasks List</a>
          <a href="#">Inbox</a>
          <a href="#">Latest Tasks</a>
        </div>
      </div>

      {/* Hero Cover */}
      <div 
        className="profile-cover" 
        style={{ backgroundImage: `url(${coverImg})` }}
      ></div>

      {/* Main Content */}
      <div className="profile-main-container">
        
        {/* Profile Info Header */}
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150" 
              alt="Romaissa.R" 
              className="profile-avatar"
            />
            <button className="edit-avatar-btn">✏️</button>
          </div>
          
          <div className="profile-actions">
            <button className="edit-profile-btn">Edit Profile ✏️</button>
          </div>

          <div className="profile-user-details">
            <div className="profile-name-row">
              <h1 className="profile-name">Romaissa.R</h1>
              <span className="profile-username">@Romioo</span>
            </div>
            <div className="profile-rating">
              <span className="stars">★ ★ ★ ★ ☆</span>
              <span className="rating-score">4.0</span>
              <span className="comments-count">💬 9</span>
            </div>
          </div>

          <div className="profile-bio">
            <p className="bio-label">Bio</p>
            <p className="bio-text">
              I am a very competent person, and valuable in the society, i do a lot of volunteering jobs,
              i am trustable and nice with people.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="profile-sections">
          
          {/* CV Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>CV</h2>
              <button className="add-btn">+ Add CV</button>
            </div>
            <div className="section-empty-state">
              <div className="empty-icon cv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
              </div>
              <p>No CV has been uploaded</p>
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Portfolio</h2>
              <button className="add-btn">+ Add Portfolio</button>
            </div>
            <div className="section-empty-state">
              <div className="empty-icon portfolio-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
              </div>
              <p>No Portfolio has been uploaded</p>
            </div>
          </div>

          {/* Experiences Section */}
          <div className="profile-section border-top">
            <div className="section-header">
              <h2>Experiences</h2>
              <button className="add-btn">+ Add Experiences</button>
            </div>
            <p className="empty-text">No experiences have been added</p>
          </div>

          {/* Education Section */}
          <div className="profile-section border-top">
            <div className="section-header">
              <h2>Education</h2>
              <button className="add-btn">+ Add Education</button>
            </div>
            <p className="empty-text">No education has been added</p>
          </div>

          {/* Qualifications Section */}
          <div className="profile-section border-top">
            <div className="section-header">
              <h2>Qualifications</h2>
              <button className="add-btn">+ Add Qualifications</button>
            </div>
            <p className="empty-text">No qualifications have been added</p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="profile-footer">
        <div className="footer-cols">
          <div className="f-col about">
            <img src={logo} alt="TASKILI" className="logo-img footer-logo" />
            <p>Powerful Freelance Marketplace System with ability to change the Users (Freelancers & Clients)</p>
            <div className="social-links">
              <a href="#">📷</a>
              <a href="#">🐦</a>
              <a href="#">📘</a>
            </div>
          </div>
          <div className="f-col">
            <h4>For Clients</h4>
            <ul>
              <li>Find Freelancers</li>
              <li>Post Project</li>
              <li>Refund Policy</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className="f-col">
            <h4>For Freelancers</h4>
            <ul>
              <li>Find Work</li>
              <li>Create Account</li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Call Us</h4>
            <ul>
              <li>📍 Algeria</li>
              <li>📞 +2130000000</li>
              <li>✉️ taskili@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="copyright">2022 Spacelance. All right reserved</div>
      </footer>
    </div>
  );
};

export default Profile;
