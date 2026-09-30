import api from './api'

export const getUserRepositories = () => api.get('/repositories')
export const getRepository = (id) => api.get(`/repositories/${id}`)
export const syncRepository = (repository) => api.post('/repositories/sync', repository)
export const updateRepository = (id, updates) => api.put(`/repositories/${id}`, updates)
export const deleteRepository = (id) => api.delete(`/repositories/${id}`)
export const getRepositoryDetails = (id) => api.get(`/repositories/${id}/details`)

export const getPublicRepositories = (params) => api.get('/public/repositories', { params })
export const getPublicRepository = (id) => api.get(`/public/repository/${id}`)
export const getTrendingRepositories = () => api.get('/public/trending')
export const searchRepositories = (query, params = {}) => api.get('/public/search', { params: { q: query, ...params } })
