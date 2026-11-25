const sendBudgetAlert = async (email, message) => ({
  email,
  message,
  sent: true,
})

module.exports = { sendBudgetAlert }
