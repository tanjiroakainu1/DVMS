import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'
import { LazyCoordinatorCharts } from '../../components/charts/LazyDashboardCharts'

export const coordinatorNav = [
  { label: 'Dashboard', path: '' },
  { label: 'Operations', path: 'create-operations' },
  { label: 'Approvals', path: 'approve-volunteers' },
  { label: 'Assign', path: 'assign-volunteers' },
  { label: 'Centers', path: 'manage-evacuation-centers' },
  { label: 'Shifts', path: 'schedule-shifts' },
  { label: 'Deployment', path: 'monitor-deployment' },
  { label: 'Relief', path: 'manage-relief-activities' },
  { label: 'Reports', path: 'generate-operation-reports' },
]

export function CoordinatorDashboard() {
  const { operations, users, centers, shifts } = useData()
  const pending = users.filter(
    (u) => u.role === 'volunteer' && u.status === 'pending',
  ).length

  return (
    <PageShell
      title="Disaster Coordinator Dashboard"
      description="Coordinate operations, approvals, deployments, and evacuation centers."
      actions={
        <>
          <Link to="create-operations" className="w-full min-[420px]:w-auto">
            <Button className="w-full min-[420px]:w-auto">New Operation</Button>
          </Link>
          <Link to="approve-volunteers" className="w-full min-[420px]:w-auto">
            <Button variant="secondary" className="w-full min-[420px]:w-auto">
              Approvals ({pending})
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="Active Operations"
          value={operations.filter((o) => o.status === 'active').length}
        />
        <StatCard label="Pending Approvals" value={pending} />
        <StatCard
          label="Open Centers"
          value={centers.filter((c) => c.status === 'open').length}
        />
        <StatCard
          label="Scheduled Shifts"
          value={shifts.filter((s) => s.status === 'scheduled').length}
        />
      </div>

      <LazyCoordinatorCharts />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Coordinator Actions">
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
            {coordinatorNav.slice(1).map((item) => (
              <Link key={item.path} to={item.path}>
                <Button variant="secondary" className="w-full justify-start">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Active Operations">
          <DataTable headers={['Operation', 'Location', 'Status', 'Volunteers']}>
            {operations
              .filter((o) => o.status === 'active')
              .map((op) => (
                <tr key={op.id}>
                  <Td>{op.title}</Td>
                  <Td>{op.location}</Td>
                  <Td>
                    <Badge status={op.status}>{op.status}</Badge>
                  </Td>
                  <Td>{op.volunteersAssigned}</Td>
                </tr>
              ))}
          </DataTable>
        </Panel>
      </div>
    </PageShell>
  )
}
