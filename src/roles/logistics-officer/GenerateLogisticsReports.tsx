import { useMemo, useState } from 'react'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { LazyLogisticsReportCharts } from '../../components/charts/LazyDashboardCharts'

export function GenerateLogisticsReports() {
  const { inventory, donations, deliveries, vehicles, equipment } = useData()
  const [output, setOutput] = useState('')

  const report = useMemo(
    () => `Logistics Report
Inventory SKUs: ${inventory.length}
Low/out of stock: ${inventory.filter((i) => i.status !== 'in-stock').length}
Donations: ${donations.length} (distributed: ${donations.filter((d) => d.status === 'distributed').length})
Deliveries: ${deliveries.length} (in-transit: ${deliveries.filter((d) => d.status === 'in-transit').length})
Vehicles available: ${vehicles.filter((v) => v.status === 'available').length}/${vehicles.length}
Equipment available: ${equipment.filter((e) => e.status === 'available').length}/${equipment.length}`,
    [inventory, donations, deliveries, vehicles, equipment],
  )

  return (
    <PageShell
      title="Generate Logistics Reports"
      description="Produce stock, donation, fleet, and delivery summaries for operations."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Inventory Items" value={inventory.length} />
        <StatCard label="Donations" value={donations.length} />
        <StatCard label="Deliveries" value={deliveries.length} />
      </div>

      <LazyLogisticsReportCharts />

      <Panel title="Report Actions">
        <Button
          className="w-full min-[420px]:w-auto"
          onClick={() => {
            setOutput(report)
          }}
        >
          Generate Logistics Report
        </Button>
      </Panel>

      {output ? (
        <Panel title="Report Output">
          <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-navy-950 p-3 text-xs leading-relaxed text-slate-100 sm:p-4 sm:text-sm">
            {output}
          </pre>
        </Panel>
      ) : null}
    </PageShell>
  )
}
