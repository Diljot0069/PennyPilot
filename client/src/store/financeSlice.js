import { createSlice } from '@reduxjs/toolkit'

const financeSlice = createSlice({
  name: 'finance',
  initialState: { transactions: [], budgets: [], categories: [], loading: false, error: null },
  reducers: {
    setFinanceLoading: (state, action) => { state.loading = action.payload },
    setFinanceError: (state, action) => { state.error = action.payload },
    setTransactions: (state, action) => { state.transactions = action.payload },
    addTransaction: (state, action) => { state.transactions = [action.payload, ...state.transactions] },
    removeTransaction: (state, action) => { state.transactions = state.transactions.filter((item) => (item._id || item.id) !== action.payload) },
    setBudgets: (state, action) => { state.budgets = action.payload },
    setCategories: (state, action) => { state.categories = action.payload },
  },
})

export const { setFinanceLoading, setFinanceError, setTransactions, addTransaction, removeTransaction, setBudgets, setCategories } = financeSlice.actions
export default financeSlice.reducer
