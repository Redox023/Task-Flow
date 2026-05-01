import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { Button, Input } from '../components/ui'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setIsLoading(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate('/projects')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Incorrect email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="anim-rise">
      <h2 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 26, fontWeight: 700,
        letterSpacing: '-0.02em', marginBottom: 6,
      }}>
        Sign in
      </h2>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 28 }}>
        Good to have you back.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          autoComplete="current-password"
        />
        <Button type="submit" isLoading={isLoading} size="lg" style={{ width: '100%', marginTop: 4 }}>
          Sign in
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-dim)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--gold)', fontWeight: 500, textDecoration: 'none' }}>
          Create one
        </Link>
      </p>


      <div style={{
        marginTop: 28,
        padding: '12px 16px',
        background: 'var(--raised)',
        border: '1px solid var(--border)',
        borderRadius: 10,
      }}>
        <p style={{ fontSize: 11, color: 'var(--text-soft)', marginBottom: 4, fontWeight: 500 }}>
          Demo credentials
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'monospace' }}>
          alice@teamflow.dev / password123
        </p>
      </div>
    </div>
  )
}
