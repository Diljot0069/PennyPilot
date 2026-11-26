const Category = require('../models/Category')
const DEFAULTS = [
  ['Salary','income','#34d399'],['Freelance','income','#60a5fa'],
  ['Food','expense','#f59e0b'],['Housing','expense','#818cf8'],
  ['Transport','expense','#38bdf8'],['Utilities','expense','#fb7185'],
  ['Entertainment','expense','#c084fc'],['Healthcare','expense','#2dd4bf'],
]
const getCategories = async (req, res) => {
  let categories = await Category.find({ user: req.user.userId }).sort({ type: 1, name: 1 }).lean()
  if (!categories.length) {
    await Category.insertMany(DEFAULTS.map(([name,type,color]) => ({ name,type,color,user:req.user.userId })))
    categories = await Category.find({ user: req.user.userId }).sort({ type: 1, name: 1 }).lean()
  }
  res.json({ categories })
}
const createCategory = async (req, res) => {
  const { name, type, color } = req.body || {}
  if (!name?.trim() || !['income','expense'].includes(type)) return res.status(400).json({ message: 'Provide a name and type (income or expense).' })
  const exists = await Category.findOne({ user:req.user.userId, name:name.trim(), type })
  if (exists) return res.status(409).json({ message:'Category already exists.' })
  const category = await Category.create({ name:name.trim(), type, color, user:req.user.userId })
  res.status(201).json({ category })
}
module.exports = { getCategories, createCategory }
