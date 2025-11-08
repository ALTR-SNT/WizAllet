import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../hooks/useUser'

const SideBar = () => {
  const { userId, isAuthenticated, logout } = useAuth()
  const { data: user } = useUser(userId!)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return (
      <aside>
        <h1>Wiz<span>Allet</span></h1>
        <div>
          <p>Please log in</p>
          <button onClick={() => navigate('/login')}>Log In</button>
        </div>
      </aside>
    )
  }

  return (
    <aside>
      <h1>Wiz<span>Allet</span></h1>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : undefined}>
          Dashboard
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : undefined}>
          History
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : undefined}>
          Settings
        </NavLink>
      </nav>
      <div>
        <p>Hello {user?.username || 'there'}</p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </aside>
  )
}

export default SideBar