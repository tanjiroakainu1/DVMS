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
  FormActions,
  FormGrid,
} from '../../components/ui/FormField'
import type { EvacuationCenter } from '../../types'

export function ManageEvacuationCenters() {
  const { user } = useAuth()
  const { centers, setCenters, notify, addLog } = useData()
  const [form, setForm] = useState({
    name: '',
    location: '',
    capacity: 100,
  })

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    setCenters((prev) => [
      ...prev,
      {
        id: `ec-${Date.now()}`,
        name: form.name,
        location: form.location,
        capacity: form.capacity,
        occupancy: 0,
        status: 'open',
        volunteersAssigned: 0,
      },
    ])
    addLog({
      actor: user?.name ?? 'Coordinator',
      action: `Registered evacuation center ${form.name}`,
      module: 'Evacuation Centers',
    })
    notify(`Center "${form.name}" registered.`)
    setForm({ name: '', location: '', capacity: 100 })
  }

  const updateStatus = (id: string, status: EvacuationCenter['status']) => {
    setCenters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    )
    notify(`Center status updated to ${status}.`)
  }

  const adjustOccupancy = (id: string, delta: number) => {
    setCenters((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c
        const occupancy = Math.max(
          0,
          Math.min(c.capacity, c.occupancy + delta),
        )
        const status =
          occupancy >= c.capacity ? 'full' : c.status === 'closed' ? 'closed' : 'open'
        return { ...c, occupancy, status: c.status === 'closed' ? 'closed' : status }
      }),
    )
  }

  return (
    <PageShell
      title="Manage Evacuation Centers"
      description="Register centers, track capacity, and update open/full/closed status."
    >
      <Panel title="Register Center">
        <form onSubmit={add}>
          <FormGrid cols={3}>
            <Field label="Center name">
              <FieldInput
                placeholder="Center name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Location">
              <FieldInput
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </Field>
            <Field label="Capacity">
              <FieldInput
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
              />
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Add Center
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="Centers">
        <DataTable
          headers={['Name', 'Location', 'Capacity', 'Status', 'Actions']}
        >
          {centers.map((c) => (
            <tr key={c.id}>
              <Td>{c.name}</Td>
              <Td>{c.location}</Td>
              <Td>
                {c.occupancy}/{c.capacity}
              </Td>
              <Td>
                <Badge status={c.status}>{c.status}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => adjustOccupancy(c.id, 10)}
                  >
                    +10
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => adjustOccupancy(c.id, -10)}
                  >
                    -10
                  </Button>
                  <Button size="sm" onClick={() => updateStatus(c.id, 'open')}>
                    Open
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => updateStatus(c.id, 'closed')}
                  >
                    Close
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
