export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9, background: 'var(--gold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, color: '#1a1000',
      }}>
        ⚡
      </div>
      <div style={{
        width: 24, height: 2, borderRadius: 2, background: 'var(--raised)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: '50%', background: 'var(--gold)',
          borderRadius: 2,
          animation: 'slideBar 1s ease-in-out infinite',
        }} />
      </div>
      <style>{`
        @keyframes slideBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}
