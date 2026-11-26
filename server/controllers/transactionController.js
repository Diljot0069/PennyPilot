const mongoose = require('mongoose')
const Transaction = require('../models/Transaction')
const getTransactions = async (req, res) => {
  const filter = { user: req.user.userId }
  if (req.query.type && ['income', 'expense', 'transfer'].includes(req.query.type)) filter.type = req.query.type
  if (req.query.category) filter.category = req.query.category
  if (req.query.startDate || req.query.endDate) {
    filter.date = {}
    if (req.query.startDate) filter.date.$gte = new Date(`${req.query.startDate}T00:00:00.000Z`)
    if (req.query.endDate) filter.date.$lte = new Date(`${req.query.endDate}T23:59:59.999Z`)
  }
  const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 }).lean()
  res.json({ transactions })
}
const createTransaction = async (req, res) => {
  const { title, amount, type = 'expense', category, date } = req.body || {}
  const value = Number(amount)
  if (!title?.trim() || !category?.trim() || !Number.isFinite(value) || value <= 0)
    return res.status(400).json({ message: 'Title, category and an amount greater than zero are required.' })
  if (!['income', 'expense', 'transfer'].includes(type))
    return res.status(400).json({ message: 'Invalid transaction type.' })
  const transaction = await Transaction.create({ title: title.trim(), amount: Math.round(value * 100) / 100, type, category: category.trim(), date: date ? new Date(date) : new Date(), user: req.user.userId })
  res.status(201).json({ message: 'Transaction created', transaction })
}
const deleteTransaction = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid transaction ID.' })
  const item = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.userId })
  if (!item) return res.status(404).json({ message: 'Transaction not found.' })
  res.json({ message: 'Transaction deleted' })
}
module.exports = { getTransactions, createTransaction, deleteTransaction }
