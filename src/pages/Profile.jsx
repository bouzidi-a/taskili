import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarTask from '../components/NavbarTask'
import { useUser } from '../context/UserContext'
import '../styles/Profile.css'
import logo from '../assets/logo.svg'
import defaultCover from '../assets/Profile.jpg'

const Profile = () => {
  const navigate = useNavigate()
  const {
    profilePic, setProfilePic,
    fullName,   setFullName,
    coverPhoto, setCoverPhoto,
    bio,        setBio,
    cv,         setCv,
    portfolio,  setPortfolio,
    experiences,  setExperiences,
    education,    setEducation,
    qualifications, setQualifications,
  } = useUser()

  const coverRef     = useRef()
  const avatarRef    = useRef()
  const cvRef        = useRef()
  const portfolioRef = useRef()

  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState(fullName)
  const [editBio,  setEditBio]  = useState(bio)

  const [modal,    setModal]    = useState(null)
  const [formData, setFormData] = useState({})

  const displayName = fullName || 'Your Name'
  const username    = fullName ? `@${fullName.split(' ')[0]}` : '@username'
  const avatar      = profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150'
  const cover       = coverPhoto || defaultCover

  const handleCoverUpload    = (e) => { const f = e.target.files[0]; if (f) setCoverPhoto(URL.createObjectURL(f)) }
  const handleAvatarUpload   = (e) => { const f = e.target.files[0]; if (f) setProfilePic(URL.createObjectURL(f)) }
  const handleCvUpload       = (e) => { const f = e.target.files[0]; if (f) setCv({ name: f.name, url: URL.createObjectURL(f) }) }
  const handlePortfolioUpload= (e) => { const f = e.target.files[0]; if (f) setPortfolio({ name: f.name, url: URL.createObjectURL(f) }) }

  const saveEditProfile = () => { setFullName(editName); setBio(editBio); setEditOpen(false) }

  const openModal = (type) => { setFormData({}); setModal(type) }

  const saveModal = () => {
    if (modal === 'experience')    setExperiences(prev    => [...prev, formData])
    if (modal === 'education')     setEducation(prev      => [...prev, formData])
    if (modal === 'qualification') setQualifications(prev => [...prev, formData])
    setModal(null)
  }

  const removeItem = (type, index) => {
    if (type === 'experience')    setExperiences(prev    => prev.filter((_, i) => i !== index))
    if (type === 'education')     setEducation(prev      => prev.filter((_, i) => i !== index))
    if (type === 'qualification') setQualifications(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="profile-page">
      <NavbarTask />

      {/* Sub Navigation */}
      <div className="profile-subnav">
        <div className="profile-subnav-container">
          <a href="/profile" className="active">My Profile</a>
          <a href="/my-tasks">My Tasks</a>
        </div>
      </div>

      {/* Cover Photo — click to upload, no overlay */}
      <div
        className="profile-cover"
        style={{ backgroundImage: `url(${cover})`, cursor: 'pointer' }}
        onClick={() => coverRef.current.click()}
        title="Click to change cover photo"
      />
      <input type="file" accept="image/*" ref={coverRef} style={{ display: 'none' }} onChange={handleCoverUpload} />

      {/* Main Content */}
      <div className="profile-main-container">
        <div className="profile-header">

          {/* Avatar */}
          <div className="profile-avatar-container">
            <img src={avatar} alt={displayName} className="profile-avatar" />
            <button className="edit-avatar-btn" onClick={() => avatarRef.current.click()}>✏️</button>
            <input type="file" accept="image/*" ref={avatarRef} style={{ display: 'none' }} onChange={handleAvatarUpload} />
          </div>

          {/* Edit Profile */}
          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={() => { setEditName(fullName); setEditBio(bio); setEditOpen(true) }}>
              Edit Profile ✏️
            </button>
          </div>

          {/* Name & Rating */}
          <div className="profile-user-details">
            <div className="profile-name-row">
              <h1 className="profile-name">{displayName}</h1>
              <span className="profile-username">{username}</span>
            </div>
            <div className="profile-rating">
              <span className="stars">★ ★ ★ ★ ☆</span>
              <span className="rating-score">4.0</span>
              <span className="comments-count">💬 9</span>
            </div>
          </div>

          {/* Bio */}
          <div className="profile-bio">
            <p className="bio-label">Bio</p>
            <p className="bio-text">{bio}</p>
          </div>
        </div>

        {/* Sections */}
        <div className="profile-sections">

          {/* CV */}
          <div className="profile-section">
            <div className="section-header">
              <h2>CV</h2>
              <button className="add-btn" onClick={() => cvRef.current.click()}>+ Add CV</button>
              <input type="file" accept=".pdf,.doc,.docx" ref={cvRef} style={{ display: 'none' }} onChange={handleCvUpload} />
            </div>
            {cv ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>📄</span>
                <a href={cv.url} target="_blank" rel="noreferrer" style={{ color: '#1a4eb8', fontWeight: 500 }}>{cv.name}</a>
                <button onClick={() => setCv(null)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: 700 }}>✕ Remove</button>
              </div>
            ) : (
              <div className="section-empty-state">
                <div className="empty-icon cv-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <p>No CV has been uploaded</p>
              </div>
            )}
          </div>

          {/* Portfolio */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Portfolio</h2>
              <button className="add-btn" onClick={() => portfolioRef.current.click()}>+ Add Portfolio</button>
              <input type="file" accept="image/*,.pdf" ref={portfolioRef} style={{ display: 'none' }} onChange={handlePortfolioUpload} />
            </div>
            {portfolio ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>🖼️</span>
                <a href={portfolio.url} target="_blank" rel="noreferrer" style={{ color: '#1a4eb8', fontWeight: 500 }}>{portfolio.name}</a>
                <button onClick={() => setPortfolio(null)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: 700 }}>✕ Remove</button>
              </div>
            ) : (
              <div className="section-empty-state">
                <div className="empty-icon portfolio-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </div>
                <p>No Portfolio has been uploaded</p>
              </div>
            )}
          </div>

          {/* Experiences */}
          <div className="profile-section border-top">
            <div className="section-header">
              <h2>Experiences</h2>
              <button className="add-btn" onClick={() => openModal('experience')}>+ Add Experiences</button>
            </div>
            {experiences.length === 0 ? (
              <p className="empty-text">No experiences have been added</p>
            ) : experiences.map((exp, i) => (
              <div key={i} style={{ marginBottom: 15, padding: '12px 16px', background: '#f8fafc', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>{exp.title}</p>
                  <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 13 }}>{exp.company} · {exp.years}</p>
                </div>
                <button onClick={() => removeItem('experience', i)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: 700 }}>✕</button>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="profile-section border-top">
            <div className="section-header">
              <h2>Education</h2>
              <button className="add-btn" onClick={() => openModal('education')}>+ Add Education</button>
            </div>
            {education.length === 0 ? (
              <p className="empty-text">No education has been added</p>
            ) : education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 15, padding: '12px 16px', background: '#f8fafc', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>{edu.degree}</p>
                  <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 13 }}>{edu.school} · {edu.years}</p>
                </div>
                <button onClick={() => removeItem('education', i)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: 700 }}>✕</button>
              </div>
            ))}
          </div>

          {/* Qualifications */}
          <div className="profile-section border-top">
            <div className="section-header">
              <h2>Qualifications</h2>
              <button className="add-btn" onClick={() => openModal('qualification')}>+ Add Qualifications</button>
            </div>
            {qualifications.length === 0 ? (
              <p className="empty-text">No qualifications have been added</p>
            ) : qualifications.map((q, i) => (
              <div key={i} style={{ marginBottom: 15, padding: '12px 16px', background: '#f8fafc', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>{q.title}</p>
                  <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 13 }}>{q.issuer} · {q.year}</p>
                </div>
                <button onClick={() => removeItem('qualification', i)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: 700 }}>✕</button>
              </div>
            ))}
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

      {/* Edit Profile Modal */}
      {editOpen && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0, color: '#1e293b' }}>Edit Profile</h2>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your full name" />
            <label style={labelStyle}>Bio</label>
            <textarea style={{ ...inputStyle, height: 100, resize: 'vertical' }} value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Write something about yourself..." />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
              <button style={cancelBtnStyle} onClick={() => setEditOpen(false)}>Cancel</button>
              <button style={saveBtnStyle} onClick={saveEditProfile}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {modal === 'experience' && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0, color: '#1e293b' }}>Add Experience</h2>
            <label style={labelStyle}>Job Title</label>
            <input style={inputStyle} placeholder="e.g. Frontend Developer" onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
            <label style={labelStyle}>Company</label>
            <input style={inputStyle} placeholder="e.g. Google" onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} />
            <label style={labelStyle}>Years</label>
            <input style={inputStyle} placeholder="e.g. 2021 - 2023" onChange={e => setFormData(p => ({ ...p, years: e.target.value }))} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
              <button style={cancelBtnStyle} onClick={() => setModal(null)}>Cancel</button>
              <button style={saveBtnStyle} onClick={saveModal}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Education Modal */}
      {modal === 'education' && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0, color: '#1e293b' }}>Add Education</h2>
            <label style={labelStyle}>Degree</label>
            <input style={inputStyle} placeholder="e.g. Bachelor in Computer Science" onChange={e => setFormData(p => ({ ...p, degree: e.target.value }))} />
            <label style={labelStyle}>School</label>
            <input style={inputStyle} placeholder="e.g. University of Oran" onChange={e => setFormData(p => ({ ...p, school: e.target.value }))} />
            <label style={labelStyle}>Years</label>
            <input style={inputStyle} placeholder="e.g. 2019 - 2023" onChange={e => setFormData(p => ({ ...p, years: e.target.value }))} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
              <button style={cancelBtnStyle} onClick={() => setModal(null)}>Cancel</button>
              <button style={saveBtnStyle} onClick={saveModal}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Qualification Modal */}
      {modal === 'qualification' && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0, color: '#1e293b' }}>Add Qualification</h2>
            <label style={labelStyle}>Title</label>
            <input style={inputStyle} placeholder="e.g. AWS Certified Developer" onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
            <label style={labelStyle}>Issuer</label>
            <input style={inputStyle} placeholder="e.g. Amazon" onChange={e => setFormData(p => ({ ...p, issuer: e.target.value }))} />
            <label style={labelStyle}>Year</label>
            <input style={inputStyle} placeholder="e.g. 2023" onChange={e => setFormData(p => ({ ...p, year: e.target.value }))} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
              <button style={cancelBtnStyle} onClick={() => setModal(null)}>Cancel</button>
              <button style={saveBtnStyle} onClick={saveModal}>Add</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
}
const modalStyle = {
  background: '#fff', borderRadius: 12,
  padding: '30px', width: '100%', maxWidth: 460,
  display: 'flex', flexDirection: 'column', gap: 10,
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
}
const labelStyle = { fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 2 }
const inputStyle = {
  width: '100%', padding: '10px 12px',
  border: '1px solid #e2e8f0', borderRadius: 8,
  fontSize: 14, outline: 'none', boxSizing: 'border-box',
  fontFamily: 'Poppins, sans-serif',
}
const saveBtnStyle = {
  background: '#1a4eb8', color: '#fff',
  border: 'none', borderRadius: 8,
  padding: '10px 24px', fontWeight: 600,
  cursor: 'pointer', fontSize: 14,
}
const cancelBtnStyle = {
  background: '#e2e8f0', color: '#334155',
  border: 'none', borderRadius: 8,
  padding: '10px 24px', fontWeight: 600,
  cursor: 'pointer', fontSize: 14,
}

export default Profile