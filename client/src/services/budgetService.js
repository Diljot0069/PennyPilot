import api from './api'
export const getBudgets = async (month) => (await api.get(`/budgets${month ? `?month=${encodeURIComponent(month)}` : ''}`)).budgets
export const createBudget = async (budget) => (await api.post('/budgets', budget)).budget
export const deleteBudget = (id) => api.delete(`/budgets/${id}`)
