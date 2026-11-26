import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { clearSession } from '../services/authService'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const initials = user?.name?.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('')
  const handleLogout = () => {
    clearSession()
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      <div className="topbar-context">
        <span className="eyebrow">PERSONAL WORKSPACE</span>
      </div>
      <div className="profile-actions">
        <div className="profile-pill">
          <span className="avatar">{initials || 'PP'}</span>
          <div><strong>{user?.name || 'Account'}</strong><small>{user?.email || ''}</small></div>
        </div>
        <button type="button" className="secondary-button" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  )
}

export default Navbar
