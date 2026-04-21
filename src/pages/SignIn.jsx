import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/SignUp.css"
import logo from "../assets/logo.svg"
import googleIcon from "../assets/google.svg"
import facebookIcon from "../assets/facebook.svg"
import instagramIcon from "../assets/instagram.svg"
import linkedinIcon from "../assets/linkedin.svg"
import appleIcon from "../assets/apple.svg"

function SignIn() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    setError("")
    navigate("/tasks")
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-left" />

      <div className="auth-right">
        <div className="auth-form">

          <div className="logo">
            <img src={logo} alt="Askili" />
          </div>

          <h1>Log in to Your Account</h1>
          <p className="subtitle">Welcome back! Choose your preferred sign-in method.</p>

          <div className="fields-group">
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
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  <EyeIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="remember-forgot">
            <label className="remember">
              <input type="checkbox" />
              Remember me for 30 days
            </label>
            <a href="#" className="forgot-link">Forgot password? ›</a>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="btn-auth" onClick={handleSignIn}>Sign In</button>

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

export default SignIn