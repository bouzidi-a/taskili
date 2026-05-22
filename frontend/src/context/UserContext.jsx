import { useState, useEffect } from 'react'
import { UserContext } from './userContextInstance'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '')
const PROFILE_URL = API_BASE_URL.endsWith('/api')
  ? `${API_BASE_URL}/profiles/me`
  : `${API_BASE_URL}/api/profiles/me`

function getStoredUser() {
  return JSON.parse(localStorage.getItem('user') || 'null')
}

function normalizeRole(role) {
  if (!role) return 'Employer'
  return role.toLowerCase() === 'freelancer' ? 'Freelancer' : 'Employer'
}

export function UserProvider({ children }) {
  const storedUser = getStoredUser()
  const [profilePic, setProfilePic]         = useState(storedUser?.avatar || null)
  const [fullName, setFullName]             = useState(storedUser?.fullName || "")
  const [role, setRoleState]               = useState(normalizeRole(storedUser?.role))
  const [coverPhoto, setCoverPhoto]         = useState(null)
  const [bio, setBio]                       = useState("")
  const [cv, setCv]                         = useState(null)
  const [portfolio, setPortfolio]           = useState([])
  const [experiences, setExperiences]       = useState([])
  const [education, setEducation]           = useState([])
  const [qualifications, setQualifications] = useState([])
  const [myTasks, setMyTasks]               = useState([])
  const [averageRating, setAverageRating]   = useState(0)
  const [totalReviews, setTotalReviews]     = useState(0)
  const [loading, setLoading]               = useState(true)

  // ── Persist role to localStorage whenever it changes ──────
  const setRole = (newRole) => {
    setRoleState(newRole)
    const currentStoredUser = getStoredUser()
    if (currentStoredUser) {
      localStorage.setItem('user', JSON.stringify({
        ...currentStoredUser,
        role: newRole.toLowerCase(),
      }))
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) { setLoading(false); return }

        const response = await fetch(PROFILE_URL, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const data = await response.json()
        if (!response.ok) return

        const { profile } = data
        const user = profile?.user || {}
        const currentStoredUser = getStoredUser()

        setFullName(user.fullName || "")
        setRoleState(normalizeRole(user.role))   // use internal setter on load (don't overwrite localStorage here)
        setProfilePic(user.avatar || null)
        localStorage.setItem('user', JSON.stringify({
          ...(currentStoredUser || {}),
          ...user,
        }))
        setBio(profile.bio || "")
        setAverageRating(profile.averageRating || 0)
        setTotalReviews(profile.totalReviews || 0)
        setCoverPhoto(profile.coverPhoto || null)
        setCv(profile.cv || null)
        setPortfolio(profile.portfolio || [])
        setExperiences(profile.experiences || [])
        setEducation(profile.education || [])
        setQualifications(profile.qualifications || [])
        setMyTasks(profile.myTasks || [])

      } catch (err) {
        console.error("Failed to fetch profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <UserContext.Provider value={{
      profilePic,     setProfilePic,
      fullName,       setFullName,
      role,           setRole,          // ← fixed: now persists to localStorage
      coverPhoto,     setCoverPhoto,
      bio,            setBio,
      cv,             setCv,
      portfolio,      setPortfolio,
      experiences,    setExperiences,
      education,      setEducation,
      qualifications, setQualifications,
      myTasks,        setMyTasks,
      averageRating,  setAverageRating,
      totalReviews,   setTotalReviews,
      loading,
    }}>
      {children}
    </UserContext.Provider>
  )
}