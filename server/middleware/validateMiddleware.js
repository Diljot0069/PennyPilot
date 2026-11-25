const validateMiddleware = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.json({ message: 'Request body is required' })
  }

  next()
}

module.exports = validateMiddleware
