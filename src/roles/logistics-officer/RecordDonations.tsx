import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ActionCell, DataTable, Td } from '../../components/ui/DataTable'
import { Field, FieldInput, FormActions, FormGrid } from '../../components/ui/FormField'

export function RecordDonations() {
  const { user } = useAuth()
  const { donations, setDonations, inventory, setInventory, notify, addLog } =
    useData()
  const [form, setForm] = useState({
    donor: '',
    item: '',
    quantity: 1,
    unit: 'pcs',
  })

  const record = (e: React.FormEvent) => {
    e.preventDefault()
    setDonations((prev) => [
      {
        id: `d-${Date.now()}`,
        donor: form.donor,
        item: form.item,
        quantity: form.quantity,
        unit: form.unit,
        date: new Date().toISOString().slice(0, 10),
        status: 'received',
      },
      ...prev,
    ])

    const existing = inventory.find(
      (i) => i.name.toLowerCase() === form.item.toLowerCase(),
    )
    if (existing) {
      setInventory((prev) =>
        prev.map((i) => {
          if (i.id !== existing.id) return i
          const quantity = i.quantity + form.quantity
          return {
            ...i,
            quantity,
            status: quantity < 50 ? 'low' : 'in-stock',
          }
        }),
      )
    } else {
      setInventory((prev) => [
        ...prev,
        {
          id: `inv-${Date.now()}`,
          name: form.item,
          category: 'Donation',
          quantity: form.quantity,
          unit: form.unit,
          warehouse: 'Warehouse A',
          status: form.quantity < 50 ? 'low' : 'in-stock',
        },
      ])
    }

    addLog({
      actor: user?.name ?? 'Logistics Officer',
      action: `Recorded donation from ${form.donor}`,
      module: 'Donations',
    })
    notify('Donation recorded and inventory updated.')
    setForm({ donor: '', item: '', quantity: 1, unit: 'pcs' })
  }

  const markDistributed = (id: string) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'distributed' } : d)),
    )
    notify('Donation marked as distributed.')
  }

  return (
    <PageShell
      title="Record Incoming Donations"
      description="Log donor contributions and automatically reflect them in warehouse stock."
    >
      <Panel title="New Donation">
        <form onSubmit={record}>
          <FormGrid cols={3}>
            <Field label="Donor">
              <FieldInput
                placeholder="Donor name"
                value={form.donor}
                onChange={(e) => setForm({ ...form, donor: e.target.value })}
                required
              />
            </Field>
            <Field label="Item">
              <FieldInput
                placeholder="Item"
                value={form.item}
                onChange={(e) => setForm({ ...form, item: e.target.value })}
                required
              />
            </Field>
            <Field label="Quantity">
              <FieldInput
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              />
            </Field>
            <Field label="Unit">
              <FieldInput
                placeholder="Unit"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Record
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="Donations Log">
        <DataTable headers={['Date', 'Donor', 'Item', 'Status', 'Actions']}>
          {donations.map((d) => (
            <tr key={d.id}>
              <Td>{d.date}</Td>
              <Td>{d.donor}</Td>
              <Td>
                {d.item} ({d.quantity} {d.unit})
              </Td>
              <Td>
                <Badge status={d.status}>{d.status}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={d.status === 'distributed'}
                    onClick={() => markDistributed(d.id)}
                  >
                    Mark Distributed
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
