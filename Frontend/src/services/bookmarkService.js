import api from './api'

export const getBookmarks = () => api.get('/bookmarks')
export const getBookmark = (id) => api.get(`/bookmarks/${id}`)
export const createBookmark = (bookmark) => api.post('/bookmarks', bookmark)
export const deleteBookmark = (id) => api.delete(`/bookmarks/${id}`)
