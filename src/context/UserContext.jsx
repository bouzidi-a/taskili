import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [profilePic, setProfilePic]   = useState(null)
  const [fullName, setFullName]       = useState("")
  const [role, setRole]               = useState("Freelancer")
  const [coverPhoto, setCoverPhoto]   = useState(null)
  const [bio, setBio]                 = useState("I am a very competent person, and valuable in the society, i do a lot of volunteering jobs, i am trustable and nice with people.")
  const [cv, setCv]                   = useState(null)
  const [portfolio, setPortfolio]     = useState(null)
  const [experiences, setExperiences] = useState([])
  const [education, setEducation]     = useState([])
  const [qualifications, setQualifications] = useState([])
  const [myTasks, setMyTasks]               = useState([])

  return (
    <UserContext.Provider value={{
      profilePic, setProfilePic,
      fullName,   setFullName,
      role,       setRole,
      coverPhoto, setCoverPhoto,
      bio,        setBio,
      cv,         setCv,
      portfolio,  setPortfolio,
      experiences,  setExperiences,
      education,    setEducation,
      qualifications, setQualifications,
      myTasks,        setMyTasks,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}