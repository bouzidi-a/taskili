import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "../context/useUser"
import "../styles/SignUp.css"
import logo from "../assets/logo.svg"
import googleIcon from "../assets/google.svg"
import facebookIcon from "../assets/facebook.svg"
import instagramIcon from "../assets/instagram.svg"
import linkedinIcon from "../assets/linkedin.svg"
import appleIcon from "../assets/apple.svg"

function SignUp() {
  const navigate = useNavigate()
  const { setFullName: setGlobalName } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirm) {
      setError("Please fill in all fields.")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setError("")
    setLoading(true)

    try {
      setGlobalName(fullName)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword: confirm,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || data.error || "Registration failed.")
        return
      }

      localStorage.setItem("pendingUserId", data.userId)
      navigate("/verify-email")

    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-left" />
      <div className="auth-right">
        <div className="auth-form">

          <div className="logo">
            <img src={logo} alt="Askili" />
          </div>

          <h1>Create Your Account</h1>
          <p className="subtitle">Join us and start your journey today.</p>

          <div className="fields-group">
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  <EyeIcon />
                </button>
              </div>
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <div className="input-wrap">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  <EyeIcon />
                </button>
              </div>
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="btn-auth" onClick={handleSignUp} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="divider">or</div>

          <div className="socials">
            <button className="social-btn"><img src={googleIcon} alt="Google" /></button>
            <button className="social-btn"><img src={facebookIcon} alt="Facebook" /></button>
            <button className="social-btn"><img src={instagramIcon} alt="Instagram" /></button>
            <button className="social-btn"><img src={linkedinIcon} alt="LinkedIn" /></button>
            <button className="social-btn"><img src={appleIcon} alt="Apple" /></button>
          </div>

        </div>
      </div>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

export default SignUp
