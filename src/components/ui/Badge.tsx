import type { ReactNode } from 'react'

const colors: Record<string, string> = {
  active: 'bg-teal-soft text-teal-deep',
  open: 'bg-teal-soft text-teal-deep',
  available: 'bg-teal-soft text-teal-deep',
  completed: 'bg-slate-200 text-navy-700',
  reviewed: 'bg-slate-200 text-navy-700',
  delivered: 'bg-teal-soft text-teal-deep',
  received: 'bg-teal-soft text-teal-deep',
  pending: 'bg-amber-100 text-amber-800',
  scheduled: 'bg-blue-100 text-blue-800',
  planning: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'in-transit': 'bg-blue-100 text-blue-800',
  'checked-in': 'bg-emerald-100 text-emerald-800',
  'in-stock': 'bg-teal-soft text-teal-deep',
  low: 'bg-amber-100 text-amber-800',
  'out-of-stock': 'bg-red-100 text-alert',
  full: 'bg-amber-100 text-amber-800',
  closed: 'bg-slate-200 text-navy-700',
  suspended: 'bg-amber-100 text-amber-800',
  inactive: 'bg-slate-200 text-navy-700',
  deployed: 'bg-blue-100 text-blue-800',
  'in-use': 'bg-blue-100 text-blue-800',
  maintenance: 'bg-amber-100 text-amber-800',
  unavailable: 'bg-slate-200 text-navy-700',
  emergency: 'bg-red-100 text-alert',
  reminder: 'bg-amber-100 text-amber-800',
  info: 'bg-blue-100 text-blue-800',
  high: 'bg-red-100 text-alert',
  medium: 'bg-amber-100 text-amber-800',
  critical: 'bg-red-100 text-alert',
  submitted: 'bg-blue-100 text-blue-800',
  distributed: 'bg-teal-soft text-teal-deep',
  missed: 'bg-red-100 text-alert',
}

export function Badge({
  children,
  status,
}: {
  children: ReactNode
  status?: string
}) {
  const key = (status ?? String(children)).toLowerCase()
  const tone = colors[key] ?? 'bg-slate-200 text-navy-700'
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border border-current/10 px-2.5 py-1 text-[11px] font-bold capitalize leading-none shadow-sm ${tone}`}
    >
      {children}
    </span>
  )
}
