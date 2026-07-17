import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'
import { LazyVolunteerCharts } from '../../components/charts/LazyDashboardCharts'

export const volunteerNav = [
  { label: 'Dashboard', path: '' },
  { label: 'Register', path: 'register-volunteer' },
  { label: 'Profile', path: 'update-profile' },
  { label: 'Missions', path: 'apply-missions' },
  { label: 'Tasks', path: 'view-tasks' },
  { label: 'Check In', path: 'check-in-out' },
  { label: 'Reports', path: 'upload-activity-reports' },
  { label: 'History', path: 'service-history' },
  { label: 'Alerts', path: 'emergency-alerts' },
]

export function VolunteerDashboard() {
  const { user } = useAuth()
  const { tasks, shifts, alerts, volunteerProfiles } = useData()
  const profile = volunteerProfiles.find(
    (v) => v.userId === user?.id || v.name === user?.name,
  )
  const myTasks = tasks.filter(
    (t) => t.assignedTo === (profile?.name ?? user?.name),
  )
  const myShifts = shifts.filter(
    (s) => s.volunteerName === (profile?.name ?? user?.name),
  )
  const unread = alerts.filter((a) => !a.read).length

  return (
    <PageShell
      title="Volunteer Dashboard"
      description="Your missions, tasks, attendance, and emergency alerts in one place."
      actions={
        <>
          <Link to="check-in-out" className="w-full min-[420px]:w-auto">
            <Button className="w-full min-[420px]:w-auto">Check In / Out</Button>
          </Link>
          <Link to="emergency-alerts" className="w-full min-[420px]:w-auto">
            <Button variant="secondary" className="w-full min-[420px]:w-auto">
              Alerts ({unread})
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="My Tasks" value={myTasks.length} />
        <StatCard label="Upcoming Shifts" value={myShifts.length} />
        <StatCard label="Service Hours" value={profile?.serviceHours ?? 0} />
        <StatCard label="Unread Alerts" value={unread} />
      </div>

      <LazyVolunteerCharts />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Volunteer Actions">
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
            {volunteerNav.slice(1).map((item) => (
              <Link key={item.path} to={item.path}>
                <Button variant="secondary" className="w-full justify-start">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Assigned Tasks">
          <DataTable headers={['Task', 'Operation', 'Status']}>
            {myTasks.map((t) => (
              <tr key={t.id}>
                <Td>{t.title}</Td>
                <Td>{t.operationTitle}</Td>
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
