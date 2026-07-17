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

export const initialUsers: User[] = [
  {
    id: 'u1',
    name: 'System Administrator',
    email: 'admin@dvms.gov',
    role: 'super-admin',
    status: 'active',
    phone: '09170000001',
    createdAt: '2025-01-10',
  },
  {
    id: 'u2',
    name: 'Maria Santos',
    email: 'coordinator@dvms.gov',
    role: 'disaster-coordinator',
    status: 'active',
    phone: '09170000002',
    createdAt: '2025-02-14',
  },
  {
    id: 'u3',
    name: 'Juan Dela Cruz',
    email: 'volunteer@dvms.gov',
    role: 'volunteer',
    status: 'active',
    phone: '09170000003',
    createdAt: '2025-03-01',
  },
  {
    id: 'u4',
    name: 'Ana Reyes',
    email: 'logistics@dvms.gov',
    role: 'logistics-officer',
    status: 'active',
    phone: '09170000004',
    createdAt: '2025-03-12',
  },
  {
    id: 'u5',
    name: 'Pedro Garcia',
    email: 'pedro@email.com',
    role: 'volunteer',
    status: 'pending',
    phone: '09171234567',
    createdAt: '2026-07-01',
  },
  {
    id: 'u6',
    name: 'Lisa Mendoza',
    email: 'lisa@email.com',
    role: 'volunteer',
    status: 'pending',
    phone: '09179876543',
    createdAt: '2026-07-08',
  },
]

export const initialCategories: DisasterCategory[] = [
  {
    id: 'c1',
    name: 'Flood',
    description: 'River overflow and urban flooding events',
    severityDefault: 'high',
  },
  {
    id: 'c2',
    name: 'Earthquake',
    description: 'Seismic events and aftershock response',
    severityDefault: 'critical',
  },
  {
    id: 'c3',
    name: 'Typhoon',
    description: 'Storm preparedness and recovery operations',
    severityDefault: 'high',
  },
  {
    id: 'c4',
    name: 'Fire',
    description: 'Structural and wildfire emergency response',
    severityDefault: 'critical',
  },
]

export const initialOperations: DisasterOperation[] = [
  {
    id: 'op1',
    title: 'Typhoon Carina Relief',
    category: 'Typhoon',
    location: 'Marikina City',
    status: 'active',
    coordinator: 'Maria Santos',
    startDate: '2026-07-10',
    volunteersAssigned: 42,
    description: 'Evacuation support, relief packing, and community assistance.',
  },
  {
    id: 'op2',
    title: 'Metro Flood Response',
    category: 'Flood',
    location: 'Pasig City',
    status: 'active',
    coordinator: 'Maria Santos',
    startDate: '2026-07-12',
    volunteersAssigned: 28,
    description: 'Sandbagging, rescue standby, and evacuation center support.',
  },
  {
    id: 'op3',
    title: 'Barangay Fire Recovery',
    category: 'Fire',
    location: 'Quezon City',
    status: 'completed',
    coordinator: 'Maria Santos',
    startDate: '2026-05-20',
    volunteersAssigned: 15,
    description: 'Temporary shelter assistance and donation distribution.',
  },
]

export const initialCenters: EvacuationCenter[] = [
  {
    id: 'ec1',
    name: 'Marikina Sports Center',
    location: 'Marikina City',
    capacity: 500,
    occupancy: 320,
    status: 'open',
    volunteersAssigned: 12,
  },
  {
    id: 'ec2',
    name: 'Pasig City Hall Covered Court',
    location: 'Pasig City',
    capacity: 200,
    occupancy: 200,
    status: 'full',
    volunteersAssigned: 8,
  },
  {
    id: 'ec3',
    name: 'QC Memorial Coliseum',
    location: 'Quezon City',
    capacity: 800,
    occupancy: 0,
    status: 'closed',
    volunteersAssigned: 0,
  },
]

export const initialShifts: Shift[] = [
  {
    id: 'sh1',
    operationId: 'op1',
    operationTitle: 'Typhoon Carina Relief',
    volunteerName: 'Juan Dela Cruz',
    date: '2026-07-14',
    startTime: '08:00',
    endTime: '16:00',
    status: 'scheduled',
  },
  {
    id: 'sh2',
    operationId: 'op2',
    operationTitle: 'Metro Flood Response',
    volunteerName: 'Juan Dela Cruz',
    date: '2026-07-15',
    startTime: '06:00',
    endTime: '14:00',
    status: 'scheduled',
  },
]

export const initialTasks: Task[] = [
  {
    id: 't1',
    title: 'Assist relief packing',
    operationTitle: 'Typhoon Carina Relief',
    assignedTo: 'Juan Dela Cruz',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-07-14',
  },
  {
    id: 't2',
    title: 'Support registration desk',
    operationTitle: 'Metro Flood Response',
    assignedTo: 'Juan Dela Cruz',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2026-07-15',
  },
]

export const initialInventory: InventoryItem[] = [
  {
    id: 'inv1',
    name: 'Rice sacks',
    category: 'Food',
    quantity: 240,
    unit: 'sacks',
    warehouse: 'Warehouse A',
    status: 'in-stock',
  },
  {
    id: 'inv2',
    name: 'Bottled water',
    category: 'Water',
    quantity: 45,
    unit: 'boxes',
    warehouse: 'Warehouse A',
    status: 'low',
  },
  {
    id: 'inv3',
    name: 'Hygiene kits',
    category: 'Hygiene',
    quantity: 0,
    unit: 'kits',
    warehouse: 'Warehouse B',
    status: 'out-of-stock',
  },
  {
    id: 'inv4',
    name: 'Blankets',
    category: 'Shelter',
    quantity: 180,
    unit: 'pcs',
    warehouse: 'Warehouse B',
    status: 'in-stock',
  },
]

export const initialEquipment: Equipment[] = [
  {
    id: 'eq1',
    name: 'Generator Unit 3',
    type: 'Power',
    status: 'in-use',
    assignedTo: 'Typhoon Carina Relief',
    location: 'Marikina Sports Center',
  },
  {
    id: 'eq2',
    name: 'Water Pump XP-2',
    type: 'Rescue',
    status: 'available',
    location: 'Warehouse A',
  },
  {
    id: 'eq3',
    name: 'Radio Set Bundle',
    type: 'Communication',
    status: 'maintenance',
    location: 'Warehouse B',
  },
]

export const initialVehicles: Vehicle[] = [
  {
    id: 'v1',
    plateNumber: 'ABC-1234',
    type: 'Relief Truck',
    status: 'deployed',
    driver: 'Carlos Lim',
    destination: 'Marikina Sports Center',
  },
  {
    id: 'v2',
    plateNumber: 'XYZ-5678',
    type: 'Ambulance',
    status: 'available',
  },
  {
    id: 'v3',
    plateNumber: 'DEF-9012',
    type: 'Van',
    status: 'maintenance',
  },
]

export const initialDonations: Donation[] = [
  {
    id: 'd1',
    donor: 'ABC Foundation',
    item: 'Canned goods',
    quantity: 500,
    unit: 'cans',
    date: '2026-07-11',
    status: 'received',
  },
  {
    id: 'd2',
    donor: 'City Marketplace',
    item: 'Bottled water',
    quantity: 100,
    unit: 'boxes',
    date: '2026-07-12',
    status: 'distributed',
  },
]

export const initialDeliveries: Delivery[] = [
  {
    id: 'del1',
    destination: 'Marikina Sports Center',
    items: 'Rice x40, Water x20',
    vehicle: 'ABC-1234',
    status: 'in-transit',
    eta: '2026-07-14 14:30',
  },
  {
    id: 'del2',
    destination: 'Pasig Covered Court',
    items: 'Blankets x50, Hygiene kits x30',
    vehicle: 'XYZ-5678',
    status: 'scheduled',
    eta: '2026-07-14 17:00',
  },
]

export const initialLogs: ActivityLog[] = [
  {
    id: 'log1',
    actor: 'System Administrator',
    action: 'Updated system backup schedule',
    module: 'Administration',
    timestamp: '2026-07-14 09:12',
  },
  {
    id: 'log2',
    actor: 'Maria Santos',
    action: 'Created operation Typhoon Carina Relief',
    module: 'Operations',
    timestamp: '2026-07-10 08:00',
  },
  {
    id: 'log3',
    actor: 'Ana Reyes',
    action: 'Recorded donation from ABC Foundation',
    module: 'Logistics',
    timestamp: '2026-07-11 15:20',
  },
]

export const initialAlerts: Alert[] = [
  {
    id: 'a1',
    title: 'Emergency Deployment',
    message: 'Report to Marikina Sports Center by 08:00 for Typhoon Carina Relief.',
    type: 'emergency',
    date: '2026-07-14 06:00',
    read: false,
  },
  {
    id: 'a2',
    title: 'Shift Reminder',
    message: 'Your Metro Flood Response shift starts tomorrow at 06:00.',
    type: 'reminder',
    date: '2026-07-13 18:00',
    read: false,
  },
  {
    id: 'a3',
    title: 'Operation Update',
    message: 'Additional sandbags arriving at Pasig center this afternoon.',
    type: 'info',
    date: '2026-07-13 12:00',
    read: true,
  },
]

export const initialReports: ActivityReport[] = [
  {
    id: 'ar1',
    volunteerName: 'Juan Dela Cruz',
    operationTitle: 'Barangay Fire Recovery',
    summary: 'Assisted with donation sorting and shelter intake for 4 hours.',
    date: '2026-05-22',
    status: 'reviewed',
  },
]

export const initialVolunteerProfiles: VolunteerProfile[] = [
  {
    id: 'vp1',
    userId: 'u3',
    name: 'Juan Dela Cruz',
    skills: ['First Aid', 'Crowd Management', 'Relief Packing'],
    certifications: ['BLS Certified', 'Disaster Response Training'],
    availability: 'available',
    emergencyContact: 'Rosa Dela Cruz',
    emergencyPhone: '09181112222',
    serviceHours: 86,
  },
]
