import { useData } from '../../context/DataContext'
import { PageShell, Panel, EmptyState } from '../../components/ui/PageShell'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

export function EmergencyAlerts() {
  const { alerts, setAlerts, notify } = useData()

  const markRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a)),
    )
    notify('Alert marked as read.')
  }

  const markAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
    notify('All alerts marked as read.')
  }

  return (
    <PageShell
      title="Emergency Alerts and Notifications"
      description="Receive deployment notices, shift reminders, and operation announcements."
      actions={
        <Button
          variant="secondary"
          onClick={markAll}
          className="w-full min-[420px]:w-auto"
        >
          Mark All Read
        </Button>
      }
    >
      <Panel title="Inbox">
        {alerts.length === 0 ? (
          <EmptyState message="No alerts at this time." />
        ) : (
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li
                key={a.id}
                className={`rounded-2xl border px-3.5 py-3 shadow-sm transition sm:px-4 ${
                  a.read
                    ? 'border-slate-200 bg-white'
                    : 'border-teal-200 bg-teal-soft/40'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-navy-900">{a.title}</h3>
                      <Badge status={a.type}>{a.type}</Badge>
                      {!a.read ? (
                        <Badge status="pending">unread</Badge>
                      ) : null}
                    </div>
                    <p className="break-words text-sm leading-relaxed text-navy-800">{a.message}</p>
                    <p className="mt-1 text-xs text-steel">{a.date}</p>
                  </div>
                  {!a.read ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full min-[420px]:w-auto"
                      onClick={() => markRead(a.id)}
                    >
                      Mark Read
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </PageShell>
  )
}
