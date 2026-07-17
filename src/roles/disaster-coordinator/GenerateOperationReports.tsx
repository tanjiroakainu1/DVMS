import { useMemo, useState } from 'react'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { LazyOperationReportCharts } from '../../components/charts/LazyDashboardCharts'

export function GenerateOperationReports() {
  const { operations, shifts, tasks, centers } = useData()
  const [output, setOutput] = useState('')

  const summary = useMemo(() => {
    return operations
      .map(
        (op) =>
          `${op.title} [${op.status}] — ${op.location}\n` +
          `  Volunteers assigned: ${op.volunteersAssigned}\n` +
          `  Related shifts: ${shifts.filter((s) => s.operationId === op.id).length}\n` +
          `  Related tasks: ${tasks.filter((t) => t.operationTitle === op.title).length}`,
      )
      .join('\n\n')
  }, [operations, shifts, tasks])

  return (
    <PageShell
      title="Generate Disaster Operation Reports"
      description="Compile operation status, shift coverage, and task completion metrics."
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="Operations"
          value={operations.length}
          hint={`${operations.filter((item) => item.status === 'active').length} active now`}
        />
        <StatCard label="Shifts" value={shifts.length} hint="Response coverage" />
        <StatCard
          label="Tasks"
          value={tasks.length}
          hint={`${tasks.filter((item) => item.status === 'completed').length} completed`}
        />
        <StatCard
          label="Centers"
          value={centers.length}
          hint={`${centers.filter((item) => item.status === 'open').length} open`}
        />
      </div>

      <LazyOperationReportCharts />

      <Panel title="Report Actions">
        <Button
          className="w-full min-[420px]:w-auto"
          onClick={() => {
            setOutput(summary || 'No operations to report.')
          }}
        >
          Generate Operation Report
        </Button>
      </Panel>

      {output ? (
        <Panel title="Report Output">
          <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-navy-950 p-3 text-xs leading-relaxed text-slate-100 sm:p-4 sm:text-sm">
            {output}
          </pre>
        </Panel>
      ) : null}
    </PageShell>
  )
}
