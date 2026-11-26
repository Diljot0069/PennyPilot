import api from './api'
export const getTransactions = async () => (await api.get('/transactions')).transactions
export const createTransaction = async (transaction) => (await api.post('/transactions', transaction)).transaction
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`)
