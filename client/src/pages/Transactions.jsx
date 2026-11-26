import TransactionForm from '../components/TransactionForm'
import TransactionTable from '../components/TransactionTable'
const Transactions = ({ transactions = [], categories = [], onAddTransaction, onDeleteTransaction }) => (
  <div className="page-section">
    <header className="page-header"><div><span className="eyebrow">Money movement</span><h1>Transactions</h1><p>Every entry is saved to your account.</p></div></header>
    <div className="content-grid">
      <div className="panel"><div className="panel-header"><h3>Add transaction</h3></div><TransactionForm categories={categories} onAddTransaction={onAddTransaction} /></div>
      <div className="panel"><div className="panel-header"><h3>Transaction history</h3><span>{transactions.length} records</span></div><TransactionTable transactions={transactions} onDelete={onDeleteTransaction} /></div>
    </div>
  </div>
)
export default Transactions
