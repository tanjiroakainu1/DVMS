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
import type { InventoryItem } from '../../types'

function stockStatus(qty: number): InventoryItem['status'] {
  if (qty <= 0) return 'out-of-stock'
  if (qty < 50) return 'low'
  return 'in-stock'
}

export function ManageInventory() {
  const { user } = useAuth()
  const { inventory, setInventory, notify, addLog } = useData()
  const [form, setForm] = useState({
    name: '',
    category: 'Food',
    quantity: 0,
    unit: 'pcs',
    warehouse: 'Warehouse A',
  })

  const addItem = (e: React.FormEvent) => {
    e.preventDefault()
    setInventory((prev) => [
      ...prev,
      {
        id: `inv-${Date.now()}`,
        name: form.name,
        category: form.category,
        quantity: form.quantity,
        unit: form.unit,
        warehouse: form.warehouse,
        status: stockStatus(form.quantity),
      },
    ])
    addLog({
      actor: user?.name ?? 'Logistics Officer',
      action: `Added inventory item ${form.name}`,
      module: 'Inventory',
    })
    notify(`Added ${form.name} to inventory.`)
    setForm({ ...form, name: '', quantity: 0 })
  }

  const adjust = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const quantity = Math.max(0, item.quantity + delta)
        return { ...item, quantity, status: stockStatus(quantity) }
      }),
    )
  }

  return (
    <PageShell
      title="Manage Relief Goods Inventory"
      description="Add stock items and adjust quantities across warehouses."
    >
      <Panel title="Add Inventory Item">
        <form onSubmit={addItem}>
          <FormGrid cols={3}>
            <Field label="Item">
              <FieldInput
                placeholder="Item name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Category">
              <FieldInput
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </Field>
            <Field label="Quantity">
              <FieldInput
                type="number"
                min={0}
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
            <Field label="Warehouse">
              <FieldSelect
                value={form.warehouse}
                onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
              >
                <option>Warehouse A</option>
                <option>Warehouse B</option>
              </FieldSelect>
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Add Item
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="Inventory List">
        <DataTable
          headers={['Item', 'Category', 'Qty', 'Warehouse', 'Status', 'Adjust']}
        >
          {inventory.map((item) => (
            <tr key={item.id}>
              <Td>{item.name}</Td>
              <Td>{item.category}</Td>
              <Td>
                {item.quantity} {item.unit}
              </Td>
              <Td>{item.warehouse}</Td>
              <Td>
                <Badge status={item.status}>{item.status}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button size="sm" variant="secondary" onClick={() => adjust(item.id, 10)}>
                    +10
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => adjust(item.id, -10)}>
                    -10
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
