import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Field, FieldInput, FormActions, FormGrid } from '../../components/ui/FormField'

export function RegisterVolunteer() {
  const { user } = useAuth()
  const { volunteerProfiles, setVolunteerProfiles, notify, addLog } = useData()
  const existing = volunteerProfiles.find(
    (v) => v.userId === user?.id || v.name === user?.name,
  )
  const [form, setForm] = useState({
    skills: existing?.skills.join(', ') ?? 'First Aid, Relief Packing',
    certifications: existing?.certifications.join(', ') ?? '',
    emergencyContact: existing?.emergencyContact ?? '',
    emergencyPhone: existing?.emergencyPhone ?? '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (existing) {
      setVolunteerProfiles((prev) =>
        prev.map((v) =>
          v.id === existing.id
            ? {
                ...v,
                skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
                certifications: form.certifications
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                emergencyContact: form.emergencyContact,
                emergencyPhone: form.emergencyPhone,
              }
            : v,
        ),
      )
      notify('Volunteer registration details updated.')
    } else {
      setVolunteerProfiles((prev) => [
        ...prev,
        {
          id: `vp-${Date.now()}`,
          userId: user.id,
          name: user.name,
          skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
          certifications: form.certifications
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          availability: 'available',
          emergencyContact: form.emergencyContact,
          emergencyPhone: form.emergencyPhone,
          serviceHours: 0,
        },
      ])
      addLog({
        actor: user.name,
        action: 'Submitted volunteer registration profile',
        module: 'Volunteer Registration',
      })
      notify('Volunteer profile registered.')
    }
  }

  return (
    <PageShell
      title="Register as a Volunteer"
      description="Complete your volunteer registration with skills, certifications, and emergency contacts."
    >
      <Panel title="Volunteer Registration Form">
        <form onSubmit={submit}>
          <FormGrid>
            <Field label="Skills" className="sm:col-span-2">
              <FieldInput
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="Comma-separated skills"
              />
            </Field>
            <Field label="Certifications" className="sm:col-span-2">
              <FieldInput
                value={form.certifications}
                onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                placeholder="Comma-separated certifications"
              />
            </Field>
            <Field label="Emergency Contact">
              <FieldInput
                value={form.emergencyContact}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                required
              />
            </Field>
            <Field label="Emergency Phone">
              <FieldInput
                value={form.emergencyPhone}
                onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                required
              />
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                {existing ? 'Update Registration' : 'Submit Registration'}
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>
    </PageShell>
  )
}
