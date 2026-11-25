const exportCSV = async (records) => ({
  rows: records.length,
  file: 'pennypilot-export.csv',
})

module.exports = { exportCSV }
