const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0.01 },
  type: {
    type: String,
    enum: ['income', 'expense', 'transfer'],
    required: true,
  },
  category: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true })

transactionSchema.index({ user: 1, date: -1 })

module.exports = mongoose.model('Transaction', transactionSchema)
