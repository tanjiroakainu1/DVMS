import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CheckCircle2, Eye, EyeOff, LockKeyhole, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  DEMO_ACCOUNTS,
  getDemoAccount,
  type UserRole,
} from '../types'
import { Button } from '../components/ui/Button'
import { FieldInput, FieldLabel } from '../components/ui/FormField'
import { RoleQuickAccess } from '../components/ui/RoleQuickAccess'
import { PublicAuthShell } from '../components/layout/PublicAuthShell'

function roleHome(role: UserRole) {
  return `/${role}`
}

export function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0].email)
  const [password, setPassword] = useState(DEMO_ACCOUNTS[0].password)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (user) {
    return <Navigate to={roleHome(user.role)} replace />
  }

  const enterRole = (role: UserRole) => {
    const account = getDemoAccount(role)
    setEmail(account.email)
    setPassword(account.password)
    setError('')
    setLoading(true)
    const result = login(account.email, account.password)
    setLoading(false)
    if (!result.ok || !result.role) {
      setError(result.message)
      return
    }
    navigate(roleHome(result.role))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = login(email, password)
    setLoading(false)
    if (!result.ok || !result.role) {
      setError(result.message)
      return
    }
    navigate(roleHome(result.role))
  }

  const fillAccount = (role: UserRole) => {
    const account = getDemoAccount(role)
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  return (
    <PublicAuthShell
      mode="login"
      eyebrow="Disaster response access"
      title="Your command center is one secure sign-in away."
      description="Enter your assigned workspace or explore the complete response workflow with one of the prepared demonstration accounts."
      aside={
        <div className="animate-fade-up-delay-1">
          <RoleQuickAccess
            tone="dark"
            title="Instant dashboard access"
            subtitle="Choose a role to securely load its prepared account and enter the matching workspace."
            onSelect={enterRole}
          />
        </div>
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-soft/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-teal-deep">
            <LockKeyhole className="h-3.5 w-3.5" />
            Protected access
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-steel">
            Sign in with your account credentials.
          </p>
        </div>
        <span className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 text-teal-deep sm:flex">
          <Zap className="h-5 w-5" />
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <FieldLabel>Email address</FieldLabel>
          <FieldInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@dvms.gov"
            required
            autoComplete="username"
            className="!min-h-12"
          />
        </label>
        <label className="block">
          <div className="relative">
            <FieldLabel>Password</FieldLabel>
            <FieldInput
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="!min-h-12 !pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-r-xl text-steel transition hover:bg-slate-soft hover:text-navy-900"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        {error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="w-full !min-h-12" disabled={loading}>
          {loading ? 'Opening dashboard…' : 'Open My Dashboard'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-steel">
          Demo credentials
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <Button
            key={account.email}
            type="button"
            variant="soft"
            size="sm"
            className="min-w-0 justify-start"
            onClick={() => fillAccount(account.role)}
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {account.role === 'super-admin'
                ? 'Admin'
                : account.role === 'disaster-coordinator'
                  ? 'Coordinator'
                  : account.role === 'logistics-officer'
                    ? 'Logistics'
                    : 'Volunteer'}
            </span>
          </Button>
        ))}
      </div>

      <p className="mt-6 text-sm text-steel">
        New to the response network?{' '}
        <Link className="font-bold text-teal-deep hover:underline" to="/register">
          Create your registration
        </Link>
      </p>
    </PublicAuthShell>
  )
}
