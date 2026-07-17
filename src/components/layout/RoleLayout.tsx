import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Circle,
  CloudCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import {
  DEMO_ACCOUNTS,
  ROLE_LABELS,
  type NavItem,
  type UserRole,
} from '../../types'
import { Button } from '../ui/Button'
import { DeveloperCredit } from '../ui/DeveloperCredit'
import { RoleQuickAccess } from '../ui/RoleQuickAccess'

const ROLE_HEADER_TONES: Record<UserRole, string> = {
  'super-admin': 'from-navy-950 via-navy-900 to-slate-900',
  'disaster-coordinator': 'from-navy-950 via-teal-950 to-navy-900',
  volunteer: 'from-navy-950 via-sky-950 to-navy-900',
  'logistics-officer': 'from-navy-950 via-amber-950 to-navy-900',
}

export function RoleHeader({
  role,
  basePath,
  onOpenMobile,
  onToggleDesktop,
  sidebarCollapsed,
}: {
  role: UserRole
  basePath: string
  onOpenMobile: () => void
  onToggleDesktop: () => void
  sidebarCollapsed: boolean
}) {
  const { user, logout } = useAuth()
  const { flash, clearFlash, lastSavedAt } = useData()
  const navigate = useNavigate()

  const savedLabel = (() => {
    if (!lastSavedAt) return 'Auto-saved'
    const seconds = Math.max(0, Math.floor((Date.now() - lastSavedAt) / 1000))
    if (seconds < 5) return 'Saved just now'
    if (seconds < 60) return `Saved ${seconds}s ago`
    return 'Auto-saved'
  })()

  return (
    <header
      className={`sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r text-white shadow-xl backdrop-blur-md ${ROLE_HEADER_TONES[role]}`}
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-3 py-3 sm:px-4 sm:py-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-200 hover:bg-white/10 hover:text-white lg:hidden"
              onClick={onOpenMobile}
              aria-label="Open navigation sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-slate-200 hover:bg-white/10 hover:text-white lg:inline-flex"
              onClick={onToggleDesktop}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-deep to-teal-600 shadow-md sm:h-10 sm:w-10">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-xs font-bold tracking-wide sm:text-sm">
                DVMS
                <span className="hidden sm:inline">
                  {' '}
                  · Disaster Volunteer Management
                </span>
              </p>
              <p className="truncate text-[11px] text-slate-300 sm:text-xs">
                {ROLE_LABELS[role]}
                {user ? ` · ${user.name}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className="hidden items-center gap-1.5 rounded-lg border border-emerald-300/15 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-bold text-emerald-100 md:inline-flex"
              title="All changes are written to this browser immediately, so redirects and refreshes keep your data"
            >
              <CloudCheck className="h-3.5 w-3.5" />
              {savedLabel}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-slate-200 hover:bg-white/10 hover:text-white sm:inline-flex"
              onClick={() => navigate(basePath)}
            >
              Dashboard
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden min-[400px]:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {flash ? (
        <div
          role="status"
          aria-live="polite"
          className="border-t border-teal-500/30 bg-teal-deep px-3 py-2 text-center text-xs font-semibold text-white sm:text-sm"
        >
          <button type="button" onClick={clearFlash} className="w-full">
            {flash}
          </button>
        </div>
      ) : null}
    </header>
  )
}

function RoleSidebar({
  role,
  basePath,
  navItems,
  collapsed = false,
  mobile = false,
  onClose,
}: {
  role: UserRole
  basePath: string
  navItems: NavItem[]
  collapsed?: boolean
  mobile?: boolean
  onClose?: () => void
}) {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const switchRole = (nextRole: UserRole) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === nextRole)
    if (!account) return
    logout()
    const result = login(account.email, account.password)
    if (result.ok && result.role) {
      navigate(`/${result.role}`)
      onClose?.()
    }
  }

  return (
    <aside
      className={`flex h-full min-h-0 flex-col border-r border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl transition-[width] duration-200 ${
        mobile ? 'w-[min(86vw,19rem)]' : collapsed ? 'w-20' : 'w-[17rem]'
      }`}
      aria-label={`${ROLE_LABELS[role]} sidebar`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 p-3.5">
        <div className={`min-w-0 ${collapsed && !mobile ? 'mx-auto' : ''}`}>
          <p className="truncate text-[10px] font-bold uppercase tracking-wider text-steel">
            {collapsed && !mobile ? 'Menu' : ROLE_LABELS[role]}
          </p>
          {(!collapsed || mobile) && (
            <p className="mt-0.5 truncate text-xs font-semibold text-navy-900">
              {user?.name ?? 'Role navigation'}
            </p>
          )}
        </div>
        {mobile && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close navigation sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav
        className="nav-scroll min-h-0 flex-1 space-y-1 overflow-y-auto p-2.5"
        aria-label={`${ROLE_LABELS[role]} features`}
      >
        {navItems.map((item) => {
          const isDashboard = item.path === ''
          const Icon = isDashboard ? LayoutDashboard : Circle
          const target = isDashboard ? basePath : `${basePath}/${item.path}`
          return (
            <NavLink
              key={item.path}
              to={target}
              end={isDashboard}
              onClick={mobile ? onClose : undefined}
              title={collapsed && !mobile ? item.label : undefined}
              className={({ isActive }) =>
                `group flex min-h-11 items-center rounded-xl text-sm font-semibold transition ${
                  collapsed && !mobile
                    ? 'justify-center px-2'
                    : 'justify-between gap-3 px-3'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-deep to-teal-700 text-white shadow-md'
                    : 'text-navy-800 hover:bg-slate-soft hover:text-navy-950'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon
                      className={`shrink-0 ${
                        isDashboard ? 'h-4.5 w-4.5' : 'h-2.5 w-2.5'
                      } ${isActive ? 'fill-white/30' : 'fill-teal-100 text-teal-deep'}`}
                    />
                    {(!collapsed || mobile) && <span className="truncate">{item.label}</span>}
                  </span>
                  {(!collapsed || mobile) && (
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isActive ? 'translate-x-0.5' : 'text-slate-400'
                      }`}
                    />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {(!collapsed || mobile) && (
        <div className="border-t border-slate-200/80 p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-steel">
            Switch role
          </p>
          <RoleQuickAccess compact currentRole={role} onSelect={switchRole} />
        </div>
      )}
      <div className="border-t border-slate-200/80 p-2.5">
        <DeveloperCredit compact={collapsed && !mobile} />
      </div>
    </aside>
  )
}

export function RoleLayout({
  role,
  basePath,
  navItems,
}: {
  role: UserRole
  basePath: string
  navItems: NavItem[]
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('dvms_sidebar_collapsed') === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(
        'dvms_sidebar_collapsed',
        sidebarCollapsed ? '1' : '0',
      )
    } catch {
      // Ignore storage failures.
    }
  }, [sidebarCollapsed])

  return (
    <div className="relative min-h-screen overflow-x-clip" data-role={role}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-28 top-24 h-72 w-72 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-teal-200/20 blur-3xl" />
      </div>
      <RoleHeader
        role={role}
        basePath={basePath}
        onOpenMobile={() => setMobileOpen(true)}
        onToggleDesktop={() => setSidebarCollapsed((value) => !value)}
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="mx-auto flex max-w-[1600px] items-start">
        <div
          className={`sticky top-[68px] hidden h-[calc(100dvh-68px)] shrink-0 lg:block ${
            sidebarCollapsed ? 'w-20' : 'w-[17rem]'
          }`}
        >
          <RoleSidebar
            role={role}
            basePath={basePath}
            navItems={navItems}
            collapsed={sidebarCollapsed}
          />
        </div>
        <main className="relative min-w-0 flex-1 px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-7">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation sidebar"
          />
          <div className="animate-sidebar-in absolute inset-y-0 left-0">
            <RoleSidebar
              role={role}
              basePath={basePath}
              navItems={navItems}
              mobile
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
