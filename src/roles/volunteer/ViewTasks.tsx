import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, EmptyState } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ActionCell, DataTable, Td } from '../../components/ui/DataTable'

export function ViewTasks() {
  const { user } = useAuth()
  const { tasks, setTasks, notify } = useData()
  const myTasks = tasks.filter((t) => t.assignedTo === user?.name)

  const updateStatus = (id: string, status: 'in-progress' | 'completed') => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    notify(`Task marked ${status}.`)
  }

  return (
    <PageShell
      title="View Assigned Tasks"
      description="Track and update progress on your assigned operation tasks."
    >
      <Panel title="My Tasks">
        {myTasks.length === 0 ? (
          <EmptyState message="No tasks assigned yet." />
        ) : (
          <DataTable
            headers={['Task', 'Operation', 'Priority', 'Due', 'Status', 'Actions']}
          >
            {myTasks.map((t) => (
              <tr key={t.id}>
                <Td>{t.title}</Td>
                <Td>{t.operationTitle}</Td>
                <Td>
                  <Badge status={t.priority}>{t.priority}</Badge>
                </Td>
                <Td>{t.dueDate}</Td>
                <Td>
                  <Badge status={t.status}>{t.status}</Badge>
                </Td>
                <Td>
                  <ActionCell>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={t.status !== 'pending'}
                      onClick={() => updateStatus(t.id, 'in-progress')}
                    >
                      Start
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      disabled={t.status === 'completed'}
                      onClick={() => updateStatus(t.id, 'completed')}
                    >
                      Complete
                    </Button>
                  </ActionCell>
                </Td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>
    </PageShell>
  )
}
