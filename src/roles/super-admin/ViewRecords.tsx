import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'

export function ViewRecords() {
  const { operations, volunteerProfiles, donations, centers } = useData()

  return (
    <PageShell
      title="View All Records"
      description="Cross-module visibility of volunteers, operations, centers, and donations."
    >
      <Panel title="Operations">
        <DataTable headers={['Title', 'Category', 'Location', 'Status', 'Volunteers']}>
          {operations.map((op) => (
            <tr key={op.id}>
              <Td>{op.title}</Td>
              <Td>{op.category}</Td>
              <Td>{op.location}</Td>
              <Td>
                <Badge status={op.status}>{op.status}</Badge>
              </Td>
              <Td>{op.volunteersAssigned}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Volunteers">
        <DataTable headers={['Name', 'Availability', 'Skills', 'Service Hours']}>
          {volunteerProfiles.map((v) => (
            <tr key={v.id}>
              <Td>{v.name}</Td>
              <Td>
                <Badge status={v.availability}>{v.availability}</Badge>
              </Td>
              <Td>{v.skills.join(', ')}</Td>
              <Td>{v.serviceHours}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Evacuation Centers">
          <DataTable headers={['Name', 'Occupancy', 'Status']}>
            {centers.map((c) => (
              <tr key={c.id}>
                <Td>{c.name}</Td>
                <Td>
                  {c.occupancy}/{c.capacity}
                </Td>
                <Td>
                  <Badge status={c.status}>{c.status}</Badge>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
        <Panel title="Donations">
          <DataTable headers={['Donor', 'Item', 'Status']}>
            {donations.map((d) => (
              <tr key={d.id}>
                <Td>{d.donor}</Td>
                <Td>
                  {d.item} ({d.quantity} {d.unit})
                </Td>
                <Td>
                  <Badge status={d.status}>{d.status}</Badge>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </div>
    </PageShell>
  )
}
