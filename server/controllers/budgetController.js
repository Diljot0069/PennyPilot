
const mongoose = require('mongoose')
const Budget = require('../models/Budget')
const Transaction = require('../models/Transaction')


const isValidMonth = (month) => {
  return (
    typeof month === 'string' &&
    /^\d{4}-(0[1-9]|1[0-2])$/.test(month)
  )
}


const getBudgets = async (req, res) => {
  try {
    const requestedMonth = req.query.month
    const month = isValidMonth(requestedMonth)
      ? requestedMonth
      : new Date().toISOString().slice(0, 7)

    const start = new Date(`${month}-01T00:00:00.000Z`)

    const end = new Date(
      Date.UTC(
        start.getUTCFullYear(),
        start.getUTCMonth() + 1,
        1
      )
    )

    const budgets = await Budget.find({
      user: req.user.userId,
      month,
    }).lean()

    const spending = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.userId),
          type: 'expense',
          date: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: '$category',
          used: { $sum: '$amount' },
        },
      },
    ])

    const spendingMap = new Map(
      spending.map((item) => [item._id, item.used])
    )

    const updatedBudgets = budgets.map((budget) => ({
      ...budget,
      used: spendingMap.get(budget.category) || 0,
    }))

    res.status(200).json({
      month,
      budgets: updatedBudgets,
    })
  } catch (error) {
    console.error('Get budgets error:', error)

    res.status(500).json({
      message: 'Unable to retrieve budgets.',
    })
  }
}


const createBudget = async (req, res) => {
  try {
    const {
      category,
      limit,
      month,
      color,
    } = req.body || {}

    const value = Number(limit)

  
    if (
      typeof category !== 'string' ||
      !category.trim()
    ) {
      return res.status(400).json({
        message: 'Please select a valid expense category.',
      })
    }

    if (!Number.isFinite(value) || value <= 0) {
      return res.status(400).json({
        message: 'Budget limit must be greater than zero.',
      })
    }

   
    if (!isValidMonth(month)) {
      return res.status(400).json({
        message: 'Please provide a valid month in YYYY-MM format.',
      })
    }


    const Category = require('../models/Category')

    const existingCategory = await Category.findOne({
      name: category.trim(),
      type: 'expense',
      user: req.user.userId,
    })

    if (!existingCategory) {
      return res.status(400).json({
        message: 'Selected expense category does not exist.',
      })
    }

 
    const budget = await Budget.create({
      category: category.trim(),
      limit: Math.round(value * 100) / 100,
      month,
      color: color || existingCategory.color || '#78965A',
      user: req.user.userId,
    })

    res.status(201).json({
      message: 'Budget created successfully.',
      budget: {
        ...budget.toObject(),
        used: 0,
      },
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'A budget already exists for this category and month.',
      })
    }

    console.error('Create budget error:', error)

    res.status(500).json({
      message: 'Unable to create budget.',
    })
  }
}


const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid budget ID.',
      })
    }

    const budget = await Budget.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    })

    if (!budget) {
      return res.status(404).json({
        message: 'Budget not found.',
      })
    }

    res.status(200).json({
      message: 'Budget deleted successfully.',
    })
  } catch (error) {
    console.error('Delete budget error:', error)

    res.status(500).json({
      message: 'Unable to delete budget.',
    })
  }
}

module.exports = {
  getBudgets,
  createBudget,
  deleteBudget,
}

