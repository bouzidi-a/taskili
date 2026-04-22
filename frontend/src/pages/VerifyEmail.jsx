import { useState } from "react"
import { useNavigate } from "react-router-dom"

function VerifyEmail() {
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!code) {
      setError("Please enter the verification code.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const userId = localStorage.getItem("pendingUserId")

      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Verification failed.")
        return
      }

      // ✅ Save token and user
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.removeItem("pendingUserId")

      // ✅ Go to choose role
      navigate("/choose-role")

    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-right" style={{ margin: "auto" }}>
        <div className="auth-form">
          <h1>Verify Your Email</h1>
          <p className="subtitle">Enter the 6-digit code sent to your email.</p>

          <div className="field">
            <label>Verification Code</label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="btn-auth" onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail