import { createContext, useContext } from 'react'

export const UserContext = createContext()

export function normalizeRole(role) {
  if (!role) return 'Employer'
  return role.toLowerCase() === 'freelancer' ? 'Freelancer' : 'Employer'
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}