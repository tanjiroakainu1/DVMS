import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Field, FieldInput, FormActions } from '../../components/ui/FormField'

export function BackupRestore() {
  const { user } = useAuth()
  const {
    notify,
    addLog,
    settings,
    backupHistory,
    setBackupHistory,
  } = useData()
  const [backupNote, setBackupNote] = useState('')

  const createBackup = () => {
    const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const entry = `${stamp} — Manual backup${backupNote ? `: ${backupNote}` : ''}`
    setBackupHistory((prev) => [entry, ...prev])
    addLog({
      actor: user?.name ?? 'Super Admin',
      action: 'Created system backup',
      module: 'Backup',
    })
    notify('Backup created successfully.')
    setBackupNote('')
  }

  const restore = () => {
    addLog({
      actor: user?.name ?? 'Super Admin',
      action: 'Initiated data restore from latest backup',
      module: 'Backup',
    })
    notify('Restore simulated from latest backup snapshot.')
  }

  return (
    <PageShell
      title="Backup and Restore Data"
      description={`Current schedule: ${settings.backupSchedule}. Create manual snapshots or restore the latest backup.`}
    >
      <Panel title="Create Backup">
        <div className="space-y-3">
          <Field label="Optional note">
            <FieldInput
              placeholder="Optional backup note"
              value={backupNote}
              onChange={(e) => setBackupNote(e.target.value)}
            />
          </Field>
          <FormActions>
            <Button onClick={createBackup} className="w-full min-[420px]:w-auto">
              Create Backup
            </Button>
            <Button
              variant="secondary"
              onClick={restore}
              className="w-full min-[420px]:w-auto"
            >
              Restore Latest
            </Button>
          </FormActions>
        </div>
      </Panel>

      <Panel title="Backup History">
        <ul className="space-y-2">
          {backupHistory.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-slate-200 bg-slate-soft/50 px-3 py-2.5 text-sm text-navy-800"
            >
              {item}
            </li>
          ))}
        </ul>
      </Panel>
    </PageShell>
  )
}
