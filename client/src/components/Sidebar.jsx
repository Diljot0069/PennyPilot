import { NavLink } from 'react-router-dom'

const menuItems = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Budgets', to: '/budgets' },
  { label: 'Reports', to: '/reports' },
  { label: 'Categories', to: '/categories' },
  { label: 'Settings', to: '/settings' },
]

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-brand">
      <span className="sidebar-brand-mark">P.</span>
      <div><strong>PennyPilot</strong><small>PERSONAL FINANCE</small></div>
    </div>
    <div className="sidebar-title">Workspace</div>
    <nav className="sidebar-nav" aria-label="Main navigation">
      {menuItems.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'} className={({ isActive }) => (isActive ? 'active' : '')}>
          {item.label}
        </NavLink>
      ))}
    </nav>
    <div className="sidebar-bottom">A clearer view of your money.<br />Built for better financial habits.</div>
  </aside>
)

export default Sidebar
