import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ActionCell, DataTable, Td } from '../../components/ui/DataTable'
import { Field, FieldInput, FieldSelect, FormActions, FormGrid } from '../../components/ui/FormField'
import type { UserRole } from '../../types'

export function ManageUsers() {
  const { user } = useAuth()
  const { users, setUsers, notify, addLog } = useData()
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'volunteer' as UserRole,
    phone: '',
  })

  const addUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setUsers((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        name: form.name,
        email: form.email,
        role: form.role,
        status: 'active',
        phone: form.phone,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ])
    addLog({
      actor: user?.name ?? 'Super Admin',
      action: `Created user ${form.name}`,
      module: 'User Management',
    })
    notify(`User ${form.name} created successfully.`)
    setForm({ name: '', email: '', role: 'volunteer', phone: '' })
  }

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u,
      ),
    )
    notify('User status updated.')
  }

  const removeUser = (id: string) => {
    const target = users.find((u) => u.id === id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
    notify(`Removed ${target?.name ?? 'user'}.`)
  }

  return (
    <PageShell
      title="Manage Users"
      description="Create accounts, activate or deactivate users, and remove access."
    >
      <Panel title="Add User">
        <form onSubmit={addUser}>
          <FormGrid cols={3}>
            <Field label="Full name">
              <FieldInput
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Email">
              <FieldInput
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Field>
            <Field label="Phone">
              <FieldInput
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label="Role">
              <FieldSelect
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as UserRole })
                }
              >
                <option value="super-admin">Super Admin</option>
                <option value="disaster-coordinator">Disaster Coordinator</option>
                <option value="volunteer">Volunteer</option>
                <option value="logistics-officer">Logistics Officer</option>
              </FieldSelect>
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Add User
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="All Users">
        <DataTable headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
          {users.map((u) => (
            <tr key={u.id}>
              <Td>{u.name}</Td>
              <Td className="break-all">{u.email}</Td>
              <Td className="capitalize">{u.role.replace(/-/g, ' ')}</Td>
              <Td>
                <Badge status={u.status}>{u.status}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button size="sm" variant="secondary" onClick={() => toggleStatus(u.id)}>
                    Toggle
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => removeUser(u.id)}>
                    Remove
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
