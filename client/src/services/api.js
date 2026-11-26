
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
).replace(/\/$/, '')

const request = async (path, options = {}) => {
  const token = localStorage.getItem('pennypilot-token')
  const headers = { ...options.headers }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(
      `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
      { ...options, headers }
    )
  } catch {
    throw new Error(
      'Unable to connect to PennyPilot. Please try again later.'
    )
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`)
  }

  return data
}

const api = {
  get: (path) => request(path),
  post: (path, payload) =>
    request(path, { method: 'POST', body: JSON.stringify(payload) }),
  put: (path, payload) =>
    request(path, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

export { api }
export default api
