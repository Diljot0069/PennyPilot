const mockTransactions = [
  { id: 1, title: 'Salary', category: 'Income', amount: 2200, type: 'income', date: '2026-10-20' },
  { id: 2, title: 'Rent', category: 'Housing', amount: -1450, type: 'expense', date: '2026-10-18' },
]

export const getTransactions = async () => mockTransactions

export const createTransaction = async (transaction) => ({
  ...transaction,
  id: Date.now(),
})
