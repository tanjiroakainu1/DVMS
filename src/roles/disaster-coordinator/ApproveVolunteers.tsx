import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, EmptyState } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ActionCell, DataTable, Td } from '../../components/ui/DataTable'

export function ApproveVolunteers() {
  const { user } = useAuth()
  const { users, setUsers, volunteerProfiles, setVolunteerProfiles, notify, addLog } =
    useData()
  const pending = users.filter(
    (u) => u.role === 'volunteer' && u.status === 'pending',
  )

  const decide = (id: string, approve: boolean) => {
    const target = users.find((u) => u.id === id)
    if (!target) return

    if (approve) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: 'active' } : u)),
      )
      if (!volunteerProfiles.some((v) => v.userId === id)) {
        setVolunteerProfiles((prev) => [
          ...prev,
          {
            id: `vp-${Date.now()}`,
            userId: id,
            name: target.name,
            skills: [],
            certifications: [],
            availability: 'available',
            emergencyContact: 'TBD',
            emergencyPhone: target.phone ?? '',
            serviceHours: 0,
          },
        ])
      }
      addLog({
        actor: user?.name ?? 'Coordinator',
        action: `Approved volunteer ${target.name}`,
        module: 'Volunteer Approvals',
      })
      notify(`${target.name} approved as volunteer.`)
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== id))
      notify(`${target.name} registration rejected.`)
    }
  }

  return (
    <PageShell
      title="Approve Volunteer Registrations"
      description="Review pending volunteer applications and activate profiles."
    >
      <Panel title="Pending Applications">
        {pending.length === 0 ? (
          <EmptyState message="No pending volunteer registrations." />
        ) : (
          <DataTable headers={['Name', 'Email', 'Phone', 'Submitted', 'Actions']}>
            {pending.map((u) => (
              <tr key={u.id}>
                <Td>{u.name}</Td>
                <Td>{u.email}</Td>
                <Td>{u.phone ?? '—'}</Td>
                <Td>{u.createdAt}</Td>
                <Td>
                  <ActionCell>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => decide(u.id, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => decide(u.id, false)}
                    >
                      Reject
                    </Button>
                  </ActionCell>
                </Td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>

      <Panel title="Active Volunteers">
        <DataTable headers={['Name', 'Email', 'Status']}>
          {users
            .filter((u) => u.role === 'volunteer' && u.status === 'active')
            .map((u) => (
              <tr key={u.id}>
                <Td>{u.name}</Td>
                <Td>{u.email}</Td>
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
