import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'

export function ServiceHistory() {
  const { user } = useAuth()
  const { shifts, reports, volunteerProfiles, tasks } = useData()
  const profile = volunteerProfiles.find((v) => v.name === user?.name)
  const myShifts = shifts.filter((s) => s.volunteerName === user?.name)
  const myReports = reports.filter((r) => r.volunteerName === user?.name)
  const completedTasks = tasks.filter(
    (t) => t.assignedTo === user?.name && t.status === 'completed',
  )

  return (
    <PageShell
      title="Volunteer Service History"
      description="Historical view of shifts, completed tasks, and submitted activity reports."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Service Hours" value={profile?.serviceHours ?? 0} />
        <StatCard label="Shifts Logged" value={myShifts.length} />
        <StatCard label="Tasks Completed" value={completedTasks.length} />
      </div>

      <Panel title="Shift History">
        <DataTable headers={['Date', 'Operation', 'Time', 'Status']}>
          {myShifts.map((s) => (
            <tr key={s.id}>
              <Td>{s.date}</Td>
              <Td>{s.operationTitle}</Td>
              <Td>
                {s.startTime} – {s.endTime}
              </Td>
              <Td>
                <Badge status={s.status}>{s.status}</Badge>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Activity Reports">
        <DataTable headers={['Date', 'Operation', 'Status']}>
          {myReports.map((r) => (
            <tr key={r.id}>
              <Td>{r.date}</Td>
              <Td>{r.operationTitle}</Td>
              <Td>
                <Badge status={r.status}>{r.status}</Badge>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </PageShell>
  )
}
