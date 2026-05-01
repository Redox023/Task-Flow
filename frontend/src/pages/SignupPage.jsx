import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { Button, Input } from '../components/ui'

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuthStore()
  const navigate = useNavigate()

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.fullName || form.fullName.length < 2) errs.fullName = 'Name must be at least 2 characters'
    if (!form.email) errs.email = 'Email is required'
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setIsLoading(true)
    try {
      await signup(form)
      toast.success('Account created!')
      navigate('/projects')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
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
        Create account
      </h2>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 28 }}>
        Start managing tasks with your team.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Jordan Blake"
          value={form.fullName}
          onChange={set('fullName')}
          error={errors.fullName}
          autoComplete="name"
        />
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
          placeholder="At least 6 characters"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          autoComplete="new-password"
        />
        <Button type="submit" isLoading={isLoading} size="lg" style={{ width: '100%', marginTop: 4 }}>
          Create account
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-dim)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 500, textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
