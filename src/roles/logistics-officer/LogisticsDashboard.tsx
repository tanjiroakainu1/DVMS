import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'
import { LazyLogisticsCharts } from '../../components/charts/LazyDashboardCharts'

export const logisticsNav = [
  { label: 'Dashboard', path: '' },
  { label: 'Inventory', path: 'manage-inventory' },
  { label: 'Allocate', path: 'allocate-supplies' },
  { label: 'Equipment', path: 'track-equipment' },
  { label: 'Distribution', path: 'monitor-distribution' },
  { label: 'Donations', path: 'record-donations' },
  { label: 'Reports', path: 'generate-logistics-reports' },
  { label: 'Warehouse', path: 'monitor-warehouse' },
  { label: 'Deliveries', path: 'coordinate-deliveries' },
]

export function LogisticsDashboard() {
  const { inventory, donations, deliveries, vehicles } = useData()
  const lowStock = inventory.filter((i) => i.status !== 'in-stock').length

  return (
    <PageShell
      title="Logistics Officer Dashboard"
      description="Inventory, allocation, equipment, donations, and delivery coordination."
      actions={
        <>
          <Link to="manage-inventory" className="w-full min-[420px]:w-auto">
            <Button className="w-full min-[420px]:w-auto">Manage Inventory</Button>
          </Link>
          <Link to="coordinate-deliveries" className="w-full min-[420px]:w-auto">
            <Button variant="secondary" className="w-full min-[420px]:w-auto">
              Deliveries
            </Button>
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="SKU Items" value={inventory.length} />
        <StatCard label="Low / Out Stock" value={lowStock} hint="Needs attention" />
        <StatCard label="Donations" value={donations.length} />
        <StatCard
          label="In-Transit"
          value={deliveries.filter((d) => d.status === 'in-transit').length}
        />
      </div>

      <LazyLogisticsCharts />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Logistics Actions">
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
            {logisticsNav.slice(1).map((item) => (
              <Link key={item.path} to={item.path}>
                <Button variant="secondary" className="w-full justify-start">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Fleet Snapshot">
          <DataTable headers={['Plate', 'Type', 'Status']}>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <Td>{v.plateNumber}</Td>
                <Td>{v.type}</Td>
                <Td>
                  <Badge status={v.status}>{v.status}</Badge>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </div>
    </PageShell>
  )
}
