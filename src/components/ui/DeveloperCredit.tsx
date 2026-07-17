import { Code2, Sparkles } from 'lucide-react'

export function DeveloperCredit({
  tone = 'light',
  compact = false,
  className = '',
}: {
  tone?: 'light' | 'dark'
  compact?: boolean
  className?: string
}) {
  const dark = tone === 'dark'

  if (compact) {
    return (
      <div
        className={`group relative mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-teal-deep to-navy-900 text-xs font-black text-white shadow-md ${className}`}
        title="Developed by Raminder Jangao"
        aria-label="Developed by Raminder Jangao"
      >
        RJ
        <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-amber-300 transition-transform group-hover:rotate-12 group-hover:scale-110" />
      </div>
    )
  }

  return (
    <div
      className={`group flex min-w-0 items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${
        dark
          ? 'border-white/10 bg-white/5 hover:border-teal-300/30 hover:bg-white/10'
          : 'border-slate-200/80 bg-gradient-to-r from-white to-teal-50/60 shadow-sm hover:border-teal-300 hover:shadow-md'
      } ${className}`}
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-teal-deep to-navy-900 text-xs font-black text-white shadow-md">
        RJ
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-300 text-navy-950 ring-2 ring-white">
          <Code2 className="h-2.5 w-2.5" />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
            dark ? 'text-teal-200' : 'text-teal-deep'
          }`}
        >
          Designed &amp; developed by
        </p>
        <p
          className={`truncate font-display text-sm font-bold ${
            dark ? 'text-white' : 'text-navy-900'
          }`}
        >
          Raminder Jangao
        </p>
        <p className={`text-[10px] ${dark ? 'text-slate-400' : 'text-steel'}`}>
          Full-Stack System Developer
        </p>
      </div>

      <Sparkles
        className={`h-4 w-4 shrink-0 transition-transform group-hover:rotate-12 group-hover:scale-110 ${
          dark ? 'text-amber-200' : 'text-amber-strong'
        }`}
      />
    </div>
  )
}
