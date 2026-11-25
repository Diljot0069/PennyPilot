const getBudgets = async (req, res) => {
  res.status(200).json({ budgets: [] })
}

const createBudget = async (req, res) => {
  res.status(201).json({ message: 'Budget created', budget: req.body})
}

module.exports = { getBudgets, createBudget}
