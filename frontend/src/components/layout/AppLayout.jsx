import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, LogOut } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import { Avatar, TeamFlowLogo } from '../ui'

const navItem = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '9px 12px',
  borderRadius: 9,
  fontSize: 13,
  fontWeight: 500,
  textDecoration: 'none',
  transition: 'all 0.12s',
  color: isActive ? 'var(--text)' : 'var(--text-dim)',
  background: isActive ? 'var(--raised)' : 'transparent',
  border: isActive ? '1px solid var(--border)' : '1px solid transparent',
})

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <aside style={{
        width: 220,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}>
        <div style={{
          padding: '20px 18px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
        }}>
          <TeamFlowLogo size={28} />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '-0.015em' }}>
            Team Flow
          </span>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <NavLink to="/projects" style={({ isActive }) => navItem(isActive)}>
            <FolderOpen size={15} />
            Projects
          </NavLink>
          <NavLink to="/dashboard" style={({ isActive }) => navItem(isActive)}>
            <LayoutDashboard size={15} />
            Dashboard
          </NavLink>
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px', marginBottom: 4,
          }}>
            <Avatar name={user?.fullName} size="sm" />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: 8, border: 'none',
              background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer',
              fontSize: 13, fontFamily: 'inherit', transition: 'all 0.12s',
            }}
            onMouseOver={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(232,96,74,0.08)' }}
            onMouseOut={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
