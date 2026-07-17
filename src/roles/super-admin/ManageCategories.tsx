import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ActionCell, DataTable, Td } from '../../components/ui/DataTable'
import { Field, FieldInput, FieldSelect, FormActions, FormGrid } from '../../components/ui/FormField'
import type { DisasterCategory } from '../../types'

export function ManageCategories() {
  const { user } = useAuth()
  const { categories, setCategories, notify, addLog } = useData()
  const [form, setForm] = useState({
    name: '',
    description: '',
    severityDefault: 'medium' as DisasterCategory['severityDefault'],
  })

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault()
    setCategories((prev) => [...prev, { id: `c-${Date.now()}`, ...form }])
    addLog({
      actor: user?.name ?? 'Super Admin',
      action: `Added disaster category ${form.name}`,
      module: 'Categories',
    })
    notify(`Category "${form.name}" added.`)
    setForm({ name: '', description: '', severityDefault: 'medium' })
  }

  const removeCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
    notify(`Removed category ${cat?.name ?? ''}.`)
  }

  return (
    <PageShell
      title="Manage Disaster Categories"
      description="Define and maintain disaster types used across operations."
    >
      <Panel title="Add Category">
        <form onSubmit={addCategory}>
          <FormGrid cols={3}>
            <Field label="Category name">
              <FieldInput
                placeholder="Category name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <FieldInput
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </Field>
            <Field label="Default severity">
              <FieldSelect
                value={form.severityDefault}
                onChange={(e) =>
                  setForm({
                    ...form,
                    severityDefault: e.target
                      .value as DisasterCategory['severityDefault'],
                  })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </FieldSelect>
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Add Category
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="Categories">
        <DataTable headers={['Name', 'Description', 'Default Severity', 'Actions']}>
          {categories.map((c) => (
            <tr key={c.id}>
              <Td>{c.name}</Td>
              <Td>{c.description}</Td>
              <Td>
                <Badge status={c.severityDefault}>{c.severityDefault}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button size="sm" variant="danger" onClick={() => removeCategory(c.id)}>
                    Delete
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
