const mongoose = require('mongoose')
const Budget = require('../models/Budget')
const Transaction = require('../models/Transaction')
const getBudgets = async (req, res) => {
  const month = /^\d{4}-\d{2}$/.test(req.query.month || '') ? req.query.month : new Date().toISOString().slice(0, 7)
  const start = new Date(`${month}-01T00:00:00.000Z`)
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1))
  const budgets = await Budget.find({ user: req.user.userId, month }).lean()
  const spend = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user.userId), type: 'expense', date: { $gte: start, $lt: end } } },
    { $group: { _id: '$category', used: { $sum: '$amount' } } },
  ])
  const spent = new Map(spend.map(x => [x._id, x.used]))
  res.json({ budgets: budgets.map(b => ({ ...b, used: spent.get(b.category) || 0 })) })
}
const createBudget = async (req, res) => {
  const { category, limit, month = new Date().toISOString().slice(0, 7), color } = req.body || {}
  const value = Number(limit)
  if (!category?.trim() || !Number.isFinite(value) || value <= 0 || !/^\d{4}-\d{2}$/.test(month))
    return res.status(400).json({ message: 'Provide a category, positive limit and valid YYYY-MM month.' })
  try {
    const budget = await Budget.create({ category: category.trim(), limit: Math.round(value * 100) / 100, month, color, user: req.user.userId })
    res.status(201).json({ budget: { ...budget.toObject(), used: 0 } })
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'A budget already exists for this category and month.' })
    throw e
  }
}
const deleteBudget = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid budget ID.' })
  const item = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.userId })
  if (!item) return res.status(404).json({ message: 'Budget not found.' })
  res.json({ message: 'Budget deleted' })
}
module.exports = { getBudgets, createBudget, deleteBudget }
