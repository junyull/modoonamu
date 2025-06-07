export const isLoggedIn = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isLoggedIn') === 'true'
}

export const login = () => {
  localStorage.setItem('isLoggedIn', 'true')
}

export const logout = () => {
  localStorage.setItem('isLoggedIn', 'false')
} 