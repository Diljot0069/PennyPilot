const mongoose = require('mongoose')
const Transaction = require('../models/Transaction')
const getReports = async (req, res) => {
  const month = /^\d{4}-\d{2}$/.test(req.query.month || '') ? req.query.month : new Date().toISOString().slice(0,7)
  const start = new Date(`${month}-01T00:00:00.000Z`)
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth()+1, 1))
  const user = new mongoose.Types.ObjectId(req.user.userId)
  const [totals] = await Transaction.aggregate([
    { $match: { user, date: { $gte:start, $lt:end } } },
    { $group: { _id:null, income:{ $sum:{ $cond:[{ $eq:['$type','income'] },'$amount',0] } }, expenses:{ $sum:{ $cond:[{ $eq:['$type','expense'] },'$amount',0] } }, count:{ $sum:1 } } },
  ])
  const byCategory = await Transaction.aggregate([
    { $match:{ user, type:'expense', date:{ $gte:start, $lt:end } } },
    { $group:{ _id:'$category', amount:{ $sum:'$amount' } } }, { $sort:{ amount:-1 } },
  ])
  const income = totals?.income || 0, expenses = totals?.expenses || 0
  res.json({ month, summary:{ income, expenses, net:income-expenses, transactionCount:totals?.count || 0 }, byCategory:byCategory.map(x=>({ name:x._id, amount:x.amount })) })
}
module.exports = { getReports }
