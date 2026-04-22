import React from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarTask from '../components/NavbarTask'
import { useUser } from '../context/UserContext'
import '../styles/Profile.css'
import logo from '../assets/logo.svg'

const MyTasks = () => {
  const navigate = useNavigate()
  const { myTasks, setMyTasks } = useUser()

  const handleRemoveTask = (id) => {
    setMyTasks(prev => prev.filter(task => task.id !== id))
  }

  return (
    <div className="profile-page">
      <NavbarTask />

      {/* Sub Navigation */}
      <div className="profile-subnav">
        <div className="profile-subnav-container">
          <a href="/profile">My Profile</a>
          <a href="/my-tasks" className="active">My Tasks</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main-container" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {myTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', background: '#f8fafc', borderRadius: '12px' }}>
              <h2 style={{ color: '#475569', marginBottom: '10px' }}>No Tasks Posted Yet</h2>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>You haven't posted any tasks. Post one now to get started!</p>
              <button 
                onClick={() => navigate('/add-task')}
                style={{
                  background: '#1a4eb8', color: '#fff', border: 'none', borderRadius: '8px', 
                  padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
                }}
              >
                Post a Task
              </button>
            </div>
          ) : (
            myTasks.map(task => (
              <div key={task.id} style={{
                background: '#e2e8f0', // Slightly blueish-grey like the design
                borderRadius: '8px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative'
              }}>
                <button 
                  onClick={() => handleRemoveTask(task.id)}
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Remove
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '100px' }}>
                  <h3 style={{ margin: 0, color: '#1e40af', fontSize: '18px' }}>{task.title}</h3>
                  <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{task.category}</span>
                </div>
                <p style={{ margin: 0, color: '#334155', fontSize: '15px', lineHeight: '1.5' }}>
                  {task.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>{`${task.city} , ${task.wilaya} .`}</span>
                    {task.phone && <span style={{ color: '#64748b', fontSize: '14px' }}>📞 {task.phone}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ color: '#1e40af', fontWeight: 'bold' }}>The Price</span>
                    <span style={{ color: '#334155', fontSize: '14px' }}>{`${task.price} / ${task.per}`}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="profile-footer" style={{ marginTop: 'auto' }}>
        <div className="footer-cols">
          <div className="f-col about">
            <img src={logo} alt="TASKILI" className="logo-img footer-logo" />
            <p>Powerful Freelance Marketplace System with ability to change the Users (Freelancers & Clients)</p>
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
