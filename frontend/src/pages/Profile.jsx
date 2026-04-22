import React, { useState, useEffect } from 'react';
import NavbarTask from '../components/NavbarTask';
import '../styles/Profile.css';
import logo from '../assets/logo.svg';
import coverImg from '../assets/Profile.jpg';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Fetch my profile on mount ───────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/profiles/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to load profile.");
          return;
        }
        setProfile(data.profile);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ─── Render stars ────────────────────────────────────────
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star}>{star <= Math.round(rating) ? "★" : "☆"}</span>
    ));
  };

  if (loading) return <div className="profile-page"><NavbarTask /><p style={{ padding: "2rem" }}>Loading...</p></div>;
  if (error)   return <div className="profile-page"><NavbarTask /><p style={{ padding: "2rem", color: "red" }}>{error}</p></div>;

  const user = profile?.user || {};

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
              src={user.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150"}
              alt={user.fullName || "User"}
              className="profile-avatar"
            />
            <button className="edit-avatar-btn">✏️</button>
          </div>

          <div className="profile-actions">
            <button className="edit-profile-btn">Edit Profile ✏️</button>
          </div>

          <div className="profile-user-details">
            <div className="profile-name-row">
              <h1 className="profile-name">{user.fullName || "—"}</h1>
              <span className="profile-username">@{user.fullName?.replace(/\s+/g, "").toLowerCase() || "—"}</span>
            </div>
            <div className="profile-rating">
              <span className="stars">{renderStars(profile?.averageRating || 0)}</span>
              <span className="rating-score">{profile?.averageRating?.toFixed(1) || "0.0"}</span>
              <span className="comments-count">💬 {profile?.totalReviews || 0}</span>
            </div>
          </div>

          <div className="profile-bio">
            <p className="bio-label">Bio</p>
            <p className="bio-text">{profile?.bio || "No bio added yet."}</p>
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
            {profile?.portfolio?.length > 0 ? (
              <div className="portfolio-list">
                {profile.portfolio.map((item) => (
                  <div key={item._id} className="portfolio-item">
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                    {item.link && <a href={item.link} target="_blank" rel="noreferrer">{item.link}</a>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="section-empty-state">
                <div className="empty-icon portfolio-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
                    <circle cx="12" cy="13" r="3"></circle>
                  </svg>
                </div>
                <p>No Portfolio has been uploaded</p>
              </div>
            )}
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