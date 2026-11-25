const Categories = ({ categories = [] }) => {
  return (
    <div className="page-section">
      <header className="page-header">
        <div>
          <span className="eyebrow">Grouping</span>
          <h1>Categories</h1>
        </div>
        <button className="primary-button">Add category</button>
      </header>

      <div className="panel">
        <div className="panel-header">
          <h3>Category breakdown</h3>
        </div>
        <div className="category-list">
          {categories.map((category) => (
            <div key={category.name} className="category-item">
              <div className="category-meta">
                <span className="category-dot" style={{ backgroundColor: category.color }} />
                <span>{category.name}</span>
              </div>
              <strong>${category.amount.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categories
