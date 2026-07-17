import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { useLocation } from 'react-router-dom'
import {
  Bot,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Code2,
  ExternalLink,
  Globe2,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import {
  answerSystemQuestion,
  QUICK_QUESTIONS,
  type AssistantAudience,
  type AssistantSnapshot,
} from '../../data/assistantEngine'
import { ROLE_LABELS } from '../../types'

interface ChatMessage {
  id: string
  sender: 'assistant' | 'user'
  text: string
  source?: { label: string; url: string }
}

const SHARED_SYSTEM_PROMPTS = [
  'How does this system work?',
  'What can each role do?',
  'What modules are included in DVMS?',
  'Show me the demo login options.',
]

function welcomeMessage(audience: AssistantAudience, name?: string): ChatMessage {
  const role =
    audience === 'public' ? 'visitor' : ROLE_LABELS[audience].toLowerCase()
  return {
    id: 'welcome',
    sender: 'assistant',
    text: `Hello${name ? `, ${name}` : ''}! I’m DVMS Copilot, your ${role} assistant.\n\nAsk about DVMS modules, live dashboard data, your role workflow, or preparedness topics. Use the role-specific quick questions below — they map to real system features.`,
  }
}

async function lookupPublicKnowledge(question: string) {
  const endpoint = new URL('https://en.wikipedia.org/w/api.php')
  endpoint.search = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: question,
    gsrlimit: '1',
    prop: 'extracts|info',
    exintro: '1',
    explaintext: '1',
    exsentences: '4',
    inprop: 'url',
    format: 'json',
    origin: '*',
  }).toString()

  const response = await fetch(endpoint, { signal: AbortSignal.timeout(7000) })
  if (!response.ok) throw new Error('Public knowledge lookup failed')
  const payload = (await response.json()) as {
    query?: {
      pages?: Record<
        string,
        { title?: string; extract?: string; fullurl?: string }
      >
    }
  }
  const page = Object.values(payload.query?.pages ?? {})[0]
  if (!page?.extract) throw new Error('No public result found')
  return {
    text: `${page.title ?? 'Public knowledge'}\n\n${page.extract}`,
    source: {
      label: `Wikipedia · ${page.title ?? 'Source'}`,
      url: page.fullurl ?? `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(question)}`,
    },
  }
}

export function AIAssistant() {
  const { user } = useAuth()
  const data = useData()
  const location = useLocation()
  const audience: AssistantAudience = user?.role ?? 'public'
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [showAllPrompts, setShowAllPrompts] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    welcomeMessage(audience, user?.name),
  ])
  const endRef = useRef<HTMLDivElement>(null)

  const snapshot = useMemo<AssistantSnapshot>(() => {
    const profile = data.volunteerProfiles.find(
      (item) => item.userId === user?.id || item.name === user?.name,
    )
    return {
      userName: user?.name,
      agencyName: data.settings.agencyName ?? 'DVMS',
      activeOperations: data.operations
        .filter((item) => item.status === 'active')
        .map((item) => ({
          title: item.title,
          location: item.location,
          volunteers: item.volunteersAssigned,
          category: item.category,
        })),
      operationsCount: data.operations.length,
      completedOperations: data.operations.filter(
        (item) => item.status === 'completed',
      ).length,
      pendingVolunteers: data.users
        .filter(
          (item) => item.role === 'volunteer' && item.status === 'pending',
        )
        .map((item) => item.name),
      volunteerCount: data.volunteerProfiles.length,
      deployedVolunteers: data.volunteerProfiles.filter(
        (item) => item.availability === 'deployed',
      ).length,
      availableVolunteers: data.volunteerProfiles.filter(
        (item) => item.availability === 'available',
      ).length,
      openCenters: data.centers
        .filter((item) => item.status === 'open' || item.status === 'full')
        .map((item) => ({
          name: item.name,
          occupancy: item.occupancy,
          capacity: item.capacity,
        })),
      fullCenters: data.centers
        .filter((item) => item.status === 'full')
        .map((item) => item.name),
      closedCenters: data.centers
        .filter((item) => item.status === 'closed')
        .map((item) => item.name),
      categories: data.categories.map((item) => item.name),
      tasks: data.tasks.map((item) => ({
        title: item.title,
        operation: item.operationTitle,
        status: item.status,
        assignee: item.assignedTo,
        priority: item.priority,
      })),
      shifts: data.shifts.map((item) => ({
        operation: item.operationTitle,
        volunteer: item.volunteerName,
        date: item.date,
        status: item.status,
        startTime: item.startTime,
        endTime: item.endTime,
      })),
      inventory: data.inventory.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        status: item.status,
        warehouse: item.warehouse,
      })),
      lowStock: data.inventory
        .filter((item) => item.status !== 'in-stock')
        .map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          status: item.status,
        })),
      equipment: data.equipment.map((item) => ({
        name: item.name,
        type: item.type,
        status: item.status,
        location: item.location,
      })),
      maintenanceEquipment: data.equipment
        .filter((item) => item.status === 'maintenance')
        .map((item) => item.name),
      deliveries: data.deliveries.map((item) => ({
        destination: item.destination,
        items: item.items,
        status: item.status,
        eta: item.eta,
        vehicle: item.vehicle,
      })),
      availableVehicles: data.vehicles.filter(
        (item) => item.status === 'available',
      ).length,
      deployedVehicles: data.vehicles.filter(
        (item) => item.status === 'deployed',
      ).length,
      vehiclesCount: data.vehicles.length,
      donationsCount: data.donations.length,
      receivedDonations: data.donations.filter(
        (item) => item.status === 'received',
      ).length,
      distributedDonations: data.donations.filter(
        (item) => item.status === 'distributed',
      ).length,
      unreadAlerts: data.alerts
        .filter((item) => !item.read)
        .map((item) => ({
          title: item.title,
          message: item.message,
          type: item.type,
        })),
      serviceHours: profile?.serviceHours ?? 0,
      skills: profile?.skills ?? [],
      certifications: profile?.certifications ?? [],
      availability: profile?.availability,
      usersCount: data.users.length,
      activeUsersCount: data.users.filter((item) => item.status === 'active')
        .length,
      inactiveUsersCount: data.users.filter((item) => item.status !== 'active')
        .length,
      reportsCount: data.reports.length,
      submittedReports: data.reports.filter(
        (item) => item.status === 'submitted',
      ).length,
      logsCount: data.logs.length,
      recentLogs: data.logs
        .slice(0, 5)
        .map((item) => `${item.timestamp}: ${item.actor} — ${item.action}`),
      backupSchedule: data.settings.backupSchedule ?? 'Not configured',
      hotline: data.settings.responseHotline ?? 'your local emergency number',
      notificationChannel:
        data.settings.notificationChannel ?? 'In-app notifications',
      autoApproveVolunteers:
        data.settings.autoApproveVolunteers ?? 'false',
    }
  }, [data, user])

  const prompts = useMemo(
    () =>
      Array.from(
        new Set([
          ...QUICK_QUESTIONS[audience],
          ...(audience === 'public' ? SHARED_SYSTEM_PROMPTS : []),
        ]),
      ),
    [audience],
  )

  useEffect(() => {
    setMessages([welcomeMessage(audience, user?.name)])
    setShowAllPrompts(false)
  }, [audience, user?.name])

  useEffect(() => {
    setOpen(false)
    setShowAllPrompts(false)
  }, [location.pathname])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const ask = async (question: string) => {
    const clean = question.trim()
    if (!clean || thinking) return

    setInput('')
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, sender: 'user', text: clean },
    ])
    setThinking(true)

    const systemAnswer = answerSystemQuestion(clean, audience, snapshot)
    if (systemAnswer) {
      await new Promise((resolve) => window.setTimeout(resolve, 320))
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: systemAnswer,
        },
      ])
      setThinking(false)
      return
    }

    try {
      const result = await lookupPublicKnowledge(clean)
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: `I didn’t find this in DVMS, so I checked a public reference.\n\n${result.text}`,
          source: result.source,
        },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text:
            'I couldn’t find that in the DVMS knowledge base, and public lookup is currently unavailable. I can still help with system workflows, current dashboard data, volunteer operations, logistics, or disaster preparedness.\n\nFor urgent or high-risk decisions, verify information with your local disaster authority or emergency service.',
        },
      ])
    } finally {
      setThinking(false)
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    void ask(input)
  }

  const reset = () => {
    setMessages([welcomeMessage(audience, user?.name)])
    setInput('')
    setThinking(false)
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group fixed bottom-3 right-3 z-[45] flex items-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-br from-teal-deep via-teal-700 to-navy-900 p-2 text-white shadow-2xl shadow-navy-950/30 transition hover:-translate-y-1 hover:shadow-teal-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 sm:bottom-6 sm:right-6 sm:p-2.5 sm:pr-4"
          aria-label="Open DVMS Copilot"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 sm:h-11 sm:w-11">
            <MessageCircle className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-teal-700 bg-emerald-400" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-100">
              Ask anything
            </span>
            <span className="block text-sm font-bold">DVMS Copilot</span>
          </span>
          <Sparkles className="hidden h-4 w-4 text-amber-200 transition-transform group-hover:rotate-12 group-hover:scale-110 sm:block" />
        </button>
      )}

      {open && (
        <section
          className="fixed bottom-2 left-2 right-2 z-[45] flex h-[min(68dvh,560px)] min-h-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(11,28,44,0.34)] sm:bottom-5 sm:left-auto sm:right-5 sm:h-[min(680px,calc(100dvh-5rem))] sm:w-[min(410px,calc(100vw-2.5rem))] sm:rounded-3xl"
          aria-label="DVMS Copilot chat"
        >
          <header className="relative shrink-0 overflow-hidden bg-gradient-to-r from-navy-950 via-teal-950 to-navy-900 px-4 py-3.5 text-white">
            <div className="absolute -right-8 -top-12 h-28 w-28 rounded-full bg-teal-400/20 blur-2xl" />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 shadow-inner">
                  <BrainCircuit className="h-5 w-5 text-teal-200" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-display text-base font-bold">
                      DVMS Copilot
                    </h2>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  </div>
                  <p className="truncate text-[11px] text-slate-300">
                    System data + disaster guidance + public knowledge
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={reset}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Clear conversation"
                  title="Clear conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close assistant"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="relative mt-3 hidden gap-2 overflow-x-auto min-[360px]:flex">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-teal-400/10 px-2.5 py-1 text-[10px] font-bold text-teal-100">
                <Bot className="h-3 w-3" /> Role-aware
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sky-400/10 px-2.5 py-1 text-[10px] font-bold text-sky-100">
                <Globe2 className="h-3 w-3" /> Public lookup
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-100">
                <Sparkles className="h-3 w-3" /> {audience === 'public' ? 'Visitor' : ROLE_LABELS[audience]}
              </span>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-3 py-4 sm:px-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'assistant' && (
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-deep to-navy-900 text-white shadow-sm">
                      <Bot className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <div
                    className={`max-w-[84%] rounded-2xl px-3.5 py-3 text-sm leading-relaxed shadow-sm ${
                      message.sender === 'user'
                        ? 'rounded-br-md bg-navy-900 text-white'
                        : 'rounded-bl-md border border-slate-200 bg-white text-navy-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    {message.source && (
                      <a
                        href={message.source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-2 py-1 text-[11px] font-bold text-sky-700 hover:bg-sky-100"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {message.source.label}
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-deep to-navy-900 text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-deep"
                        style={{ animationDelay: `${dot * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-200 bg-white">
            <div className="hidden px-3 pt-3 min-[340px]:block sm:px-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-steel">
                  Quick questions for {audience === 'public' ? 'visitors' : ROLE_LABELS[audience]}
                </p>
                <button
                  type="button"
                  onClick={() => setShowAllPrompts((value) => !value)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-deep"
                >
                  {showAllPrompts ? 'Less' : `All ${prompts.length}`}
                  {showAllPrompts ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronUp className="h-3 w-3" />
                  )}
                </button>
              </div>
              <div
                className={`nav-scroll flex gap-2 overflow-x-auto pb-2 ${
                  showAllPrompts
                    ? 'max-h-40 flex-wrap content-start overflow-y-auto'
                    : 'flex-nowrap'
                }`}
              >
                {(showAllPrompts ? prompts : prompts.slice(0, 8)).map(
                  (prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void ask(prompt)}
                      disabled={thinking}
                      className="shrink-0 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-left text-[11px] font-semibold leading-snug text-teal-900 transition hover:border-teal-400 hover:bg-teal-100 disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ),
                )}
              </div>
            </div>

            <form
              onSubmit={submit}
              className="flex items-end gap-2 border-t border-slate-100 p-3 sm:p-4"
            >
              <label className="min-w-0 flex-1">
                <span className="sr-only">Ask DVMS Copilot</span>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      if (input.trim()) void ask(input)
                    }
                  }}
                  rows={1}
                  className="field-input max-h-28 min-h-11 resize-none py-2.5"
                  placeholder="Ask about DVMS or the outside world…"
                />
              </label>
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-deep to-navy-900 text-white shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="flex flex-col items-center justify-center gap-1 px-4 pb-2 text-center text-[9px] leading-relaxed text-slate-400 min-[380px]:flex-row min-[380px]:gap-2">
              <span>
                Verify critical information with official authorities.
              </span>
              <span className="hidden min-[380px]:inline">·</span>
              <span className="inline-flex items-center gap-1 font-semibold text-teal-deep">
                <Code2 className="h-2.5 w-2.5" />
                Built by Raminder Jangao
              </span>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
