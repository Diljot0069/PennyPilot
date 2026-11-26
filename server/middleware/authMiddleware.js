const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required.' })
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const userId = decoded.userId || decoded.id || decoded._id

    if (!userId) {
      return res.status(401).json({ message: 'Invalid authentication token.' })
    }

    req.user = { ...decoded, userId }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

module.exports = authMiddleware
