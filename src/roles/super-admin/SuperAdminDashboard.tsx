import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'
import { LazySuperAdminCharts } from '../../components/charts/LazyDashboardCharts'

export const superAdminNav = [
  { label: 'Dashboard', path: '' },
  { label: 'Users', path: 'manage-users' },
  { label: 'Roles', path: 'manage-roles' },
  { label: 'Settings', path: 'configure-settings' },
  { label: 'Categories', path: 'manage-categories' },
  { label: 'Records', path: 'view-records' },
  { label: 'Reports', path: 'generate-reports' },
  { label: 'Backup', path: 'backup-restore' },
  { label: 'Monitor', path: 'monitor-activities' },
]

export function SuperAdminDashboard() {
  const { users, operations, logs, volunteerProfiles } = useData()

  return (
    <PageShell
      title="Super Admin Dashboard"
      description="Full system overview — users, operations, volunteers, and activity monitoring."
      actions={
        <>
          <Link to="manage-users" className="w-full min-[420px]:w-auto">
            <Button className="w-full min-[420px]:w-auto">Manage Users</Button>
          </Link>
          <Link to="generate-reports" className="w-full min-[420px]:w-auto">
            <Button variant="secondary" className="w-full min-[420px]:w-auto">
              System Reports
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Total Users" value={users.length} />
        <StatCard
          label="Active Operations"
          value={operations.filter((o) => o.status === 'active').length}
        />
        <StatCard label="Volunteers" value={volunteerProfiles.length} />
        <StatCard label="Activity Logs" value={logs.length} />
      </div>

      <LazySuperAdminCharts />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Quick Actions">
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
            {superAdminNav.slice(1).map((item) => (
              <Link key={item.path} to={item.path}>
                <Button variant="secondary" className="w-full justify-start">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Recent System Activity">
          <DataTable headers={['Actor', 'Action', 'Time']}>
            {logs.slice(0, 5).map((log) => (
              <tr key={log.id}>
                <Td>{log.actor}</Td>
                <Td>{log.action}</Td>
                <Td className="text-steel whitespace-nowrap">{log.timestamp}</Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </div>

      <Panel title="User Status Snapshot">
        <DataTable headers={['Name', 'Email', 'Role', 'Status']}>
          {users.slice(0, 6).map((u) => (
            <tr key={u.id}>
              <Td>{u.name}</Td>
              <Td className="break-all">{u.email}</Td>
              <Td className="capitalize">{u.role.replace(/-/g, ' ')}</Td>
              <Td>
                <Badge status={u.status}>{u.status}</Badge>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </PageShell>
  )
}
