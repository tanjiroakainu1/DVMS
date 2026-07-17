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

export function AllocateSupplies() {
  const { user } = useAuth()
  const { inventory, setInventory, operations, deliveries, setDeliveries, notify, addLog } =
    useData()
  const [form, setForm] = useState({
    itemId: inventory[0]?.id ?? '',
    quantity: 10,
    operationTitle: operations[0]?.title ?? '',
  })

  const allocate = (e: React.FormEvent) => {
    e.preventDefault()
    const item = inventory.find((i) => i.id === form.itemId)
    if (!item) return
    if (form.quantity > item.quantity) {
      notify('Not enough stock to allocate.')
      return
    }

    setInventory((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i
        const quantity = i.quantity - form.quantity
        return {
          ...i,
          quantity,
          status: quantity <= 0 ? 'out-of-stock' : quantity < 50 ? 'low' : 'in-stock',
        }
      }),
    )

    const op = operations.find((o) => o.title === form.operationTitle)
    setDeliveries((prev) => [
      {
        id: `del-${Date.now()}`,
        destination: op?.location ?? form.operationTitle,
        items: `${item.name} x${form.quantity}`,
        vehicle: 'Pending assignment',
        status: 'scheduled',
        eta: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
      ...prev,
    ])

    addLog({
      actor: user?.name ?? 'Logistics Officer',
      action: `Allocated ${form.quantity} ${item.name} to ${form.operationTitle}`,
      module: 'Allocation',
    })
    notify(`Allocated ${form.quantity} ${item.name}.`)
  }

  return (
    <PageShell
      title="Allocate Supplies to Response Teams"
      description="Reserve inventory for operations and queue related deliveries."
    >
      <Panel title="Allocate Supplies">
        <form onSubmit={allocate}>
          <FormGrid>
            <Field label="Item">
              <FieldSelect
                value={form.itemId}
                onChange={(e) => setForm({ ...form, itemId: e.target.value })}
              >
                {inventory.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.quantity} {i.unit})
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <Field label="Quantity">
              <FieldInput
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              />
            </Field>
            <Field label="Operation" className="sm:col-span-2">
              <FieldSelect
                value={form.operationTitle}
                onChange={(e) => setForm({ ...form, operationTitle: e.target.value })}
              >
                {operations.map((op) => (
                  <option key={op.id} value={op.title}>
                    {op.title}
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Allocate
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="Recent Allocations / Deliveries">
        <DataTable headers={['Destination', 'Items', 'Status']}>
          {deliveries.slice(0, 8).map((d) => (
            <tr key={d.id}>
              <Td>{d.destination}</Td>
              <Td>{d.items}</Td>
              <Td>
                <Badge status={d.status}>{d.status}</Badge>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </PageShell>
  )
}
