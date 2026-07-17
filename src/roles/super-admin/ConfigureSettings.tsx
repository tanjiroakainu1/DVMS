import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Field, FieldInput, FieldSelect, FormGrid } from '../../components/ui/FormField'

export function ConfigureSettings() {
  const { user } = useAuth()
  const { settings, setSettings, notify, addLog } = useData()

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const save = () => {
    addLog({
      actor: user?.name ?? 'Super Admin',
      action: 'Updated disaster response settings',
      module: 'System Settings',
    })
    notify('System settings saved.')
  }

  return (
    <PageShell
      title="Configure Disaster Response Settings"
      description="Agency-wide configuration for response hotlines, approvals, and notifications."
      actions={
        <Button onClick={save} className="w-full min-[420px]:w-auto">
          Save Settings
        </Button>
      }
    >
      <Panel title="General Configuration">
        <FormGrid>
          {Object.entries(settings).map(([key, value]) => (
            <Field key={key} label={key.replace(/([A-Z])/g, ' $1')}>
              {key === 'autoApproveVolunteers' ? (
                <FieldSelect
                  value={value}
                  onChange={(e) => update(key, e.target.value)}
                >
                  <option value="false">Manual approval</option>
                  <option value="true">Auto-approve volunteers</option>
                </FieldSelect>
              ) : (
                <FieldInput
                  value={value}
                  onChange={(e) => update(key, e.target.value)}
                />
              )}
            </Field>
          ))}
        </FormGrid>
      </Panel>
    </PageShell>
  )
}
