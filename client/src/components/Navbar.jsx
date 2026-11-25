import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const initials = user?.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  const handleLogout = () => {
    localStorage.removeItem('pennypilot-token')
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="brand-block">
        <span className="brand-mark">P</span>
        <div>
          <strong>PennyPilot</strong>
          <small>Smart finance tracker</small>
        </div>
      </div>

      <nav className="top-nav">
        <NavLink to="/dashboard">Overview</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/budgets">Budgets</NavLink>
      </nav>

      <div className="profile-actions">
        <div className="profile-pill">
          <span className="avatar">{initials || 'DS'}</span>
          <div>
            <strong>{user?.name || 'Diljot Singh'}</strong>
            <small>Premium</small>
          </div>
        </div>
        <button type="button" className="secondary-button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  )
}

export default Navbar
