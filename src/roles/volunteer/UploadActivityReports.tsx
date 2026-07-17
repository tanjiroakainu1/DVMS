import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, StatCard } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { DataTable, Td } from '../../components/ui/DataTable'
import { LazyActivityReportCharts } from '../../components/charts/LazyDashboardCharts'
import {
  Field,
  FieldSelect,
  FieldTextarea,
  FormActions,
  FormGrid,
} from '../../components/ui/FormField'

export function UploadActivityReports() {
  const { user } = useAuth()
  const { operations, reports, setReports, notify, addLog } = useData()
  const [form, setForm] = useState({
    operationTitle: operations[0]?.title ?? '',
    summary: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setReports((prev) => [
      {
        id: `ar-${Date.now()}`,
        volunteerName: user?.name ?? 'Volunteer',
        operationTitle: form.operationTitle,
        summary: form.summary,
        date: new Date().toISOString().slice(0, 10),
        status: 'submitted',
      },
      ...prev,
    ])
    addLog({
      actor: user?.name ?? 'Volunteer',
      action: `Uploaded activity report for ${form.operationTitle}`,
      module: 'Activity Reports',
    })
    notify('Activity report submitted.')
    setForm({ ...form, summary: '' })
  }

  const mine = reports.filter((r) => r.volunteerName === user?.name)

  return (
    <PageShell
      title="Upload Activity Reports"
      description="Submit field activity summaries for completed or ongoing deployments."
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="My Reports"
          value={mine.length}
          hint="Field evidence submitted"
        />
        <StatCard
          label="Reviewed"
          value={mine.filter((report) => report.status === 'reviewed').length}
          hint="Coordinator verified"
        />
        <StatCard
          label="Operations"
          value={new Set(mine.map((report) => report.operationTitle)).size}
          hint="Deployments documented"
        />
        <StatCard
          label="Pending Review"
          value={mine.filter((report) => report.status === 'submitted').length}
          hint="Awaiting verification"
        />
      </div>

      <LazyActivityReportCharts />

      <Panel title="New Activity Report">
        <form onSubmit={submit}>
          <FormGrid>
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
            <Field label="Activity summary" className="sm:col-span-2">
              <FieldTextarea
                rows={4}
                placeholder="Describe activities performed..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                required
              />
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Submit Report
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="My Submitted Reports">
        <DataTable headers={['Date', 'Operation', 'Summary', 'Status']}>
          {mine.map((r) => (
            <tr key={r.id}>
              <Td>{r.date}</Td>
              <Td>{r.operationTitle}</Td>
              <Td>{r.summary}</Td>
              <Td>
                <Badge status={r.status}>{r.status}</Badge>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </PageShell>
  )
}
