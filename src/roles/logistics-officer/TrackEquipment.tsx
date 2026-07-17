import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ActionCell, DataTable, Td } from '../../components/ui/DataTable'
import type { Equipment, Vehicle } from '../../types'

export function TrackEquipment() {
  const { equipment, setEquipment, vehicles, setVehicles, notify } = useData()

  const setEquipStatus = (id: string, status: Equipment['status']) => {
    setEquipment((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e)),
    )
    notify(`Equipment status set to ${status}.`)
  }

  const setVehicleStatus = (id: string, status: Vehicle['status']) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v)),
    )
    notify(`Vehicle status set to ${status}.`)
  }

  return (
    <PageShell
      title="Track Equipment and Vehicles"
      description="Monitor equipment availability and vehicle deployment readiness."
    >
      <Panel title="Equipment">
        <DataTable headers={['Name', 'Type', 'Location', 'Status', 'Actions']}>
          {equipment.map((e) => (
            <tr key={e.id}>
              <Td>{e.name}</Td>
              <Td>{e.type}</Td>
              <Td>{e.location}</Td>
              <Td>
                <Badge status={e.status}>{e.status}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => setEquipStatus(e.id, 'available')}
                  >
                    Available
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEquipStatus(e.id, 'in-use')}
                  >
                    In Use
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setEquipStatus(e.id, 'maintenance')}
                  >
                    Maintenance
                  </Button>
                </ActionCell>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Vehicles">
        <DataTable headers={['Plate', 'Type', 'Destination', 'Status', 'Actions']}>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <Td>{v.plateNumber}</Td>
              <Td>{v.type}</Td>
              <Td>{v.destination ?? '—'}</Td>
              <Td>
                <Badge status={v.status}>{v.status}</Badge>
              </Td>
              <Td>
                <ActionCell>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => setVehicleStatus(v.id, 'available')}
                  >
                    Available
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setVehicleStatus(v.id, 'deployed')}
                  >
                    Deploy
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
