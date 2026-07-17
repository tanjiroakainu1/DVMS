import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'

export function MonitorDeployment() {
  const { volunteerProfiles, shifts, tasks, operations } = useData()

  return (
    <PageShell
      title="Monitor Volunteer Deployment"
      description="Live view of volunteer availability, shift attendance, and task progress."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Deployed"
          value={volunteerProfiles.filter((v) => v.availability === 'deployed').length}
        />
        <StatCard
          label="Available"
          value={volunteerProfiles.filter((v) => v.availability === 'available').length}
        />
        <StatCard
          label="Checked In"
          value={shifts.filter((s) => s.status === 'checked-in').length}
        />
        <StatCard
          label="Active Ops"
          value={operations.filter((o) => o.status === 'active').length}
        />
      </div>

      <Panel title="Volunteer Deployment Status">
        <DataTable headers={['Name', 'Availability', 'Skills', 'Hours']}>
          {volunteerProfiles.map((v) => (
            <tr key={v.id}>
              <Td>{v.name}</Td>
              <Td>
                <Badge status={v.availability}>{v.availability}</Badge>
              </Td>
              <Td>{v.skills.join(', ') || '—'}</Td>
              <Td>{v.serviceHours}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Shift Status">
          <DataTable headers={['Volunteer', 'Operation', 'Status']}>
            {shifts.map((s) => (
              <tr key={s.id}>
                <Td>{s.volunteerName}</Td>
                <Td>{s.operationTitle}</Td>
                <Td>
                  <Badge status={s.status}>{s.status}</Badge>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
        <Panel title="Task Progress">
          <DataTable headers={['Task', 'Assignee', 'Status']}>
            {tasks.map((t) => (
              <tr key={t.id}>
                <Td>{t.title}</Td>
                <Td>{t.assignedTo}</Td>
                <Td>
                  <Badge status={t.status}>{t.status}</Badge>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </div>
    </PageShell>
  )
}
