import api from './api'
export const getSummaryReport = async (month) => api.get(`/reports${month ? `?month=${encodeURIComponent(month)}` : ''}`)
