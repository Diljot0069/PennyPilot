const express = require('express')
const { getTransactions, createTransaction, deleteTransaction } = require('../controllers/transactionController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()
router.use(authMiddleware)
router.get('/', getTransactions)
router.post('/', createTransaction)
router.delete('/:id', deleteTransaction)
module.exports = router
