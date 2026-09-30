import api from './api'

export const register = (credentials) => api.post('/auth/register', credentials)
export const login = (credentials) => api.post('/auth/login', credentials)
export const refreshToken = () => api.post('/auth/refresh-token')
export const logout = () => api.post('/auth/logout')
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email })
export const resetPassword = (payload) => api.post('/auth/reset-password', payload)

// The backend exposes the authenticated user through the profile endpoint.
export const getCurrentUser = () => api.get('/users/profile')
