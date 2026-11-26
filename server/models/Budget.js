const mongoose = require('mongoose')
const budgetSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  limit: { type: Number, required: true, min: 0.01 },
  month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
  color: { type: String, default: '#34d399' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true })
module.exports = mongoose.model('Budget', budgetSchema)
