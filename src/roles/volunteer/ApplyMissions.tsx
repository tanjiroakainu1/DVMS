import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ActionCell, DataTable, Td } from '../../components/ui/DataTable'

export function ApplyMissions() {
  const { user } = useAuth()
  const { operations, tasks, setTasks, notify, addLog } = useData()
  const active = operations.filter((o) => o.status === 'active')

  const apply = (operationTitle: string) => {
    const name = user?.name ?? 'Volunteer'
    const already = tasks.some(
      (t) => t.operationTitle === operationTitle && t.assignedTo === name,
    )
    if (already) {
      notify('You already applied or were assigned to this mission.')
      return
    }
    setTasks((prev) => [
      {
        id: `t-${Date.now()}`,
        title: `Mission application — ${operationTitle}`,
        operationTitle,
        assignedTo: name,
        priority: 'medium',
        status: 'pending',
        dueDate: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
    addLog({
      actor: name,
      action: `Applied for mission ${operationTitle}`,
      module: 'Missions',
    })
    notify(`Application submitted for ${operationTitle}.`)
  }

  return (
    <PageShell
      title="Apply for Disaster Response Missions"
      description="Browse active operations and submit applications for deployment."
    >
      <Panel title="Open Missions">
        <DataTable
          headers={['Mission', 'Category', 'Location', 'Status', 'Action']}
        >
          {active.map((op) => (
            <tr key={op.id}>
              <Td>{op.title}</Td>
              <Td>{op.category}</Td>
              <Td>{op.location}</Td>
              <Td>
                <Badge status={op.status}>{op.status}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button size="sm" onClick={() => apply(op.title)}>
                    Apply
                  </Button>
                </ActionCell>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </PageShell>
  )
}
