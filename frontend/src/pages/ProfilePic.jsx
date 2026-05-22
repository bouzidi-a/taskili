import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/useUser'
import logo from '../assets/logo.svg'
import '../styles/ProfilePic.css'

function ProfilePic() {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()
  const navigate = useNavigate()
  const { setProfilePic } = useUser()

  const handleFile = (e) => {
    const nextFile = e.target.files[0]
    if (!nextFile) return

    const url = URL.createObjectURL(nextFile)
    setPreview(url)
    setFile(nextFile)
    setProfilePic(url)
    setError('')
  }

  const handleSave = async () => {
    if (!preview) {
      document.getElementById('avatarRing').classList.add('error')
      setTimeout(() => {
        document.getElementById('avatarRing').classList.remove('error')
      }, 1800)
      return
    }

    if (!file) {
      setError('Please choose an image to continue.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Avatar upload failed.')
        return
      }

      const avatarUrl = data.avatar || preview
      setProfilePic(avatarUrl)

      const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (storedUser) {
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          avatar: avatarUrl,
        }))
      }

      navigate('/choose-role')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pp-page">
      <div className="pp-left" />
      <div className="pp-right">
        <img src={logo} alt="ASKILI" className="pp-logo" />
        <h1 className="pp-title">Set Up Your Profile Picture</h1>
        <p className="pp-sub">
          Help others recognize you by uploading a clear photo of yourself.
          You can always change it later.
        </p>
        <div className="pp-avatar-wrap">
          <div
            id="avatarRing"
            className="pp-avatar-ring"
            onClick={() => fileRef.current.click()}
          >
            {preview ? (
              <img src={preview} alt="preview" className="pp-preview" />
            ) : (
              <div className="pp-placeholder">
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4361EE"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                  <path d="M12 14v4M10 16h4" strokeLinecap="round" />
                </svg>
                <span>Click to upload</span>
              </div>
            )}
          </div>
          <p className="pp-hint">JPG, PNG or GIF - Max 5MB</p>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          style={{ display: 'none' }}
          onChange={handleFile}
        />
        <button className="pp-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save & Continue'}
        </button>
        <button
          className="pp-btn-skip"
          onClick={() => navigate('/choose-role')}
          disabled={saving}
        >
          Skip for later
        </button>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  )
}

export default ProfilePic
