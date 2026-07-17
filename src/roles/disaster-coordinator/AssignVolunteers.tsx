import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'
import {
  Field,
  FieldInput,
  FieldSelect,
  FormActions,
  FormGrid,
} from '../../components/ui/FormField'

export function AssignVolunteers() {
  const { user } = useAuth()
  const {
    operations,
    setOperations,
    volunteerProfiles,
    setVolunteerProfiles,
    tasks,
    setTasks,
    notify,
    addLog,
  } = useData()
  const [operationId, setOperationId] = useState(operations[0]?.id ?? '')
  const [volunteerId, setVolunteerId] = useState(volunteerProfiles[0]?.id ?? '')
  const [taskTitle, setTaskTitle] = useState('')

  const assign = (e: React.FormEvent) => {
    e.preventDefault()
    const op = operations.find((o) => o.id === operationId)
    const vol = volunteerProfiles.find((v) => v.id === volunteerId)
    if (!op || !vol || !taskTitle) return

    setOperations((prev) =>
      prev.map((o) =>
        o.id === op.id
          ? { ...o, volunteersAssigned: o.volunteersAssigned + 1 }
          : o,
      ),
    )
    setVolunteerProfiles((prev) =>
      prev.map((v) =>
        v.id === vol.id ? { ...v, availability: 'deployed' } : v,
      ),
    )
    setTasks((prev) => [
      {
        id: `t-${Date.now()}`,
        title: taskTitle,
        operationTitle: op.title,
        assignedTo: vol.name,
        priority: 'medium',
        status: 'pending',
        dueDate: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
    addLog({
      actor: user?.name ?? 'Coordinator',
      action: `Assigned ${vol.name} to ${op.title}`,
      module: 'Assignments',
    })
    notify(`${vol.name} assigned to ${op.title}.`)
    setTaskTitle('')
  }

  return (
    <PageShell
      title="Assign Volunteers to Operations"
      description="Deploy available volunteers and create mission tasks."
    >
      <Panel title="Assign Volunteer">
        <form onSubmit={assign}>
          <FormGrid cols={3}>
            <Field label="Operation">
              <FieldSelect
                value={operationId}
                onChange={(e) => setOperationId(e.target.value)}
              >
                {operations.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.title}
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <Field label="Volunteer">
              <FieldSelect
                value={volunteerId}
                onChange={(e) => setVolunteerId(e.target.value)}
              >
                {volunteerProfiles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.availability})
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <Field label="Task title">
              <FieldInput
                placeholder="Task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Assign
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="Current Assignments">
        <DataTable headers={['Task', 'Operation', 'Volunteer', 'Status']}>
          {tasks.map((t) => (
            <tr key={t.id}>
              <Td>{t.title}</Td>
              <Td>{t.operationTitle}</Td>
              <Td>{t.assignedTo}</Td>
              <Td>
                <Badge status={t.status}>{t.status}</Badge>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </PageShell>
  )
}
