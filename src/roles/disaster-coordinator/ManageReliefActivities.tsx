import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ActionCell, DataTable, Td } from '../../components/ui/DataTable'
import {
  Field,
  FieldInput,
  FieldSelect,
  FormActions,
  FormGrid,
} from '../../components/ui/FormField'

export function ManageReliefActivities() {
  const { user } = useAuth()
  const { operations, tasks, setTasks, notify, addLog } = useData()
  const [form, setForm] = useState({
    title: '',
    operationTitle: operations[0]?.title ?? '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  })

  const addActivity = (e: React.FormEvent) => {
    e.preventDefault()
    setTasks((prev) => [
      {
        id: `t-${Date.now()}`,
        title: form.title,
        operationTitle: form.operationTitle,
        assignedTo: form.assignedTo || 'Unassigned',
        priority: form.priority,
        status: 'pending',
        dueDate: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
    addLog({
      actor: user?.name ?? 'Coordinator',
      action: `Added relief activity ${form.title}`,
      module: 'Relief Activities',
    })
    notify('Relief activity created.')
    setForm({ ...form, title: '', assignedTo: '' })
  }

  const complete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'completed' } : t)),
    )
    notify('Activity marked complete.')
  }

  return (
    <PageShell
      title="Manage Relief Activities"
      description="Plan and track field relief tasks tied to active disaster operations."
    >
      <Panel title="New Relief Activity">
        <form onSubmit={addActivity}>
          <FormGrid cols={3}>
            <Field label="Activity title">
              <FieldInput
                placeholder="Activity title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </Field>
            <Field label="Operation">
              <FieldSelect
                value={form.operationTitle}
                onChange={(e) =>
                  setForm({ ...form, operationTitle: e.target.value })
                }
              >
                {operations.map((op) => (
                  <option key={op.id} value={op.title}>
                    {op.title}
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <Field label="Assigned to">
              <FieldInput
                placeholder="Assigned to"
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              />
            </Field>
            <Field label="Priority">
              <FieldSelect
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as 'low' | 'medium' | 'high',
                  })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </FieldSelect>
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Add Activity
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="Relief Activities">
        <DataTable
          headers={['Activity', 'Operation', 'Assignee', 'Priority', 'Status', 'Actions']}
        >
          {tasks.map((t) => (
            <tr key={t.id}>
              <Td>{t.title}</Td>
              <Td>{t.operationTitle}</Td>
              <Td>{t.assignedTo}</Td>
              <Td>
                <Badge status={t.priority}>{t.priority}</Badge>
              </Td>
              <Td>
                <Badge status={t.status}>{t.status}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button
                    size="sm"
                    variant="success"
                    disabled={t.status === 'completed'}
                    onClick={() => complete(t.id)}
                  >
                    Complete
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
