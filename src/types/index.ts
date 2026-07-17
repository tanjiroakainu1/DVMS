export type UserRole =
  | 'super-admin'
  | 'disaster-coordinator'
  | 'volunteer'
  | 'logistics-officer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive' | 'pending'
  phone?: string
  createdAt: string
}

export interface VolunteerProfile {
  id: string
  userId: string
  name: string
  skills: string[]
  certifications: string[]
  availability: 'available' | 'deployed' | 'unavailable'
  emergencyContact: string
  emergencyPhone: string
  serviceHours: number
}

export interface DisasterCategory {
  id: string
  name: string
  description: string
  severityDefault: 'low' | 'medium' | 'high' | 'critical'
}

export interface DisasterOperation {
  id: string
  title: string
  category: string
  location: string
  status: 'planning' | 'active' | 'completed' | 'suspended'
  coordinator: string
  startDate: string
  volunteersAssigned: number
  description: string
}

export interface EvacuationCenter {
  id: string
  name: string
  location: string
  capacity: number
  occupancy: number
  status: 'open' | 'full' | 'closed'
  volunteersAssigned: number
}

export interface Shift {
  id: string
  operationId: string
  operationTitle: string
  volunteerName: string
  date: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'checked-in' | 'completed' | 'missed'
}

export interface Task {
  id: string
  title: string
  operationTitle: string
  assignedTo: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  warehouse: string
  status: 'in-stock' | 'low' | 'out-of-stock'
}

export interface Equipment {
  id: string
  name: string
  type: string
  status: 'available' | 'in-use' | 'maintenance'
  assignedTo?: string
  location: string
}

export interface Vehicle {
  id: string
  plateNumber: string
  type: string
  status: 'available' | 'deployed' | 'maintenance'
  driver?: string
  destination?: string
}

export interface Donation {
  id: string
  donor: string
  item: string
  quantity: number
  unit: string
  date: string
  status: 'received' | 'distributed' | 'pending'
}

export interface Delivery {
  id: string
  destination: string
  items: string
  vehicle: string
  status: 'scheduled' | 'in-transit' | 'delivered'
  eta: string
}

export interface ActivityLog {
  id: string
  actor: string
  action: string
  module: string
  timestamp: string
}

export interface Alert {
  id: string
  title: string
  message: string
  type: 'emergency' | 'info' | 'reminder'
  date: string
  read: boolean
}

export interface ActivityReport {
  id: string
  volunteerName: string
  operationTitle: string
  summary: string
  date: string
  status: 'submitted' | 'reviewed'
}

export interface NavItem {
  label: string
  path: string
  icon?: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  'super-admin': 'Super Admin',
  'disaster-coordinator': 'Disaster Coordinator',
  volunteer: 'Volunteer',
  'logistics-officer': 'Logistics Officer',
}

export const ROLE_META: Record<
  UserRole,
  { short: string; blurb: string; accent: string }
> = {
  'super-admin': {
    short: 'Admin',
    blurb: 'Users, roles, settings, categories, backups & system reports',
    accent: 'from-navy-900 to-navy-700',
  },
  'disaster-coordinator': {
    short: 'Coordinator',
    blurb: 'Operations, approvals, centers, shifts & deployment monitoring',
    accent: 'from-teal-deep to-teal-600',
  },
  volunteer: {
    short: 'Volunteer',
    blurb: 'Missions, tasks, check-in/out, alerts & service history',
    accent: 'from-sky-700 to-sky-500',
  },
  'logistics-officer': {
    short: 'Logistics',
    blurb: 'Inventory, donations, equipment, warehouse & deliveries',
    accent: 'from-amber-700 to-amber-strong',
  },
}

export const DEMO_ACCOUNTS: Array<{
  email: string
  password: string
  role: UserRole
  name: string
}> = [
  {
    email: 'admin@dvms.gov',
    password: 'admin123',
    role: 'super-admin',
    name: 'System Administrator',
  },
  {
    email: 'coordinator@dvms.gov',
    password: 'coord123',
    role: 'disaster-coordinator',
    name: 'Maria Santos',
  },
  {
    email: 'volunteer@dvms.gov',
    password: 'vol123',
    role: 'volunteer',
    name: 'Juan Dela Cruz',
  },
  {
    email: 'logistics@dvms.gov',
    password: 'log123',
    role: 'logistics-officer',
    name: 'Ana Reyes',
  },
]

export function getDemoAccount(role: UserRole) {
  return DEMO_ACCOUNTS.find((a) => a.role === role)!
}
