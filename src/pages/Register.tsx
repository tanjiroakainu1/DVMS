import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  ClipboardCheck,
  Eye,
  EyeOff,
  HeartHandshake,
  ShieldCheck,
  UserPlus,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  ROLE_LABELS,
  ROLE_META,
  type UserRole,
} from '../types'
import { Button } from '../components/ui/Button'
import { FieldInput, FieldLabel } from '../components/ui/FormField'
import { PublicAuthShell } from '../components/layout/PublicAuthShell'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'volunteer' as UserRole,
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (form.password !== confirmPassword) {
      setError('Passwords do not match.')
      setMessage('')
      return
    }
    if (!acceptedTerms) {
      setError('Please confirm the registration declaration.')
      setMessage('')
      return
    }
    const result = register(form)
    if (!result.ok) {
      setError(result.message)
      setMessage('')
      return
    }
    setError('')
    setMessage(result.message)

    if (result.role) {
      window.setTimeout(() => navigate(`/${result.role}`), 600)
      return
    }
    window.setTimeout(() => navigate('/login'), 1200)
  }

  const selectRoleTemplate = (role: UserRole) => {
    setForm((current) => ({ ...current, role }))
    setError('')
    setMessage('')
  }

  const passwordStrength =
    form.password.length >= 10
      ? 'Strong'
      : form.password.length >= 6
        ? 'Good'
        : form.password.length
          ? 'Too short'
          : 'Enter at least 4 characters'

  return (
    <PublicAuthShell
      mode="register"
      eyebrow="Join the response network"
      title="Turn your readiness into coordinated action."
      description="Create your DVMS profile and connect with operations, missions, emergency alerts, attendance, and field reporting."
      aside={
        <div className="space-y-3">
          {[
            {
              icon: UserPlus,
              title: 'Create your identity',
              text: 'Choose your access role and provide verified contact details.',
            },
            {
              icon: ClipboardCheck,
              title: 'Complete role verification',
              text: 'Volunteer accounts are reviewed by a disaster coordinator.',
            },
            {
              icon: HeartHandshake,
              title: 'Join coordinated response',
              text: 'Receive missions, schedules, tasks, alerts, and service records.',
            },
          ].map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="group flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 transition hover:border-teal-300/30 hover:bg-white/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/30 to-sky-500/30 text-teal-100">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-teal-300">
                    Step {index + 1}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-white">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{step.text}</p>
                </div>
              </div>
            )
          })}
          <div className="flex items-start gap-2 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-relaxed text-amber-100">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            This client-only demonstration stores registration data in your
            current browser.
          </div>
        </div>
      }
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-800">
          <UserPlus className="h-3.5 w-3.5" />
          New registration
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
          Create your account
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-steel">
          Start by choosing the workspace that matches your responsibility.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {(Object.keys(ROLE_META) as UserRole[]).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => selectRoleTemplate(role)}
            className={`group relative overflow-hidden rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${
              form.role === role
                ? 'border-teal-deep bg-teal-soft/60 shadow-sm ring-2 ring-teal-deep/15'
                : 'border-slate-200 bg-slate-soft/45 hover:border-teal-deep/40 hover:bg-white'
            }`}
          >
            <span
              className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-white ${ROLE_META[role].accent}`}
            >
              {form.role === role ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <span className="text-[9px] font-black">{ROLE_META[role].short.slice(0, 1)}</span>
              )}
            </span>
            <span className="block text-xs font-bold text-navy-900 sm:text-sm">
              {ROLE_LABELS[role]}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-3.5">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="block">
            <FieldLabel>Full name</FieldLabel>
            <FieldInput
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoComplete="name"
              className="!min-h-12"
            />
          </label>
          <label className="block">
            <FieldLabel>Phone number</FieldLabel>
            <FieldInput
              type="tel"
              placeholder="09xxxxxxxxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              autoComplete="tel"
              className="!min-h-12"
            />
          </label>
        </div>
        <label className="block">
          <FieldLabel>Email address</FieldLabel>
          <FieldInput
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
            className="!min-h-12"
          />
        </label>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <label className="block">
            <div className="relative">
              <FieldLabel>Password</FieldLabel>
              <FieldInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 4 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={4}
                autoComplete="new-password"
                className="!min-h-12 !pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute bottom-0 right-0 flex h-12 w-11 items-center justify-center rounded-r-xl text-steel transition hover:bg-slate-soft"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <span
              className={`mt-1 block text-[10px] font-semibold ${
                passwordStrength === 'Strong'
                  ? 'text-teal-deep'
                  : passwordStrength === 'Too short'
                    ? 'text-alert'
                    : 'text-steel'
              }`}
            >
              Strength: {passwordStrength}
            </span>
          </label>
          <label className="block">
            <FieldLabel>Confirm password</FieldLabel>
            <FieldInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="!min-h-12"
            />
          </label>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-soft/50 p-3">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-teal-deep"
          />
          <span className="text-xs leading-relaxed text-steel">
            I confirm that the information is accurate and may be used for
            disaster-response coordination.
          </span>
        </label>

        {error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p role="status" className="rounded-xl border border-teal-200 bg-teal-soft/50 px-3 py-2.5 text-sm text-teal-deep">
            {message}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full !min-h-12">
          Create {ROLE_LABELS[form.role]} Account
        </Button>
      </form>

      <p className="mt-5 text-sm text-steel">
        Already have an account?{' '}
        <Link className="font-bold text-teal-deep hover:underline" to="/login">
          Sign in to your dashboard
        </Link>
      </p>
    </PublicAuthShell>
  )
}
