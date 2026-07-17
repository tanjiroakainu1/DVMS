import { PageShell, Panel } from '../../components/ui/PageShell'
import { ROLE_LABELS, type UserRole } from '../../types'
import { useData } from '../../context/DataContext'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'

const roleCapabilities: Record<UserRole, string[]> = {
  'super-admin': [
    'Full system access',
    'Manage users and roles',
    'Configure disaster response settings',
    'Manage disaster categories',
    'View all records',
    'Generate system-wide reports',
    'Backup and restore data',
    'Monitor system activities',
  ],
  'disaster-coordinator': [
    'Create disaster response operations',
    'Approve volunteer registrations',
    'Assign volunteers to operations',
    'Manage evacuation centers',
    'Schedule volunteer shifts',
    'Monitor volunteer deployment',
    'Manage relief activities',
    'Generate disaster operation reports',
  ],
  volunteer: [
    'Register as a volunteer',
    'Update profile and skills',
    'Apply for missions',
    'View assigned tasks',
    'Check in / check out',
    'Upload activity reports',
    'View service history',
    'Receive emergency alerts',
  ],
  'logistics-officer': [
    'Manage relief goods inventory',
    'Allocate supplies',
    'Track equipment and vehicles',
    'Monitor relief distribution',
    'Record incoming donations',
    'Generate logistics reports',
    'Monitor warehouse stock',
    'Coordinate supply deliveries',
  ],
}

export function ManageRoles() {
  const { users } = useData()

  return (
    <PageShell
      title="Manage Roles"
      description="Role-based access control matrix and active membership counts."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
          <Panel key={role} title={ROLE_LABELS[role]}>
            <p className="mb-3 text-sm text-steel">
              Active members:{' '}
              <strong className="text-navy-900">
                {users.filter((u) => u.role === role && u.status === 'active').length}
              </strong>
            </p>
            <ul className="space-y-2">
              {roleCapabilities[role].map((cap) => (
                <li
                  key={cap}
                  className="flex items-start gap-2 rounded-xl border border-slate-200/70 bg-slate-soft/70 px-3 py-2.5 text-sm leading-relaxed text-navy-800"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-deep" />
                  {cap}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <Panel title="Users by Role">
        <DataTable headers={['Name', 'Email', 'Assigned Role', 'Status']}>
          {users.map((u) => (
            <tr key={u.id}>
              <Td>{u.name}</Td>
              <Td>{u.email}</Td>
              <Td>{ROLE_LABELS[u.role]}</Td>
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
