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
  FieldTextarea,
  FormActions,
  FormGrid,
} from '../../components/ui/FormField'
import type { DisasterOperation } from '../../types'

export function CreateOperations() {
  const { user } = useAuth()
  const { operations, setOperations, categories, notify, addLog } = useData()
  const [form, setForm] = useState({
    title: '',
    category: categories[0]?.name ?? 'Flood',
    location: '',
    description: '',
    status: 'planning' as DisasterOperation['status'],
  })

  const create = (e: React.FormEvent) => {
    e.preventDefault()
    setOperations((prev) => [
      {
        id: `op-${Date.now()}`,
        title: form.title,
        category: form.category,
        location: form.location,
        status: form.status,
        coordinator: user?.name ?? 'Coordinator',
        startDate: new Date().toISOString().slice(0, 10),
        volunteersAssigned: 0,
        description: form.description,
      },
      ...prev,
    ])
    addLog({
      actor: user?.name ?? 'Coordinator',
      action: `Created operation ${form.title}`,
      module: 'Operations',
    })
    notify(`Operation "${form.title}" created.`)
    setForm({
      title: '',
      category: categories[0]?.name ?? 'Flood',
      location: '',
      description: '',
      status: 'planning',
    })
  }

  const setStatus = (id: string, status: DisasterOperation['status']) => {
    setOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status } : op)),
    )
    notify(`Operation status set to ${status}.`)
  }

  return (
    <PageShell
      title="Create Disaster Response Operations"
      description="Register incidents and launch response operations with category and status tracking."
    >
      <Panel title="New Operation">
        <form onSubmit={create}>
          <FormGrid cols={2}>
            <Field label="Title">
              <FieldInput
                placeholder="Operation title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </Field>
            <Field label="Category">
              <FieldSelect
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <Field label="Location">
              <FieldInput
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </Field>
            <Field label="Status">
              <FieldSelect
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as DisasterOperation['status'],
                  })
                }
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="completed">Completed</option>
              </FieldSelect>
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <FieldTextarea
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Create Operation
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="All Operations">
        <DataTable headers={['Title', 'Category', 'Location', 'Status', 'Actions']}>
          {operations.map((op) => (
            <tr key={op.id}>
              <Td>{op.title}</Td>
              <Td>{op.category}</Td>
              <Td>{op.location}</Td>
              <Td>
                <Badge status={op.status}>{op.status}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => setStatus(op.id, 'active')}
                  >
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setStatus(op.id, 'completed')}
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
