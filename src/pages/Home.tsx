import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  MapPinned,
  Menu,
  Radio,
  Shield,
  Truck,
  UserCheck,
  Users,
  Warehouse,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { DeveloperCredit } from '../components/ui/DeveloperCredit'
import { ROLE_LABELS, ROLE_META, type UserRole } from '../types'

const roleIcons: Record<UserRole, LucideIcon> = {
  'super-admin': Shield,
  'disaster-coordinator': ClipboardCheck,
  volunteer: Users,
  'logistics-officer': Boxes,
}

const roleFeatures: Record<UserRole, string[]> = {
  'super-admin': ['Manage users and roles', 'System settings and audit logs', 'Reports, backup and recovery'],
  'disaster-coordinator': ['Create response operations', 'Approve and deploy volunteers', 'Manage centers and shifts'],
  volunteer: ['Apply for response missions', 'Complete tasks and attendance', 'Receive emergency alerts'],
  'logistics-officer': ['Control relief inventory', 'Track equipment and vehicles', 'Coordinate supply deliveries'],
}

const flow = [
  {
    icon: Radio,
    title: 'Register the incident',
    text: 'A coordinator records the disaster, location, severity, and creates an active response operation.',
  },
  {
    icon: UserCheck,
    title: 'Approve volunteers',
    text: 'New volunteer registrations are reviewed, approved, and matched using skills and availability.',
  },
  {
    icon: MapPinned,
    title: 'Assign missions and shifts',
    text: 'Volunteers receive tasks, deployment locations, evacuation center assignments, and shift schedules.',
  },
  {
    icon: CheckCircle2,
    title: 'Deploy and track attendance',
    text: 'Teams check in and out while coordinators monitor deployment and task completion in real time.',
  },
  {
    icon: Truck,
    title: 'Move relief supplies',
    text: 'Logistics allocates stock, dispatches vehicles, records donations, and follows each delivery.',
  },
  {
    icon: BarChart3,
    title: 'Report and improve',
    text: 'Activity, participation, operation, donation, and logistics data become actionable reports.',
  },
]

const capabilities: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Users, title: 'Volunteer management', text: 'Profiles, skills, certifications, availability, service history, and emergency contacts.' },
  { icon: MapPinned, title: 'Response operations', text: 'Incidents, missions, deployments, operation status, evacuation centers, and relief activities.' },
  { icon: ClipboardCheck, title: 'Tasks and shifts', text: 'Assignments, shift scheduling, attendance, completion monitoring, and shift history.' },
  { icon: Warehouse, title: 'Relief and logistics', text: 'Inventory, equipment, vehicles, donations, distribution, warehouses, and deliveries.' },
  { icon: BellRing, title: 'Alerts and communication', text: 'Emergency alerts, deployment notices, reminders, and operation announcements.' },
  { icon: FileText, title: 'Reports and analytics', text: 'Participation, response, logistics, donations, task completion, and dashboard insights.' },
]

function PublicLink({
  to,
  children,
  tone = 'primary',
  className = '',
}: {
  to: string
  children: ReactNode
  tone?: 'primary' | 'light' | 'ghost'
  className?: string
}) {
  const tones = {
    primary: 'bg-teal-deep text-white shadow-lg shadow-teal-950/20 hover:bg-teal-700',
    light: 'border border-slate-200 bg-white text-navy-900 shadow-sm hover:border-teal-300 hover:bg-teal-50',
    ghost: 'text-slate-200 hover:bg-white/10 hover:text-white',
  }
  return (
    <Link
      to={to}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 active:scale-[0.98] ${tones[tone]} ${className}`}
    >
      {children}
    </Link>
  )
}

export function Home() {
  const { user } = useAuth()
  const { operations, centers, tasks, deliveries, volunteerProfiles } = useData()
  const [menuOpen, setMenuOpen] = useState(false)
  const dashboardPath = user ? `/${user.role}` : '/login'
  const activeOperation =
    operations.find((operation) => operation.status === 'active') ?? operations[0]
  const totalCapacity = centers.reduce((sum, center) => sum + center.capacity, 0)
  const totalOccupancy = centers.reduce((sum, center) => sum + center.occupancy, 0)
  const occupancyRate = totalCapacity
    ? Math.min(Math.round((totalOccupancy / totalCapacity) * 100), 100)
    : 0

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f7fafc] text-navy-900">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/95 text-white shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-deep shadow-lg">
              <Shield className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-bold sm:text-base">DVMS</span>
              <span className="hidden text-[11px] text-slate-300 sm:block">
                Disaster Volunteer Management System
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Public navigation">
            <a href="#flow" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">How it works</a>
            <a href="#roles" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">Roles</a>
            <a href="#features" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">Features</a>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <PublicLink to={dashboardPath} tone="primary">Open dashboard <ArrowRight className="h-4 w-4" /></PublicLink>
            ) : (
              <>
                <PublicLink to="/login" tone="ghost">Sign in</PublicLink>
                <PublicLink to="/register" tone="primary">Join as volunteer</PublicLink>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-200 transition hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle public navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="animate-fade-up border-t border-white/10 px-4 py-3 md:hidden">
            <nav className="mx-auto grid max-w-7xl gap-1" aria-label="Mobile public navigation">
              {[
                ['How it works', '#flow'],
                ['Roles', '#roles'],
                ['Features', '#features'],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
                >
                  {label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <PublicLink to={dashboardPath} tone="ghost">
                  {user ? 'Dashboard' : 'Sign in'}
                </PublicLink>
                {!user && <PublicLink to="/register">Register</PublicLink>}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden bg-navy-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,#0f766e66,transparent_34%),radial-gradient(circle_at_85%_80%,#0369a155,transparent_38%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
            <div className="animate-fade-up">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-bold text-teal-100">
                <HeartHandshake className="h-4 w-4" />
                One coordinated response platform
              </div>
              <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Better coordination when every minute matters.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Organize volunteers, disaster operations, evacuation centers, relief supplies,
                deployments, and reports from preparedness through rehabilitation.
              </p>
              <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
                <PublicLink to={user ? dashboardPath : '/register'} className="min-[420px]:min-w-44">
                  {user ? 'Open my dashboard' : 'Become a volunteer'}
                  <ArrowRight className="h-4 w-4" />
                </PublicLink>
                <PublicLink to="/login" tone="ghost" className="border border-white/15 bg-white/5">
                  Explore role dashboards
                </PublicLink>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['4', 'System roles'],
                  [String(operations.length), 'Operations'],
                  [String(volunteerProfiles.length), 'Volunteers'],
                  ['24/7', 'Response ready'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                    <p className="font-display text-xl font-bold text-white">{value}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fade-up-delay-1 relative">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-teal-200">Live response overview</p>
                    <p className="mt-1 font-display text-lg font-bold">
                      {activeOperation?.title ?? 'Response overview'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-bold text-emerald-200">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    [String(activeOperation?.volunteersAssigned ?? 0), 'Volunteers deployed'],
                    [String(centers.filter((center) => center.status === 'open').length), 'Open evacuation centers'],
                    [String(tasks.filter((task) => task.status === 'in-progress').length), 'Tasks in progress'],
                    [String(deliveries.filter((delivery) => delivery.status === 'in-transit').length), 'Deliveries en route'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-navy-950/35 p-4">
                      <p className="font-display text-2xl font-bold">{value}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-2xl border border-white/10 bg-navy-950/35 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Center occupancy</span>
                    <span className="text-teal-200">
                      {totalOccupancy} / {totalCapacity}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-400 transition-[width] duration-700"
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                  <p className="mt-2 text-right text-[10px] font-bold text-slate-400">
                    {occupancyRate}% utilized · live browser data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="flow" className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-deep">System flow</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">From incident to recovery, everyone stays connected.</h2>
              <p className="mt-4 text-sm leading-relaxed text-steel sm:text-base">
                Each role has a focused dashboard, while every action contributes to one coordinated response record.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flow.map((step, index) => {
                const Icon = step.icon
                return (
                  <article key={step.title} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
                    <span className="absolute right-4 top-3 font-display text-5xl font-bold text-slate-100">{String(index + 1).padStart(2, '0')}</span>
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-teal-soft text-teal-deep">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="relative mt-5 font-display text-lg font-bold">{step.title}</h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-steel">{step.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="roles" className="scroll-mt-24 bg-navy-950 px-4 py-14 text-white sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Four connected roles</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">The right tools for every response team.</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">Role-based access keeps each workspace focused, clear, and secure.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {(Object.keys(ROLE_META) as UserRole[]).map((role) => {
                const Icon = roleIcons[role]
                return (
                  <article key={role} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-teal-300/30 hover:bg-white/10">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${ROLE_META[role].accent}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold">{ROLE_LABELS[role]}</h3>
                    <p className="mt-2 min-h-10 text-xs leading-relaxed text-slate-400">{ROLE_META[role].blurb}</p>
                    <ul className="mt-4 space-y-2">
                      {roleFeatures[role].map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs leading-relaxed text-slate-300">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-300" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to="/login" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-teal-200 hover:underline">
                      View role access <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-deep">Complete capabilities</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Everything needed to coordinate relief.</h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((capability) => {
                const Icon = capability.icon
                return (
                  <article key={capability.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-soft text-teal-deep">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display font-bold">{capability.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-steel">{capability.text}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-deep to-navy-900 p-6 text-white shadow-xl sm:p-8 lg:flex-row lg:items-center lg:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100">Ready to help?</p>
              <h2 className="mt-2 max-w-2xl font-display text-2xl font-bold sm:text-3xl">Join the response network or access your assigned dashboard.</h2>
            </div>
            <div className="flex w-full flex-col gap-2 min-[420px]:w-auto min-[420px]:flex-row">
              <PublicLink to="/register" tone="light">Create account</PublicLink>
              <PublicLink to="/login" tone="ghost" className="border border-white/20">Sign in</PublicLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto grid max-w-7xl items-center gap-4 text-xs text-steel md:grid-cols-[1fr_auto_1fr]">
          <p className="text-center md:text-left">
            © 2026 Disaster Volunteer Management System
          </p>
          <DeveloperCredit className="mx-auto w-full max-w-xs" />
          <p className="text-center md:text-right">
            Preparedness · Response · Recovery · Rehabilitation
          </p>
        </div>
      </footer>
    </div>
  )
}
