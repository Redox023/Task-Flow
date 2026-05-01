import { Outlet } from 'react-router-dom'
import { TeamFlowLogo } from '../ui'

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg)',
    }}>

      <div style={{
        display: 'none',
        width: '42%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }} className="lg-panel">

        <div style={{
          position: 'absolute', top: -120, left: -120,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,162,58,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, right: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,201,138,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />


        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 56 }}>
            <TeamFlowLogo size={34} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
              Team Flow
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 40, fontWeight: 700,
            lineHeight: 1.15, letterSpacing: '-0.025em',
            marginBottom: 18,
          }}>
            Keep your team<br />
            <span style={{ color: 'var(--gold)' }}>on the same page.</span>
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15, lineHeight: 1.7, maxWidth: 340 }}>
            Projects, tasks, and deadlines — all in one place. Built for small teams who want clarity without complexity.
          </p>
        </div>


        <div style={{ position: 'relative' }}>
          {[
            { icon: '📋', text: 'Visual kanban boards per project' },
            { icon: '👥', text: 'Role-based access for admins & members' },
            { icon: '📊', text: 'Live dashboard with overdue tracking' },
          ].map(item => (
            <div key={item.text} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>


      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}
               className="mobile-logo">
            <TeamFlowLogo size={30} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17 }}>
              Team Flow
            </span>
          </div>

          <Outlet />
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .lg-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  )
}
