import BudgetCard from '../components/BudgetCard'

const Budgets = ({ budgets = [] }) => {
  return (
    <div className="page-section">
      <header className="page-header">
        <div>
          <span className="eyebrow">Planning</span>
          <h1>Budgets</h1>
        </div>
        <button className="primary-button">New budget</button>
      </header>

      <div className="budget-grid">
        {budgets.map((budget) => (
          <BudgetCard key={budget.category} {...budget} />
        ))}
      </div>
    </div>
  )
}

export default Budgets
