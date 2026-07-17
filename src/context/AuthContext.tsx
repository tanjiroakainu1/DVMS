import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEMO_ACCOUNTS, type User, type UserRole } from '../types'
import { useData } from './DataContext'

interface AuthContextValue {
  user: User | null
  login: (
    email: string,
    password: string,
  ) => { ok: boolean; message: string; role?: UserRole }
  logout: () => void
  register: (payload: {
    name: string
    email: string
    password: string
    role: UserRole
    phone?: string
  }) => { ok: boolean; message: string; role?: UserRole }
}

const AuthContext = createContext<AuthContextValue | null>(null)
const SESSION_KEY = 'dvms_session_user'
const PASSWORD_KEY = 'dvms_user_passwords'

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function loadPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PASSWORD_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function writeSession(user: User | null) {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    // Ignore storage failures.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users, setUsers } = useData()
  const [user, setUser] = useState<User | null>(() => loadSession())
  const [passwords, setPasswords] = useState<Record<string, string>>(() =>
    loadPasswords(),
  )

  // Keep the logged-in session aligned with saved user records after redirects.
  useEffect(() => {
    if (!user) return
    const latest = users.find((entry) => entry.id === user.id || entry.email === user.email)
    if (!latest) return
    if (
      latest.name !== user.name ||
      latest.status !== user.status ||
      latest.role !== user.role ||
      latest.phone !== user.phone
    ) {
      setUser(latest)
      writeSession(latest)
    }
  }, [users, user])

  const persistPasswords = useCallback((next: Record<string, string>) => {
    setPasswords(next)
    try {
      localStorage.setItem(PASSWORD_KEY, JSON.stringify(next))
    } catch {
      // Ignore storage failures.
    }
  }, [])

  const login = useCallback(
    (email: string, password: string) => {
      const demo = DEMO_ACCOUNTS.find((a) => a.email === email)
      if (demo) {
        if (demo.password !== password) {
          return { ok: false, message: 'Invalid email or password.' }
        }
        const found =
          users.find((u) => u.email === demo.email) ??
          ({
            id: `demo-${demo.role}`,
            name: demo.name,
            email: demo.email,
            role: demo.role,
            status: 'active',
            createdAt: new Date().toISOString().slice(0, 10),
          } satisfies User)
        setUser(found)
        writeSession(found)
        return { ok: true, message: 'Login successful', role: found.role }
      }

      const existing = users.find((u) => u.email === email)
      if (!existing) {
        return {
          ok: false,
          message: 'Invalid credentials. Use a demo account or registered user.',
        }
      }

      if (existing.status === 'pending') {
        return {
          ok: false,
          message: 'Account pending approval by a Disaster Coordinator.',
        }
      }

      if (existing.status !== 'active') {
        return { ok: false, message: 'Account is inactive.' }
      }

      const stored = passwords[email]
      if (!stored || stored !== password) {
        return { ok: false, message: 'Invalid email or password.' }
      }

      setUser(existing)
      writeSession(existing)
      return { ok: true, message: 'Login successful', role: existing.role }
    },
    [users, passwords],
  )

  const logout = useCallback(() => {
    setUser(null)
    writeSession(null)
  }, [])

  const register = useCallback(
    (payload: {
      name: string
      email: string
      password: string
      role: UserRole
      phone?: string
    }) => {
      if (!payload.password || payload.password.length < 4) {
        return { ok: false, message: 'Password must be at least 4 characters.' }
      }
      if (
        users.some((u) => u.email === payload.email) ||
        DEMO_ACCOUNTS.some((a) => a.email === payload.email)
      ) {
        return { ok: false, message: 'Email already registered.' }
      }
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        status: payload.role === 'volunteer' ? 'pending' : 'active',
        phone: payload.phone,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setUsers((prev) => [...prev, newUser])
      persistPasswords({ ...passwords, [payload.email]: payload.password })

      if (newUser.status === 'active') {
        setUser(newUser)
        writeSession(newUser)
      }

      return {
        ok: true,
        role: newUser.status === 'active' ? newUser.role : undefined,
        message:
          payload.role === 'volunteer'
            ? 'Registration submitted. Await coordinator approval.'
            : 'Account created. You can log in now.',
      }
    },
    [users, setUsers, passwords, persistPasswords],
  )

  const value = useMemo(
    () => ({ user, login, logout, register }),
    [user, login, logout, register],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
