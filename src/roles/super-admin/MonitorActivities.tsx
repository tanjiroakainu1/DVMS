import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { DataTable, Td } from '../../components/ui/DataTable'

export function MonitorActivities() {
  const { logs, users, operations } = useData()

  return (
    <PageShell
      title="Monitor System Activities"
      description="Audit trail of administrative and operational actions across modules."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Logged Events" value={logs.length} />
        <StatCard
          label="Active Users"
          value={users.filter((u) => u.status === 'active').length}
        />
        <StatCard
          label="Live Operations"
          value={operations.filter((o) => o.status === 'active').length}
        />
      </div>

      <Panel title="Activity Stream">
        <DataTable headers={['Timestamp', 'Actor', 'Module', 'Action']}>
          {logs.map((log) => (
            <tr key={log.id}>
              <Td className="text-steel">{log.timestamp}</Td>
              <Td>{log.actor}</Td>
              <Td>{log.module}</Td>
              <Td>{log.action}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </PageShell>
  )
}
