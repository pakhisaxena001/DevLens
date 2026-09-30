const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '')

const toQueryString = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  return entries.length ? `?${new URLSearchParams(entries)}` : ''
}

const getErrorMessage = (body, fallback) => body?.error || body?.message || fallback

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export const request = async (path, { method = 'GET', body, headers = {}, params, signal } = {}) => {
  const token = localStorage.getItem('authToken')
  const response = await fetch(`${API_BASE_URL}${path}${toQueryString(params)}`, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok || payload?.success === false) {
    throw new ApiError(getErrorMessage(payload, `Request failed with status ${response.status}`), response.status, payload)
  }

  return payload
}

const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}

export { API_BASE_URL }
export default api
