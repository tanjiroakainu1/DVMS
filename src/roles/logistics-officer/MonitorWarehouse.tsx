import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'

export function MonitorWarehouse() {
  const { inventory } = useData()
  const warehouses = [...new Set(inventory.map((i) => i.warehouse))]

  return (
    <PageShell
      title="Monitor Warehouse Stock"
      description="Warehouse-level visibility of goods and stock health."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {warehouses.map((wh) => {
          const items = inventory.filter((i) => i.warehouse === wh)
          const low = items.filter((i) => i.status !== 'in-stock').length
          return (
            <StatCard
              key={wh}
              label={wh}
              value={items.length}
              hint={`${low} items need restock`}
            />
          )
        })}
      </div>

      {warehouses.map((wh) => (
        <Panel key={wh} title={wh}>
          <DataTable headers={['Item', 'Category', 'Quantity', 'Status']}>
            {inventory
              .filter((i) => i.warehouse === wh)
              .map((i) => (
                <tr key={i.id}>
                  <Td>{i.name}</Td>
                  <Td>{i.category}</Td>
                  <Td>
                    {i.quantity} {i.unit}
                  </Td>
                  <Td>
                    <Badge status={i.status}>{i.status}</Badge>
                  </Td>
                </tr>
              ))}
          </DataTable>
        </Panel>
      ))}
    </PageShell>
  )
}
