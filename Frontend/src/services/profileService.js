import api from './api'

export const getProfile = () => api.get('/users/profile')
export const updateProfile = (updates) => api.put('/users/profile', updates)
export const deleteAccount = () => api.delete('/users/account')
export const getUser = (id) => api.get(`/users/${id}`)
