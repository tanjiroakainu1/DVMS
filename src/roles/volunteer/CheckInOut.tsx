import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, EmptyState } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ActionCell, DataTable, Td } from '../../components/ui/DataTable'

export function CheckInOut() {
  const { user } = useAuth()
  const { shifts, setShifts, volunteerProfiles, setVolunteerProfiles, notify } =
    useData()
  const myShifts = shifts.filter((s) => s.volunteerName === user?.name)

  const checkIn = (id: string) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'checked-in' } : s)),
    )
    setVolunteerProfiles((prev) =>
      prev.map((v) =>
        v.name === user?.name ? { ...v, availability: 'deployed' } : v,
      ),
    )
    notify('Checked in successfully.')
  }

  const checkOut = (id: string) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'completed' } : s)),
    )
    setVolunteerProfiles((prev) =>
      prev.map((v) =>
        v.name === user?.name
          ? {
              ...v,
              availability: 'available',
              serviceHours: v.serviceHours + 8,
            }
          : v,
      ),
    )
    notify('Checked out. Service hours updated.')
  }

  return (
    <PageShell
      title="Check In and Check Out"
      description="Record attendance for your scheduled operation shifts."
    >
      <Panel title="My Shifts">
        {myShifts.length === 0 ? (
          <EmptyState message="No shifts scheduled for you." />
        ) : (
          <DataTable
            headers={['Operation', 'Date', 'Time', 'Status', 'Actions']}
          >
            {myShifts.map((s) => (
              <tr key={s.id}>
                <Td>{s.operationTitle}</Td>
                <Td>{s.date}</Td>
                <Td>
                  {s.startTime} – {s.endTime}
                </Td>
                <Td>
                  <Badge status={s.status}>{s.status}</Badge>
                </Td>
                <Td>
                  <ActionCell>
                    <Button
                      size="sm"
                      disabled={s.status !== 'scheduled'}
                      onClick={() => checkIn(s.id)}
                    >
                      Check In
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={s.status !== 'checked-in'}
                      onClick={() => checkOut(s.id)}
                    >
                      Check Out
                    </Button>
                  </ActionCell>
                </Td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>

      <Panel title="Availability">
        <p className="text-sm text-steel">
          Current status:{' '}
          <strong className="text-navy-900">
            {volunteerProfiles.find((v) => v.name === user?.name)?.availability ??
              'unknown'}
          </strong>
        </p>
      </Panel>
    </PageShell>
  )
}
