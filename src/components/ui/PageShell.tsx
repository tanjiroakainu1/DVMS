import type { ReactNode } from 'react'

export function PageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="animate-fade-up space-y-4 sm:space-y-5">
      <div className="page-heading relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-3.5 shadow-sm backdrop-blur-md sm:flex-row sm:items-end sm:justify-between sm:p-4 md:p-5">
        <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-teal-500 via-teal-deep to-navy-800" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-bold tracking-tight text-navy-900 sm:text-2xl lg:text-[1.75rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-steel sm:text-[15px]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex w-full shrink-0 flex-col gap-2 min-[420px]:flex-row min-[420px]:flex-wrap sm:w-auto sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  )
}

export function Panel({
  title,
  children,
  className = '',
  action,
}: {
  title?: string
  children: ReactNode
  className?: string
  action?: ReactNode
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm backdrop-blur transition-shadow duration-200 hover:shadow-md sm:p-4 md:p-5 ${className}`}
    >
      {title || action ? (
        <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2 sm:mb-4">
          {title ? (
            <h2 className="min-w-0 flex-1 truncate text-[11px] font-bold uppercase tracking-wider text-steel sm:text-xs">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-soft/40 p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4">
      <span className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-teal-100/60 transition-transform duration-300 group-hover:scale-125" aria-hidden="true" />
      <p className="text-[10px] font-bold uppercase tracking-wider text-steel sm:text-xs">
        {label}
      </p>
      <p className="relative mt-1.5 font-display text-2xl font-bold tabular-nums text-navy-900 sm:mt-2 sm:text-3xl">
        {value}
      </p>
      {hint ? <p className="mt-1 text-[11px] text-steel sm:text-xs">{hint}</p> : null}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-soft/50 px-4 py-8 text-center text-sm text-steel sm:py-10">
      {message}
    </div>
  )
}

export function StatsRow({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">{children}</div>
  )
}

export function SplitPanels({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>
}

export function ActionTileGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">{children}</div>
  )
}
