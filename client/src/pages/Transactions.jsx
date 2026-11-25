import TransactionForm from '../components/TransactionForm'
import TransactionTable from '../components/TransactionTable'

const Transactions = ({ transactions = [], categories = [], onAddTransaction }) => {
  return (
    <div className="page-section">
      <header className="page-header">
        <div>
          <span className="eyebrow">Money movement</span>
          <h1>Transactions</h1>
        </div>
      </header>

      <div className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Add transaction</h3>
          </div>
          <TransactionForm categories={categories} onAddTransaction={onAddTransaction} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Latest records</h3>
          </div>
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </div>
  )
}

export default Transactions
