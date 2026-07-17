import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'

export function MonitorDistribution() {
  const { deliveries, donations, inventory } = useData()

  return (
    <PageShell
      title="Monitor Relief Distribution"
      description="Track outgoing deliveries and donation fulfillment against warehouse stock."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Delivered"
          value={deliveries.filter((d) => d.status === 'delivered').length}
        />
        <StatCard
          label="In Transit"
          value={deliveries.filter((d) => d.status === 'in-transit').length}
        />
        <StatCard
          label="Distributed Donations"
          value={donations.filter((d) => d.status === 'distributed').length}
        />
      </div>

      <Panel title="Distribution Pipeline">
        <DataTable headers={['Destination', 'Items', 'Vehicle', 'ETA', 'Status']}>
          {deliveries.map((d) => (
            <tr key={d.id}>
              <Td>{d.destination}</Td>
              <Td>{d.items}</Td>
              <Td>{d.vehicle}</Td>
              <Td>{d.eta}</Td>
              <Td>
                <Badge status={d.status}>{d.status}</Badge>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Stock Supporting Distribution">
        <DataTable headers={['Item', 'Qty', 'Status']}>
          {inventory.map((i) => (
            <tr key={i.id}>
              <Td>{i.name}</Td>
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
    </PageShell>
  )
}
