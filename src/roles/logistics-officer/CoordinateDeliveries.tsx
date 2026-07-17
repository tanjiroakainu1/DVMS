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
import type { Delivery } from '../../types'

export function CoordinateDeliveries() {
  const { user } = useAuth()
  const { deliveries, setDeliveries, vehicles, notify, addLog } = useData()
  const [form, setForm] = useState({
    destination: '',
    items: '',
    vehicle: vehicles.find((v) => v.status === 'available')?.plateNumber ?? '',
    eta: '',
  })

  const create = (e: React.FormEvent) => {
    e.preventDefault()
    setDeliveries((prev) => [
      {
        id: `del-${Date.now()}`,
        destination: form.destination,
        items: form.items,
        vehicle: form.vehicle || 'Unassigned',
        status: 'scheduled',
        eta: form.eta || 'TBD',
      },
      ...prev,
    ])
    addLog({
      actor: user?.name ?? 'Logistics Officer',
      action: `Scheduled delivery to ${form.destination}`,
      module: 'Deliveries',
    })
    notify('Delivery coordinated.')
    setForm({ destination: '', items: '', vehicle: form.vehicle, eta: '' })
  }

  const updateStatus = (id: string, status: Delivery['status']) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d)),
    )
    notify(`Delivery marked ${status}.`)
  }

  return (
    <PageShell
      title="Coordinate Supply Deliveries"
      description="Schedule, dispatch, and complete supply deliveries to field destinations."
    >
      <Panel title="Schedule Delivery">
        <form onSubmit={create}>
          <FormGrid cols={3}>
            <Field label="Destination">
              <FieldInput
                placeholder="Destination"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                required
              />
            </Field>
            <Field label="Items">
              <FieldInput
                placeholder="Items summary"
                value={form.items}
                onChange={(e) => setForm({ ...form, items: e.target.value })}
                required
              />
            </Field>
            <Field label="Vehicle">
              <FieldSelect
                value={form.vehicle}
                onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plateNumber}>
                    {v.plateNumber} ({v.status})
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <Field label="ETA">
              <FieldInput
                placeholder="ETA"
                value={form.eta}
                onChange={(e) => setForm({ ...form, eta: e.target.value })}
              />
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Schedule
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="Delivery Board">
        <DataTable
          headers={['Destination', 'Items', 'Vehicle', 'ETA', 'Status', 'Actions']}
        >
          {deliveries.map((d) => (
            <tr key={d.id}>
              <Td>{d.destination}</Td>
              <Td>{d.items}</Td>
              <Td>{d.vehicle}</Td>
              <Td>{d.eta}</Td>
              <Td>
                <Badge status={d.status}>{d.status}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={d.status !== 'scheduled'}
                    onClick={() => updateStatus(d.id, 'in-transit')}
                  >
                    Dispatch
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    disabled={d.status === 'delivered'}
                    onClick={() => updateStatus(d.id, 'delivered')}
                  >
                    Delivered
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
