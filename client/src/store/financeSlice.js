import { createSlice } from '@reduxjs/toolkit'
import { demoTransactions, demoBudgets, demoCategories } from '../data/demoData'

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    transactions: demoTransactions,
    budgets: demoBudgets,
    categories: demoCategories,
  },
  reducers: {
    addTransaction: (state, action) => {
      const item = {
        ...action.payload,
        id: Date.now(),
        amount: Number(action.payload.amount),
        type: action.payload.type || 'expense',
        date: action.payload.date || new Date().toISOString().slice(0, 10),
      }

      state.transactions = [item, ...state.transactions]
    },
    setBudgets: (state, action) => {
      state.budgets = action.payload
    },
    setCategories: (state, action) => {
      state.categories = action.payload
    },
  },
})

export const { addTransaction, setBudgets, setCategories } = financeSlice.actions
export default financeSlice.reducer
