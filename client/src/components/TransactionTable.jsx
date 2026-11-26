const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Math.abs(Number(value) || 0))
const TransactionTable = ({ transactions = [], compact = false, onDelete }) => (
  <div className="table-wrap"><table className="transaction-table"><thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Amount</th>{onDelete && <th>Action</th>}</tr></thead>
    <tbody>{transactions.map((item) => { const id = item._id || item.id; const income = item.type === 'income'; return <tr key={id}><td>{item.title}</td><td>{item.category}</td><td>{new Date(item.date).toLocaleDateString('en-IN')}</td><td className={`amount ${income ? 'positive' : 'negative'}`}>{income ? '+' : '−'}{money(item.amount)}</td>{onDelete && <td><button type="button" className="text-button" onClick={() => onDelete(id)}>Delete</button></td>}</tr> })}
    {transactions.length === 0 && <tr><td colSpan={onDelete ? 5 : 4} className="empty-state">No transactions yet. Add your first transaction.</td></tr>}</tbody>
  </table></div>
)
export default TransactionTable
