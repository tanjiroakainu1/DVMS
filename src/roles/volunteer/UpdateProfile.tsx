import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { PageShell, Panel, EmptyState } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Field, FieldInput, FieldSelect, FormActions, FormGrid } from '../../components/ui/FormField'

export function UpdateProfile() {
  const { user } = useAuth()
  const { volunteerProfiles, setVolunteerProfiles, notify } = useData()
  const profile = volunteerProfiles.find(
    (v) => v.userId === user?.id || v.name === user?.name,
  )
  const [availability, setAvailability] = useState(
    profile?.availability ?? 'available',
  )
  const [skills, setSkills] = useState(profile?.skills.join(', ') ?? '')

  if (!profile) {
    return (
      <PageShell title="Update Volunteer Profile">
        <EmptyState message="No volunteer profile found. Complete registration first." />
      </PageShell>
    )
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    setVolunteerProfiles((prev) =>
      prev.map((v) =>
        v.id === profile.id
          ? {
              ...v,
              availability: availability as typeof v.availability,
              skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
            }
          : v,
      ),
    )
    notify('Profile updated.')
  }

  return (
    <PageShell
      title="Update Volunteer Profile and Skills"
      description="Keep your availability status and skill set current for mission matching."
    >
      <Panel title="Profile">
        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          <span>
            Name: <strong>{profile.name}</strong>
          </span>
          <span>
            Hours: <strong>{profile.serviceHours}</strong>
          </span>
          <Badge status={profile.availability}>{profile.availability}</Badge>
        </div>
        <form onSubmit={save}>
          <FormGrid>
            <Field label="Availability">
              <FieldSelect
                value={availability}
                onChange={(e) => setAvailability(e.target.value as typeof availability)}
              >
                <option value="available">Available</option>
                <option value="deployed">Deployed</option>
                <option value="unavailable">Unavailable</option>
              </FieldSelect>
            </Field>
            <Field label="Skills">
              <FieldInput
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </Field>
            <FormActions>
              <Button type="submit" className="w-full min-[420px]:w-auto">
                Save Profile
              </Button>
            </FormActions>
          </FormGrid>
        </form>
      </Panel>
    </PageShell>
  )
}
