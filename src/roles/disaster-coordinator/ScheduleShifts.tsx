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

export function ScheduleShifts() {
  const { user } = useAuth()
  const { operations, volunteerProfiles, shifts, setShifts, notify, addLog } =
    useData()
  const [form, setForm] = useState({
    operationId: operations[0]?.id ?? '',
    volunteerName: volunteerProfiles[0]?.name ?? '',
    date: new Date().toISOString().slice(0, 10),
    startTime: '08:00',
    endTime: '16:00',
  })

  const schedule = (e: React.FormEvent) => {
    e.preventDefault()
    const op = operations.find((o) => o.id === form.operationId)
    if (!op) return
    setShifts((prev) => [
      {
        id: `sh-${Date.now()}`,
        operationId: op.id,
        operationTitle: op.title,
        volunteerName: form.volunteerName,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        status: 'scheduled',
      },
      ...prev,
    ])
    addLog({
      actor: user?.name ?? 'Coordinator',
      action: `Scheduled shift for ${form.volunteerName} on ${form.date}`,
      module: 'Shifts',
    })
    notify('Shift scheduled.')
  }

  return (
    <PageShell
      title="Schedule Volunteer Shifts"
      description="Create shift schedules for deployed volunteers across operations."
    >
      <Panel title="New Shift">
        <form onSubmit={schedule}>
          <FormGrid cols={3}>
            <Field label="Operation">
              <FieldSelect
                value={form.operationId}
                onChange={(e) => setForm({ ...form, operationId: e.target.value })}
              >
                {operations.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.title}
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <Field label="Volunteer">
              <FieldSelect
                value={form.volunteerName}
                onChange={(e) =>
                  setForm({ ...form, volunteerName: e.target.value })
                }
              >
                {volunteerProfiles.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <Field label="Date">
              <FieldInput
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <Field label="Start time">
              <FieldInput
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </Field>
            <Field label="End time">
              <FieldInput
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Add
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>

      <Panel title="Shift Schedule">
        <DataTable
          headers={['Volunteer', 'Operation', 'Date', 'Time', 'Status']}
        >
          {shifts.map((s) => (
            <tr key={s.id}>
              <Td>{s.volunteerName}</Td>
              <Td>{s.operationTitle}</Td>
              <Td>{s.date}</Td>
              <Td>
                {s.startTime} – {s.endTime}
              </Td>
              <Td>
                <Badge status={s.status}>{s.status}</Badge>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </PageShell>
  )
}
