const getCategories = async (req, res) => {
  res.status(200).json({ categories: [] })
}

module.exports = { getCategories }
