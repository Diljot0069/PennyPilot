const getTransactions = async (req, res) => {
  res.status(200).json({ transactions: [] })
}

const createTransaction = async (req, res) => {
  res.status(201).json({ message: 'Transaction created', transaction: req.body })
}

module.exports = { getTransactions, createTransaction }
