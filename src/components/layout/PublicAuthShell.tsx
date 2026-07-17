import type { ReactNode } from 'react'
import { ArrowLeft, HeartHandshake, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DeveloperCredit } from '../ui/DeveloperCredit'

export function PublicAuthShell({
  mode,
  eyebrow,
  title,
  description,
  aside,
  children,
}: {
  mode: 'login' | 'register'
  eyebrow: string
  title: string
  description: string
  aside: ReactNode
  children: ReactNode
}) {
  const alternate =
    mode === 'login'
      ? { label: 'New volunteer?', action: 'Create account', to: '/register' }
      : { label: 'Already registered?', action: 'Sign in', to: '/login' }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-navy-950 px-3 pb-6 pt-20 text-navy-900 sm:px-5 sm:pb-10 sm:pt-24 lg:flex lg:items-center lg:py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,#0f766e66,transparent_30%),radial-gradient(circle_at_88%_82%,#0369a166,transparent_35%),linear-gradient(135deg,#0b1c2c_0%,#102a43_52%,#071827_100%)]"
        aria-hidden="true"
      />
      <div
        className="public-grid pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-[8%] top-[18%] h-2 w-2 animate-pulse rounded-full bg-teal-300 shadow-[0_0_24px_8px_rgba(45,212,191,0.3)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[18%] right-[12%] h-2 w-2 animate-pulse rounded-full bg-sky-300 shadow-[0_0_24px_8px_rgba(56,189,248,0.3)]"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-navy-950/55 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:px-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden min-[360px]:inline">Back to public home</span>
            <span className="min-[360px]:hidden">Home</span>
          </Link>
          <Link to="/" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-sky-600 text-white shadow-lg">
              <HeartHandshake className="h-4 w-4" />
            </span>
            <span className="hidden font-display text-sm font-bold text-white sm:block">
              DVMS
            </span>
          </Link>
          <p className="text-right text-[10px] text-slate-400 sm:text-xs">
            <span className="hidden sm:inline">{alternate.label} </span>
            <Link className="font-bold text-teal-200 hover:text-white" to={alternate.to}>
              {alternate.action}
            </Link>
          </p>
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/95 shadow-[0_32px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:grid-cols-[1.04fr_0.96fr]">
        <aside className="relative order-2 overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-teal-950 p-5 text-white sm:p-8 lg:order-1 lg:p-10">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/15 bg-teal-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure role-based access
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-300">
              {eyebrow}
            </p>
            <h1 className="mt-2 max-w-lg font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-[2.25rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
              {description}
            </p>
            <div className="mt-7">{aside}</div>
          </div>
        </aside>

        <main className="animate-fade-up order-1 p-5 sm:p-8 lg:order-2 lg:p-10">
          {children}
          <DeveloperCredit className="mt-6" />
        </main>
      </div>
    </div>
  )
}
