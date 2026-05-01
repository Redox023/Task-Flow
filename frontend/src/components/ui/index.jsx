import { Loader2 } from 'lucide-react'
export { TeamFlowLogo } from './Logo'

export function Button({ children, variant = 'primary', size = 'md', isLoading, className = '', ...props }) {
  const cls = [
    'btn',
    variant === 'primary'   ? 'btn-primary'   : '',
    variant === 'secondary' ? 'btn-secondary'  : '',
    variant === 'danger'    ? 'btn-danger'     : '',
    variant === 'ghost'     ? 'btn-ghost'      : '',
    size === 'sm' ? 'btn-sm' : '',
    size === 'lg' ? 'btn-lg' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button className={cls} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  )
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-dim)', letterSpacing: '0.03em' }}>
          {label}
        </label>
      )}
      <input className={`field ${error ? 'field-error' : ''} ${className}`} {...props} />
      {error && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 2 }}>{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-dim)', letterSpacing: '0.03em' }}>
          {label}
        </label>
      )}
      <textarea
        className={`field ${error ? 'field-error' : ''} ${className}`}
        style={{ resize: 'none' }}
        {...props}
      />
      {error && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 2 }}>{error}</p>}
    </div>
  )
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-dim)', letterSpacing: '0.03em' }}>
          {label}
        </label>
      )}
      <select className={`field ${className}`} {...props}>
        {children}
      </select>
      {error && <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 2 }}>{error}</p>}
    </div>
  )
}

export function Badge({ children, variant = 'default', className = '' }) {
  const map = {
    default:     'chip-member',
    todo:        'chip-todo',
    'in-progress': 'chip-inprogress',
    done:        'chip-done',
    high:        'chip-high',
    medium:      'chip-medium',
    low:         'chip-low',
    admin:       'chip-admin',
    member:      'chip-member',
  }
  return (
    <span
      className={`${map[variant] || 'chip-member'} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 9px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </span>
  )
}

export function Card({ children, className = '', style, ...props }) {
  return (
    <div className={`card ${className}`} style={style} {...props}>
      {children}
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children, width = 480 }) {
  if (!isOpen) return null
  return (
    <div className="overlay anim-appear" onClick={onClose}>
      <div
        className="card anim-pop"
        style={{ width: '100%', maxWidth: width, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: 16, fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 7, border: 'none',
              background: 'var(--raised)', color: 'var(--text-dim)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Spinner({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin" style={{ color: 'var(--gold)' }} />
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '64px 24px', textAlign: 'center',
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, background: 'var(--raised)',
        border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: 16,
      }}>
        <Icon size={22} style={{ color: 'var(--text-soft)' }} />
      </div>
      <h3 style={{ fontSize: 16, fontFamily: "'Outfit', sans-serif", fontWeight: 600, marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-dim)', maxWidth: 320, lineHeight: 1.6, marginBottom: 24 }}>{description}</p>
      {action}
    </div>
  )
}

export function Avatar({ name = '?', size = 'md' }) {
  const dim = { sm: 24, md: 32, lg: 40 }[size]
  const fs  = { sm: 10, md: 13, lg: 16 }[size]
  const palettes = [
    ['#e8a23a', '#1a1000'],
    ['#34c98a', '#001a10'],
    ['#e8604a', '#1a0800'],
    ['#7c9ef5', '#080d1a'],
    ['#c87af5', '#100a1a'],
  ]
  const idx = (name?.charCodeAt(0) || 0) % palettes.length
  const [bg, fg] = palettes[idx]

  return (
    <div
      title={name}
      style={{
        width: dim, height: dim, borderRadius: '50%', flexShrink: 0,
        background: `${bg}25`, border: `1.5px solid ${bg}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: fs, fontWeight: 700, color: bg, userSelect: 'none',
      }}
    >
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  )
}
