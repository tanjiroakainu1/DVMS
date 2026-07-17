import {
  Boxes,
  ClipboardCheck,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react'
import {
  DEMO_ACCOUNTS,
  ROLE_LABELS,
  ROLE_META,
  type UserRole,
} from '../../types'
import { Button } from './Button'

const ROLE_ICONS: Record<UserRole, LucideIcon> = {
  'super-admin': Shield,
  'disaster-coordinator': ClipboardCheck,
  volunteer: Users,
  'logistics-officer': Boxes,
}

export function RoleQuickAccess({
  onSelect,
  currentRole,
  compact = false,
  tone = 'light',
  title = 'Quick access — all roles',
  subtitle = 'One tap loads the inserted demo account and opens that role dashboard.',
}: {
  onSelect: (role: UserRole) => void
  currentRole?: UserRole
  compact?: boolean
  tone?: 'light' | 'dark'
  title?: string
  subtitle?: string
}) {
  const dark = tone === 'dark'

  return (
    <div className={compact ? '' : 'space-y-3'}>
      {!compact ? (
        <div>
          <p
            className={`text-[11px] font-bold uppercase tracking-wider ${
              dark ? 'text-teal-200' : 'text-steel'
            }`}
          >
            {title}
          </p>
          {subtitle ? (
            <p
              className={`mt-1 text-xs leading-relaxed sm:text-sm ${
                dark ? 'text-slate-300' : 'text-steel/90'
              }`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className={
          compact
            ? 'nav-scroll flex gap-2 overflow-x-auto pb-1'
            : 'grid grid-cols-1 gap-3 min-[420px]:grid-cols-2'
        }
      >
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = ROLE_ICONS[account.role]
          const meta = ROLE_META[account.role]
          const active = currentRole === account.role

          if (compact) {
            return (
              <Button
                key={account.role}
                type="button"
                size="sm"
                variant={active ? 'success' : 'secondary'}
                className={`shrink-0 whitespace-nowrap ${
                  dark && !active
                    ? '!border-white/20 !bg-white/10 !text-white hover:!bg-white/20'
                    : ''
                }`}
                onClick={() => onSelect(account.role)}
                disabled={active}
              >
                <Icon className="h-3.5 w-3.5" />
                {meta.short}
              </Button>
            )
          }

          return (
            <button
              key={account.role}
              type="button"
              onClick={() => onSelect(account.role)}
              className={`group relative overflow-hidden rounded-2xl border p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] sm:p-4 ${
                dark
                  ? active
                    ? 'border-teal-300 bg-teal-deep/40 ring-2 ring-teal-300/40'
                    : 'border-white/15 bg-white/10 hover:border-teal-300/50 hover:bg-white/15'
                  : active
                    ? 'border-teal-deep bg-teal-soft/50 ring-2 ring-teal-deep/30'
                    : 'border-slate-200 bg-white/95 hover:border-teal-deep/50'
              }`}
            >
              <div
                className={`mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md sm:mb-3 sm:h-10 sm:w-10 ${meta.accent}`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p
                className={`font-display text-sm font-bold sm:text-base ${
                  dark ? 'text-white' : 'text-navy-900'
                }`}
              >
                {ROLE_LABELS[account.role]}
              </p>
              <p
                className={`mt-1 line-clamp-2 text-[11px] leading-relaxed sm:text-xs ${
                  dark ? 'text-slate-300' : 'text-steel'
                }`}
              >
                {meta.blurb}
              </p>
              <div
                className={`mt-2.5 space-y-0.5 rounded-xl px-2.5 py-2 text-[10px] sm:mt-3 sm:px-3 sm:text-[11px] ${
                  dark
                    ? 'bg-black/25 text-slate-200'
                    : 'bg-slate-soft/80 text-navy-800'
                }`}
              >
                <p>
                  <span className={dark ? 'text-slate-400' : 'font-semibold text-steel'}>
                    User:
                  </span>{' '}
                  {account.name}
                </p>
                <p className="truncate">
                  <span className={dark ? 'text-slate-400' : 'font-semibold text-steel'}>
                    Email:
                  </span>{' '}
                  {account.email}
                </p>
                <p>
                  <span className={dark ? 'text-slate-400' : 'font-semibold text-steel'}>
                    Pass:
                  </span>{' '}
                  {account.password}
                </p>
              </div>
              <span
                className={`mt-2.5 inline-flex text-[11px] font-bold sm:mt-3 sm:text-xs ${
                  dark ? 'text-teal-200' : 'text-teal-deep'
                } group-hover:underline`}
              >
                {active ? 'Current dashboard' : 'Open dashboard →'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
