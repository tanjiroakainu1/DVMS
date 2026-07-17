import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { BarChart3 } from 'lucide-react'

function lazyChart(
  name:
    | 'SuperAdminCharts'
    | 'CoordinatorCharts'
    | 'VolunteerCharts'
    | 'LogisticsCharts'
    | 'SystemReportCharts'
    | 'ActivityReportCharts'
    | 'OperationReportCharts'
    | 'LogisticsReportCharts',
) {
  return lazy(async () => {
    const charts = await import('./DashboardCharts')
    return { default: charts[name] as ComponentType }
  })
}

const SuperAdminCharts = lazyChart('SuperAdminCharts')
const CoordinatorCharts = lazyChart('CoordinatorCharts')
const VolunteerCharts = lazyChart('VolunteerCharts')
const LogisticsCharts = lazyChart('LogisticsCharts')
const SystemReportCharts = lazyChart('SystemReportCharts')
const ActivityReportCharts = lazyChart('ActivityReportCharts')
const OperationReportCharts = lazyChart('OperationReportCharts')
const LogisticsReportCharts = lazyChart('LogisticsReportCharts')

function ChartFallback() {
  return (
    <div className="flex min-h-72 animate-pulse items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80">
      <div className="text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-soft text-teal-deep">
          <BarChart3 className="h-5 w-5" />
        </span>
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-steel">
          Loading live analytics
        </p>
      </div>
    </div>
  )
}

function ChartBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<ChartFallback />}>{children}</Suspense>
}

export function LazySuperAdminCharts() {
  return (
    <ChartBoundary>
      <SuperAdminCharts />
    </ChartBoundary>
  )
}

export function LazyCoordinatorCharts() {
  return (
    <ChartBoundary>
      <CoordinatorCharts />
    </ChartBoundary>
  )
}

export function LazyVolunteerCharts() {
  return (
    <ChartBoundary>
      <VolunteerCharts />
    </ChartBoundary>
  )
}

export function LazyLogisticsCharts() {
  return (
    <ChartBoundary>
      <LogisticsCharts />
    </ChartBoundary>
  )
}

export function LazySystemReportCharts() {
  return (
    <ChartBoundary>
      <SystemReportCharts />
    </ChartBoundary>
  )
}

export function LazyActivityReportCharts() {
  return (
    <ChartBoundary>
      <ActivityReportCharts />
    </ChartBoundary>
  )
}

export function LazyOperationReportCharts() {
  return (
    <ChartBoundary>
      <OperationReportCharts />
    </ChartBoundary>
  )
}

export function LazyLogisticsReportCharts() {
  return (
    <ChartBoundary>
      <LogisticsReportCharts />
    </ChartBoundary>
  )
}
