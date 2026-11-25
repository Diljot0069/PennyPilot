const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = {
  get: async (url) => fetch(`${API_BASE_URL}${url}`).then((res) => res.json()),
  post: async (url, payload) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => res.json()),
}

export default api
