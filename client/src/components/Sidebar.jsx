import { NavLink } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Budgets', to: '/budgets' },
  { label: 'Reports', to: '/reports' },
  { label: 'Categories', to: '/categories' },
  { label: 'Settings', to: '/settings' },
]

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <span className="eyebrow">Workspace</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
