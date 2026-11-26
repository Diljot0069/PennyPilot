import api from './api'
export const getCategories = async () => (await api.get('/categories')).categories
export const createCategory = async (category) => (await api.post('/categories', category)).category
