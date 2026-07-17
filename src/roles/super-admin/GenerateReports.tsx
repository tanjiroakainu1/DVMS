import { useMemo, useState } from 'react'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { LazySystemReportCharts } from '../../components/charts/LazyDashboardCharts'

export function GenerateReports() {
  const {
    users,
    operations,
    volunteerProfiles,
    donations,
    tasks,
    inventory,
    notify,
  } = useData()
  const [report, setReport] = useState<string>('')

  const summaries = useMemo(
    () => ({
      system: `System-wide Report
Users: ${users.length}
Active operations: ${operations.filter((o) => o.status === 'active').length}
Registered volunteers: ${volunteerProfiles.length}
Donations logged: ${donations.length}
Pending tasks: ${tasks.filter((t) => t.status !== 'completed').length}
Inventory SKUs: ${inventory.length}`,
      volunteers: `Volunteer Participation Report
Profiles: ${volunteerProfiles.length}
Total service hours: ${volunteerProfiles.reduce((s, v) => s + v.serviceHours, 0)}
Available: ${volunteerProfiles.filter((v) => v.availability === 'available').length}
Deployed: ${volunteerProfiles.filter((v) => v.availability === 'deployed').length}`,
      response: `Disaster Response Report
Operations: ${operations.length}
Active: ${operations.filter((o) => o.status === 'active').length}
Completed: ${operations.filter((o) => o.status === 'completed').length}
Total volunteers assigned: ${operations.reduce((s, o) => s + o.volunteersAssigned, 0)}`,
    }),
    [users, operations, volunteerProfiles, donations, tasks, inventory],
  )

  const run = (key: keyof typeof summaries) => {
    setReport(summaries[key])
    notify('Report generated.')
  }

  return (
    <PageShell
      title="Generate System-wide Reports"
      description="Produce summaries across volunteers, response operations, and system usage."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Users" value={users.length} />
        <StatCard label="Operations" value={operations.length} />
        <StatCard
          label="Service Hours"
          value={volunteerProfiles.reduce((s, v) => s + v.serviceHours, 0)}
        />
      </div>

      <LazySystemReportCharts />

      <Panel title="Report Actions">
        <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:flex-wrap">
          <Button className="w-full min-[420px]:w-auto" onClick={() => run('system')}>
            System-wide Report
          </Button>
          <Button
            className="w-full min-[420px]:w-auto"
            variant="secondary"
            onClick={() => run('volunteers')}
          >
            Volunteer Participation
          </Button>
          <Button
            className="w-full min-[420px]:w-auto"
            variant="secondary"
            onClick={() => run('response')}
          >
            Disaster Response
          </Button>
        </div>
      </Panel>

      {report ? (
        <Panel title="Generated Output">
          <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-navy-950 p-3 text-xs leading-relaxed text-slate-100 sm:p-4 sm:text-sm">
            {report}
          </pre>
        </Panel>
      ) : null}
    </PageShell>
  )
}
