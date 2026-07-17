import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import {
  initialAlerts,
  initialCategories,
  initialCenters,
  initialDeliveries,
  initialDonations,
  initialEquipment,
  initialInventory,
  initialLogs,
  initialOperations,
  initialReports,
  initialShifts,
  initialTasks,
  initialUsers,
  initialVehicles,
  initialVolunteerProfiles,
} from '../data/initialData'
import type {
  ActivityLog,
  ActivityReport,
  Alert,
  Delivery,
  DisasterCategory,
  DisasterOperation,
  Donation,
  Equipment,
  EvacuationCenter,
  InventoryItem,
  Shift,
  Task,
  User,
  Vehicle,
  VolunteerProfile,
} from '../types'

interface DataContextValue {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  categories: DisasterCategory[]
  setCategories: React.Dispatch<React.SetStateAction<DisasterCategory[]>>
  operations: DisasterOperation[]
  setOperations: React.Dispatch<React.SetStateAction<DisasterOperation[]>>
  centers: EvacuationCenter[]
  setCenters: React.Dispatch<React.SetStateAction<EvacuationCenter[]>>
  shifts: Shift[]
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  inventory: InventoryItem[]
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>
  equipment: Equipment[]
  setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>
  vehicles: Vehicle[]
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>
  donations: Donation[]
  setDonations: React.Dispatch<React.SetStateAction<Donation[]>>
  deliveries: Delivery[]
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>
  logs: ActivityLog[]
  addLog: (entry: Omit<ActivityLog, 'id' | 'timestamp'>) => void
  alerts: Alert[]
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>
  reports: ActivityReport[]
  setReports: React.Dispatch<React.SetStateAction<ActivityReport[]>>
  volunteerProfiles: VolunteerProfile[]
  setVolunteerProfiles: React.Dispatch<React.SetStateAction<VolunteerProfile[]>>
  settings: Record<string, string>
  setSettings: React.Dispatch<React.SetStateAction<Record<string, string>>>
  backupHistory: string[]
  setBackupHistory: React.Dispatch<React.SetStateAction<string[]>>
  flash: string | null
  lastSavedAt: number | null
  notify: (message: string) => void
  clearFlash: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export const STORAGE_PREFIX = 'dvms_data_v1_'

function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStoredValue<T>(key: string, value: T) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Persists immediately on every update so redirects, role switches,
 * and refreshes never lose unsaved React state.
 */
function usePersistentState<T>(
  key: string,
  initialValue: T,
  onSave?: () => void,
): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = `${STORAGE_PREFIX}${key}`
  const [value, setValue] = useState<T>(() =>
    readStoredValue(key, initialValue),
  )
  const onSaveRef = useRef(onSave)
  onSaveRef.current = onSave

  const setPersistentValue = useCallback(
    (update: SetStateAction<T>) => {
      setValue((prev) => {
        const next =
          typeof update === 'function'
            ? (update as (previous: T) => T)(prev)
            : update
        writeStoredValue(key, next)
        onSaveRef.current?.()
        return next
      })
    },
    [key],
  )

  useEffect(() => {
    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key !== storageKey || event.newValue === null) return
      try {
        setValue(JSON.parse(event.newValue) as T)
      } catch {
        // Ignore malformed external storage updates.
      }
    }
    window.addEventListener('storage', syncAcrossTabs)
    return () => window.removeEventListener('storage', syncAcrossTabs)
  }, [storageKey])

  return [value, setPersistentValue]
}

const initialSettings: Record<string, string> = {
  agencyName: 'National Disaster Volunteer Agency',
  responseHotline: '911',
  autoApproveVolunteers: 'false',
  backupSchedule: 'Daily 02:00',
  notificationChannel: 'Email + In-app',
}

const initialBackupHistory = [
  '2026-07-13 02:00 — Automated daily backup completed',
  '2026-07-10 14:22 — Manual backup by System Administrator',
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(() => {
    try {
      const stamp = localStorage.getItem(`${STORAGE_PREFIX}last_saved_at`)
      return stamp ? Number(stamp) : null
    } catch {
      return null
    }
  })

  const markSaved = useCallback(() => {
    const stamp = Date.now()
    setLastSavedAt(stamp)
    try {
      localStorage.setItem(`${STORAGE_PREFIX}last_saved_at`, String(stamp))
    } catch {
      // Ignore storage failures.
    }
  }, [])

  const [users, setUsers] = usePersistentState('users', initialUsers, markSaved)
  const [categories, setCategories] = usePersistentState(
    'categories',
    initialCategories,
    markSaved,
  )
  const [operations, setOperations] = usePersistentState(
    'operations',
    initialOperations,
    markSaved,
  )
  const [centers, setCenters] = usePersistentState(
    'centers',
    initialCenters,
    markSaved,
  )
  const [shifts, setShifts] = usePersistentState(
    'shifts',
    initialShifts,
    markSaved,
  )
  const [tasks, setTasks] = usePersistentState('tasks', initialTasks, markSaved)
  const [inventory, setInventory] = usePersistentState(
    'inventory',
    initialInventory,
    markSaved,
  )
  const [equipment, setEquipment] = usePersistentState(
    'equipment',
    initialEquipment,
    markSaved,
  )
  const [vehicles, setVehicles] = usePersistentState(
    'vehicles',
    initialVehicles,
    markSaved,
  )
  const [donations, setDonations] = usePersistentState(
    'donations',
    initialDonations,
    markSaved,
  )
  const [deliveries, setDeliveries] = usePersistentState(
    'deliveries',
    initialDeliveries,
    markSaved,
  )
  const [logs, setLogs] = usePersistentState('logs', initialLogs, markSaved)
  const [alerts, setAlerts] = usePersistentState(
    'alerts',
    initialAlerts,
    markSaved,
  )
  const [reports, setReports] = usePersistentState(
    'reports',
    initialReports,
    markSaved,
  )
  const [volunteerProfiles, setVolunteerProfiles] = usePersistentState(
    'volunteerProfiles',
    initialVolunteerProfiles,
    markSaved,
  )
  const [settings, setSettings] = usePersistentState(
    'settings',
    initialSettings,
    markSaved,
  )
  const [backupHistory, setBackupHistory] = usePersistentState(
    'backupHistory',
    initialBackupHistory,
    markSaved,
  )
  const [flash, setFlash] = useState<string | null>(null)

  const notify = useCallback((message: string) => {
    setFlash(message)
    window.setTimeout(() => setFlash(null), 3200)
  }, [])

  const clearFlash = useCallback(() => setFlash(null), [])

  const addLog = useCallback(
    (entry: Omit<ActivityLog, 'id' | 'timestamp'>) => {
      const now = new Date()
      const stamp = `${now.toISOString().slice(0, 10)} ${now
        .toTimeString()
        .slice(0, 5)}`
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: stamp,
          ...entry,
        },
        ...prev,
      ])
    },
    [setLogs],
  )

  const value = useMemo(
    () => ({
      users,
      setUsers,
      categories,
      setCategories,
      operations,
      setOperations,
      centers,
      setCenters,
      shifts,
      setShifts,
      tasks,
      setTasks,
      inventory,
      setInventory,
      equipment,
      setEquipment,
      vehicles,
      setVehicles,
      donations,
      setDonations,
      deliveries,
      setDeliveries,
      logs,
      addLog,
      alerts,
      setAlerts,
      reports,
      setReports,
      volunteerProfiles,
      setVolunteerProfiles,
      settings,
      setSettings,
      backupHistory,
      setBackupHistory,
      flash,
      lastSavedAt,
      notify,
      clearFlash,
    }),
    [
      users,
      setUsers,
      categories,
      setCategories,
      operations,
      setOperations,
      centers,
      setCenters,
      shifts,
      setShifts,
      tasks,
      setTasks,
      inventory,
      setInventory,
      equipment,
      setEquipment,
      vehicles,
      setVehicles,
      donations,
      setDonations,
      deliveries,
      setDeliveries,
      logs,
      addLog,
      alerts,
      setAlerts,
      reports,
      setReports,
      volunteerProfiles,
      setVolunteerProfiles,
      settings,
      setSettings,
      backupHistory,
      setBackupHistory,
      flash,
      lastSavedAt,
      notify,
      clearFlash,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
