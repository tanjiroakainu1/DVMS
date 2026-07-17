export type AssistantAudience =
  | 'public'
  | 'super-admin'
  | 'disaster-coordinator'
  | 'volunteer'
  | 'logistics-officer'

export interface AssistantSnapshot {
  userName?: string
  agencyName: string
  activeOperations: Array<{
    title: string
    location: string
    volunteers: number
    category: string
  }>
  operationsCount: number
  completedOperations: number
  pendingVolunteers: string[]
  volunteerCount: number
  deployedVolunteers: number
  availableVolunteers: number
  openCenters: Array<{ name: string; occupancy: number; capacity: number }>
  fullCenters: string[]
  closedCenters: string[]
  categories: string[]
  tasks: Array<{
    title: string
    operation: string
    status: string
    assignee: string
    priority: string
  }>
  shifts: Array<{
    operation: string
    volunteer: string
    date: string
    status: string
    startTime: string
    endTime: string
  }>
  inventory: Array<{
    name: string
    quantity: number
    unit: string
    status: string
    warehouse: string
  }>
  lowStock: Array<{ name: string; quantity: number; unit: string; status: string }>
  equipment: Array<{ name: string; type: string; status: string; location: string }>
  maintenanceEquipment: string[]
  deliveries: Array<{
    destination: string
    items: string
    status: string
    eta: string
    vehicle: string
  }>
  availableVehicles: number
  deployedVehicles: number
  vehiclesCount: number
  donationsCount: number
  receivedDonations: number
  distributedDonations: number
  unreadAlerts: Array<{ title: string; message: string; type: string }>
  serviceHours: number
  skills: string[]
  certifications: string[]
  availability?: string
  usersCount: number
  activeUsersCount: number
  inactiveUsersCount: number
  reportsCount: number
  submittedReports: number
  logsCount: number
  recentLogs: string[]
  backupSchedule: string
  hotline: string
  notificationChannel: string
  autoApproveVolunteers: string
}

/** Role-specific quick questions focused on DVMS modules and live data */
export const QUICK_QUESTIONS: Record<AssistantAudience, string[]> = {
  public: [
    'How does this system work?',
    'What can each role do?',
    'How do I register as a volunteer?',
    'What happens after volunteer registration?',
    'How are relief operations coordinated?',
    'Show me the demo login options.',
    'What modules are included in DVMS?',
    'How do evacuation centers work in DVMS?',
    'How do volunteers get assigned to missions?',
    'What can Logistics Officers manage?',
    'What can Super Admin control?',
    'What does a Disaster Coordinator do?',
    'How do notifications and alerts work?',
    'Can I switch between role dashboards?',
    'Where do I sign in and register?',
    'What data is tracked during a disaster response?',
    'How do donations enter the system?',
    'How is volunteer attendance tracked?',
    'What reports can the system generate?',
    'What should be in an emergency go-bag?',
  ],
  'super-admin': [
    'Give me a system overview.',
    'How many users are active?',
    'Are there pending volunteer approvals?',
    'What operations are active?',
    'What needs administrator attention?',
    'When is the next backup?',
    'What reports can I generate?',
    'How do I manage roles and permissions?',
    'Summarize recent system activity.',
    'How do I add a disaster category?',
    'Which evacuation centers are open?',
    'Show low-stock relief items.',
    'How do I create a new user?',
    'How do I configure response settings?',
    'What is the response hotline?',
    'List disaster categories.',
    'How many volunteers are registered?',
    'How do I backup and restore data?',
    'How do I view all system records?',
    'How do I monitor audit logs?',
    'Show inactive or pending users.',
    'What notifications are configured?',
    'How many activity reports were submitted?',
    'Summarize logistics status.',
    'Explain Super Admin sidebar modules.',
  ],
  'disaster-coordinator': [
    'What operations are active?',
    'Who is awaiting volunteer approval?',
    'Which evacuation centers are open?',
    'Show current center capacity.',
    'How many volunteers are deployed?',
    'What tasks are still pending?',
    'Show upcoming volunteer shifts.',
    'How do I create a new operation?',
    'How do I assign a volunteer?',
    'What needs coordinator attention?',
    'Show low-stock relief items.',
    'How should I organize an evacuation?',
    'How do I approve a volunteer?',
    'How do I schedule a volunteer shift?',
    'How do I manage relief activities?',
    'Which centers are full or closed?',
    'How do I monitor volunteer deployment?',
    'How do I generate operation reports?',
    'List disaster categories available.',
    'How many available volunteers can I assign?',
    'Show high-priority tasks.',
    'How do I update operation status?',
    'What is the volunteer approval workflow?',
    'Explain coordinator sidebar modules.',
    'Summarize active response operations.',
  ],
  volunteer: [
    'What are my assigned tasks?',
    'When is my next shift?',
    'Do I have unread alerts?',
    'How many service hours do I have?',
    'How do I check in and check out?',
    'How do I apply for a mission?',
    'How do I submit an activity report?',
    'What skills should I add to my profile?',
    'Explain my volunteer workflow.',
    'What operations can I apply to?',
    'How do I update my availability?',
    'How do I register my volunteer profile?',
    'Show my certifications and skills.',
    'How do I view my service history?',
    'What should I bring when deployed?',
    'How do emergency alerts appear?',
    'How do I start and complete a task?',
    'What happens after I check out?',
    'How do I add an emergency contact?',
    'Which missions are currently active?',
    'How do I mark a task in progress?',
    'Explain volunteer sidebar modules.',
    'What should be in my go-bag?',
    'How do I stay safe during a flood?',
    'Show my deployment status.',
  ],
  'logistics-officer': [
    'Which inventory items need restocking?',
    'What deliveries are in progress?',
    'How many vehicles are available?',
    'Summarize warehouse stock.',
    'How do I allocate supplies?',
    'How do I record a donation?',
    'What equipment needs maintenance?',
    'What needs logistics attention?',
    'How many donations are recorded?',
    'How do I dispatch a delivery?',
    'What operations need supplies?',
    'Give me a logistics report summary.',
    'How do I add inventory items?',
    'How do I track equipment and vehicles?',
    'How do I monitor warehouse stock?',
    'How do I mark a donation distributed?',
    'Show deliveries scheduled for today.',
    'How many vehicles are deployed?',
    'List inventory by warehouse.',
    'How do I coordinate a supply delivery?',
    'What equipment is currently available?',
    'How do I monitor relief distribution?',
    'Explain logistics sidebar modules.',
    'Summarize donation status.',
    'Which items are out of stock?',
  ],
}

const roleGuides: Record<Exclude<AssistantAudience, 'public'>, string> = {
  'super-admin':
    'As Super Admin, use the sidebar to manage users and roles, configure response settings, maintain disaster categories, view all records, generate system reports, manage backups, and monitor activity logs.',
  'disaster-coordinator':
    'As Disaster Coordinator, your workflow is: create an operation → approve volunteers → assign volunteers and tasks → open evacuation centers → schedule shifts → monitor deployment → review operation reports.',
  volunteer:
    'Your volunteer workflow is: complete your profile → set availability → apply for a mission → review assigned tasks and shifts → check in → complete work → check out → submit an activity report.',
  'logistics-officer':
    'As Logistics Officer, monitor warehouse stock → receive donations → allocate supplies to operations → assign equipment and vehicles → dispatch deliveries → confirm distribution → generate logistics reports.',
}

const sidebarGuides: Record<Exclude<AssistantAudience, 'public'>, string> = {
  'super-admin':
    'Super Admin sidebar: Dashboard, Users, Roles, Settings, Categories, Records, Reports, Backup, Monitor.',
  'disaster-coordinator':
    'Coordinator sidebar: Dashboard, Operations, Approvals, Assign, Centers, Shifts, Deployment, Relief, Reports.',
  volunteer:
    'Volunteer sidebar: Dashboard, Register, Profile, Missions, Tasks, Check In, Reports, History, Alerts.',
  'logistics-officer':
    'Logistics sidebar: Dashboard, Inventory, Allocate, Equipment, Distribution, Donations, Reports, Warehouse, Deliveries.',
}

const outsideKnowledge: Array<{ terms: string[]; answer: string }> = [
  {
    terms: ['go bag', 'go-bag', 'emergency bag', 'bring when deployed'],
    answer:
      'A practical 72-hour go-bag should include water, ready-to-eat food, prescription medicine, first-aid supplies, flashlight, radio, batteries or power bank, whistle, masks, hygiene items, clothes, cash, copies of IDs, emergency contacts, and a waterproof document pouch. For deployment, also bring your ID, assigned PPE, and any required certifications.',
  },
  {
    terms: ['earthquake'],
    answer:
      'During an earthquake: Drop, Cover, and Hold On. Stay away from glass and heavy furniture. If outside, move to an open area. After shaking stops, check injuries and hazards, expect aftershocks, avoid damaged buildings, and follow verified local authority instructions. Do not use elevators.',
  },
  {
    terms: ['typhoon', 'hurricane', 'cyclone'],
    answer:
      'Before a typhoon, monitor official forecasts, charge devices, secure loose outdoor items, prepare water and food, protect documents, and know your evacuation route. During the storm, stay indoors away from windows and never cross floodwater. Evacuate immediately when authorities instruct you.',
  },
  {
    terms: ['flood', 'stay safe during a flood'],
    answer:
      'For flood safety, move early to higher ground, switch off electricity only when safe, and never walk or drive through moving water. Keep children away from drains and waterways. Afterward, avoid contaminated water, downed power lines, and structurally damaged buildings.',
  },
  {
    terms: ['fire'],
    answer:
      'If there is a fire, alert others, leave immediately using stairs, stay low under smoke, and never re-enter. If clothing catches fire: stop, drop, and roll. Call the local emergency service from a safe place.',
  },
  {
    terms: ['first aid', 'first-aid'],
    answer:
      'First ensure the scene is safe, call emergency services, and use appropriate protective equipment. Check responsiveness and breathing. Control severe bleeding with firm direct pressure. This assistant is not a substitute for certified medical advice.',
  },
  {
    terms: ['evacuation plan', 'organize an evacuation', 'evacuate'],
    answer:
      'A good evacuation plan defines warning triggers, primary and alternate routes, transport for people with mobility needs, family communication points, assigned team roles, registration at the destination, and accountability checks. In DVMS, track this with Centers, Shifts, Assign, and Deployment modules.',
  },
  {
    terms: ['volunteer safety', 'deployment safety', 'stay safe when deployed'],
    answer:
      'For safe deployment: attend the briefing, wear identification and protective equipment, use the buddy system, stay within your training, hydrate, report hazards, maintain communication, respect privacy, document activities, and check out before leaving.',
  },
]

function includesAny(question: string, terms: string[]) {
  const normalized = question.replace(/-/g, ' ')
  return terms.some((term) => {
    const needle = term.replace(/-/g, ' ')
    return normalized.includes(needle)
  })
}

function list(items: string[], empty: string) {
  return items.length ? items.map((item) => `• ${item}`).join('\n') : empty
}

export function answerSystemQuestion(
  rawQuestion: string,
  audience: AssistantAudience,
  data: AssistantSnapshot,
): string | null {
  const q = rawQuestion.toLowerCase().trim()
  if (!q) {
    return 'Ask me a question about DVMS modules, your role workflow, current response data, or disaster preparedness.'
  }

  if (includesAny(q, ['hello', 'hi ', 'hey', 'good morning', 'good afternoon'])) {
    return `Hello${data.userName ? `, ${data.userName}` : ''}! I’m DVMS Copilot for ${data.agencyName}. Ask about live system data, your role modules, or preparedness guidance.`
  }

  if (includesAny(q, ['how does this system work', 'system flow', 'how the system works', 'relief operations coordinated', 'operations coordinated'])) {
    return 'DVMS follows a shared response flow:\n1. Register a disaster incident and create an operation.\n2. Review volunteer registrations and skills.\n3. Assign missions, tasks, centers, and shifts.\n4. Track check-in, deployment, and completion.\n5. Allocate inventory, vehicles, and deliveries.\n6. Submit activity reports and generate analytics.'
  }

  if (includesAny(q, ['what modules', 'modules are included', 'sidebar modules', 'explain'])) {
    if (audience !== 'public' && includesAny(q, ['sidebar', 'my modules', 'explain'])) {
      return sidebarGuides[audience]
    }
    if (includesAny(q, ['what modules', 'modules are included'])) {
      return 'DVMS modules include User Management, Volunteer Management, Disaster Operations, Task & Shift Management, Relief & Logistics, Evacuation Centers, Incident/Activity Reporting, Communication & Alerts, Reports & Analytics, and System Administration.'
    }
  }

  if (includesAny(q, ['what can each role', 'all roles', 'role do'])) {
    return 'Super Admin manages the whole platform. Disaster Coordinators run response operations and volunteer deployment. Volunteers complete missions, shifts, and reports. Logistics Officers manage inventory, equipment, donations, vehicles, and deliveries.'
  }

  if (includesAny(q, ['what can super admin', 'super admin control'])) {
    return roleGuides['super-admin']
  }

  if (includesAny(q, ['what does a disaster coordinator', 'disaster coordinator do'])) {
    return roleGuides['disaster-coordinator']
  }

  if (includesAny(q, ['what can logistics', 'logistics officers manage'])) {
    return roleGuides['logistics-officer']
  }

  if (includesAny(q, ['what can i do', 'my workflow', 'explain my', 'role guide', 'volunteer workflow'])) {
    return audience === 'public'
      ? 'Visitors can learn about the platform on Home, register an account, or use demo role access from Login. After signing in, each role opens a dedicated dashboard and sidebar.'
      : roleGuides[audience]
  }

  if (includesAny(q, ['sign in and register', 'where do i sign'])) {
    return 'Use Home → Sign in or Register. Login supports email/password and one-click demo role cards. Register lets you create a Volunteer, Coordinator, Logistics, or Super Admin account. Volunteer accounts need coordinator approval before login.'
  }

  if (includesAny(q, ['register as a volunteer', 'volunteer registration', 'after volunteer registration', 'register my volunteer profile'])) {
    return 'Open Register, select Volunteer, and submit your details. A Disaster Coordinator reviews Approvals. After approval, open Volunteer → Register / Profile to add skills, certifications, availability, and emergency contacts before applying for missions.'
  }

  if (includesAny(q, ['demo login', 'login options', 'demo account', 'switch between role'])) {
    return 'Login has one-click demo access for Super Admin, Disaster Coordinator, Volunteer, and Logistics Officer. Inside any role dashboard, the sidebar includes Switch role quick-access buttons that load the inserted demo account for that role.'
  }

  if (includesAny(q, ['notifications and alerts', 'how do notifications', 'emergency alerts appear', 'alerts work'])) {
    return `DVMS notifications appear in-app (Volunteer → Alerts). The system is configured for ${data.notificationChannel}. Types include emergency, reminder, and info alerts. Volunteers can mark alerts as read. The current hotline is ${data.hotline}.`
  }

  if (includesAny(q, ['data is tracked', 'what data is tracked'])) {
    return 'DVMS tracks users/roles, volunteer profiles and skills, operations, tasks, shifts and attendance, evacuation centers, inventory, equipment, vehicles, donations, deliveries, activity reports, alerts, and audit logs.'
  }

  if (includesAny(q, ['donations enter', 'how do donations'])) {
    return 'Logistics Officers open Donations, enter donor, item, quantity, and unit. The donation is recorded as received and inventory is updated automatically. Items can later be marked distributed.'
  }

  if (includesAny(q, ['attendance tracked', 'volunteer attendance'])) {
    return 'Coordinators schedule shifts. Volunteers open Check In, check in when the shift starts, and check out when finished. Status moves scheduled → checked-in → completed, and service hours are updated.'
  }

  if (includesAny(q, ['system overview', 'give me a system', 'dashboard summary', 'summarize active response'])) {
    return `Current DVMS overview for ${data.agencyName}:\n• ${data.operationsCount} operations (${data.activeOperations.length} active, ${data.completedOperations} completed)\n• ${data.activeUsersCount} active users / ${data.usersCount} total\n• ${data.volunteerCount} volunteer profiles (${data.deployedVolunteers} deployed, ${data.availableVolunteers} available)\n• ${data.openCenters.length} open centers · ${data.pendingVolunteers.length} pending approvals\n• ${data.lowStock.length} inventory items need attention\n• ${data.deliveries.filter((item) => item.status !== 'delivered').length} deliveries not completed`
  }

  if (includesAny(q, ['active operation', 'operations are active', 'operation status', 'operations need supplies', 'missions are currently active', 'operations can i apply'])) {
    return list(
      data.activeOperations.map(
        (operation) =>
          `${operation.title} (${operation.category}) — ${operation.location}, ${operation.volunteers} volunteers assigned`,
      ),
      'There are no active operations right now.',
    )
  }

  if (includesAny(q, ['pending volunteer', 'awaiting volunteer', 'volunteer approval', 'approve a volunteer'])) {
    if (includesAny(q, ['how do i approve', 'approval workflow'])) {
      return 'Open Approvals in the coordinator sidebar. Review each pending volunteer, then Approve (creates an active volunteer profile) or Reject. Pending applicants cannot log in until approved.'
    }
    return list(data.pendingVolunteers, 'There are no pending volunteer approvals.')
  }

  if (includesAny(q, ['evacuation center', 'center capacity', 'centers are open', 'centers work in dvms'])) {
    if (includesAny(q, ['how do evacuation centers work'])) {
      return 'Coordinators register centers with name, location, and capacity. Occupancy can be adjusted, and status can be open, full, or closed. Volunteers can be assigned to support centers. Capacity monitoring appears on coordinator and admin views.'
    }
    return list(
      data.openCenters.map(
        (center) =>
          `${center.name}: ${center.occupancy}/${center.capacity} occupied (${Math.round((center.occupancy / Math.max(center.capacity, 1)) * 100)}%)`,
      ),
      'No evacuation centers are currently open.',
    )
  }

  if (includesAny(q, ['centers are full', 'full or closed'])) {
    return `Full centers:\n${list(data.fullCenters, 'None currently full.')}\n\nClosed centers:\n${list(data.closedCenters, 'None currently closed.')}`
  }

  if (includesAny(q, ['disaster categor', 'list disaster categories', 'add a disaster category'])) {
    if (includesAny(q, ['how do i add'])) {
      return 'Open Categories (Super Admin), enter name, description, and default severity, then Add. Categories appear when coordinators create operations.'
    }
    return list(data.categories, 'No disaster categories are configured yet.')
  }

  if (
    includesAny(q, [
      'my task',
      'assigned task',
      'pending task',
      'tasks are still',
      'task summary',
      'high-priority task',
      'start and complete a task',
      'mark a task in progress',
    ])
  ) {
    if (includesAny(q, ['start and complete', 'mark a task in progress'])) {
      return 'Open Tasks. Use Start to move a pending task to in-progress, then Complete when finished. Status updates appear for coordinators monitoring deployment.'
    }
    const relevant =
      audience === 'volunteer' && data.userName
        ? data.tasks.filter((task) => task.assignee === data.userName)
        : includesAny(q, ['high-priority'])
          ? data.tasks.filter((task) => task.priority === 'high' && task.status !== 'completed')
          : data.tasks.filter((task) => task.status !== 'completed')
    return list(
      relevant.map(
        (task) =>
          `${task.title} — ${task.operation} [${task.status}, ${task.priority}]${task.assignee ? ` · ${task.assignee}` : ''}`,
      ),
      'No matching tasks were found.',
    )
  }

  if (includesAny(q, ['next shift', 'upcoming shift', 'volunteer shift', 'shift schedule', 'schedule a volunteer shift'])) {
    if (includesAny(q, ['how do i schedule'])) {
      return 'Open Shifts, select operation and volunteer, set date plus start/end time, then Add. The volunteer will see the shift under Check In / History.'
    }
    const relevant =
      audience === 'volunteer' && data.userName
        ? data.shifts.filter((shift) => shift.volunteer === data.userName)
        : data.shifts
    return list(
      relevant.map(
        (shift) =>
          `${shift.date} ${shift.startTime}–${shift.endTime}: ${shift.operation} — ${shift.volunteer} [${shift.status}]`,
      ),
      'No matching shifts are scheduled.',
    )
  }

  if (includesAny(q, ['volunteers are deployed', 'available volunteers', 'volunteers are registered', 'deployment status', 'monitor volunteer deployment'])) {
    if (includesAny(q, ['how do i monitor'])) {
      return 'Open Deployment to see volunteer availability, shift status, and task progress across active operations.'
    }
    return `Volunteer workforce:\n• Profiles: ${data.volunteerCount}\n• Deployed: ${data.deployedVolunteers}\n• Available: ${data.availableVolunteers}\n• Pending approvals: ${data.pendingVolunteers.length}${
      data.availability ? `\n• Your availability: ${data.availability}` : ''
    }`
  }

  if (includesAny(q, ['low stock', 'restock', 'warehouse stock', 'inventory summary', 'logistics attention', 'out of stock', 'inventory by warehouse', 'add inventory'])) {
    if (includesAny(q, ['how do i add inventory'])) {
      return 'Open Inventory, enter item name, category, quantity, unit, and warehouse, then Add Item. Use +10 / -10 to adjust stock. Status auto-updates to in-stock, low, or out-of-stock.'
    }
    if (includesAny(q, ['by warehouse', 'list inventory'])) {
      return list(
        data.inventory.map(
          (item) =>
            `${item.name} @ ${item.warehouse}: ${item.quantity} ${item.unit} [${item.status}]`,
        ),
        'No inventory items found.',
      )
    }
    if (includesAny(q, ['out of stock'])) {
      return list(
        data.lowStock
          .filter((item) => item.status === 'out-of-stock')
          .map((item) => `${item.name}: ${item.quantity} ${item.unit}`),
        'No items are currently out of stock.',
      )
    }
    return list(
      data.lowStock.map(
        (item) => `${item.name}: ${item.quantity} ${item.unit} remaining [${item.status}]`,
      ),
      'All tracked inventory items currently have healthy stock.',
    )
  }

  if (includesAny(q, ['delivery', 'deliveries in progress', 'deliveries are in progress', 'dispatch', 'coordinate a supply', 'deliveries scheduled'])) {
    if (includesAny(q, ['how do i dispatch', 'how do i coordinate'])) {
      return 'Open Deliveries, enter destination, items, vehicle, and ETA, then Schedule. Use Dispatch to move scheduled → in-transit, and Delivered when complete.'
    }
    return list(
      data.deliveries.map(
        (delivery) =>
          `${delivery.destination}: ${delivery.items} via ${delivery.vehicle} — ${delivery.status}, ETA ${delivery.eta}`,
      ),
      'No deliveries are recorded.',
    )
  }

  if (includesAny(q, ['vehicle', 'fleet', 'vehicles are deployed', 'track equipment and vehicles'])) {
    if (includesAny(q, ['how do i track'])) {
      return 'Open Equipment to update equipment and vehicle status (available, in-use/deployed, maintenance). This helps allocate fleets for deliveries and field teams.'
    }
    return `Fleet status:\n• Available vehicles: ${data.availableVehicles}/${data.vehiclesCount}\n• Deployed vehicles: ${data.deployedVehicles}`
  }

  if (includesAny(q, ['equipment needs maintenance', 'equipment is currently available', 'equipment'])) {
    if (includesAny(q, ['maintenance'])) {
      return list(
        data.maintenanceEquipment,
        'No equipment is currently marked for maintenance.',
      )
    }
    return list(
      data.equipment.map(
        (item) => `${item.name} (${item.type}) — ${item.status} @ ${item.location}`,
      ),
      'No equipment records found.',
    )
  }

  if (includesAny(q, ['donation', 'donation status', 'mark a donation distributed'])) {
    if (includesAny(q, ['how do i record', 'record a donation'])) {
      return 'Open Donations, enter the donor, item, quantity, and unit. Submitting records the donation and updates inventory.'
    }
    if (includesAny(q, ['mark a donation distributed'])) {
      return 'Open Donations and select Mark Distributed on a received donation. This updates donation status for reports and distribution monitoring.'
    }
    return `Donations:\n• Total recorded: ${data.donationsCount}\n• Received: ${data.receivedDonations}\n• Distributed: ${data.distributedDonations}`
  }

  if (includesAny(q, ['unread alert', 'my alert', 'emergency alert'])) {
    return list(
      data.unreadAlerts.map(
        (alert) => `${alert.title} [${alert.type}]: ${alert.message}`,
      ),
      'You have no unread alerts.',
    )
  }

  if (includesAny(q, ['service hour', 'hours do i have', 'service history', 'after i check out'])) {
    if (includesAny(q, ['service history', 'view my service'])) {
      return `Open History to see your shifts, completed tasks, and submitted reports. Current service hours: ${data.serviceHours}.`
    }
    if (includesAny(q, ['after i check out'])) {
      return 'After checkout, your shift is marked completed, availability returns to available (unless still deployed elsewhere), and service hours increase. The update appears in Service History.'
    }
    return `Your recorded volunteer service total is ${data.serviceHours} hours.`
  }

  if (includesAny(q, ['certifications and skills', 'my certifications', 'skills should i add', 'volunteer skills'])) {
    if (includesAny(q, ['show my', 'certifications and skills'])) {
      return `Skills:\n${list(data.skills, 'No skills saved yet.')}\n\nCertifications:\n${list(data.certifications, 'No certifications saved yet.')}`
    }
    return 'Useful skills include first aid or BLS, search and rescue, crowd management, relief packing, logistics, driving, communications, shelter management, psychosocial support, damage assessment, and language interpretation. Only list skills you can safely demonstrate.'
  }

  if (includesAny(q, ['update my availability', 'emergency contact'])) {
    if (includesAny(q, ['availability'])) {
      return 'Open Profile, set Availability to available, deployed, or unavailable, update skills if needed, then Save Profile. Coordinators use this when assigning missions.'
    }
    return 'Open Register / Profile and fill Emergency Contact and Emergency Phone, then save. This is required for safe deployment coordination.'
  }

  if (includesAny(q, ['active user', 'how many users', 'user summary', 'inactive or pending users', 'create a new user'])) {
    if (includesAny(q, ['how do i create'])) {
      return 'Open Users, enter name, email, phone, and role, then Add User. You can toggle active/inactive status or remove access later.'
    }
    if (includesAny(q, ['inactive or pending'])) {
      return `User status:\n• Active: ${data.activeUsersCount}\n• Inactive/other: ${data.inactiveUsersCount}\n• Pending volunteer approvals: ${data.pendingVolunteers.length}\n${list(data.pendingVolunteers.map((name) => `Pending: ${name}`), 'No pending names.')}`
    }
    return `${data.activeUsersCount} of ${data.usersCount} users are active.`
  }

  if (includesAny(q, ['backup', 'recovery', 'backup and restore'])) {
    return `The configured backup schedule is ${data.backupSchedule}. Open Backup to create a manual snapshot or restore from the latest backup. Actions are written to the activity log.`
  }

  if (includesAny(q, ['configure response settings', 'response settings', 'notifications are configured', 'response hotline'])) {
    if (includesAny(q, ['how do i configure'])) {
      return 'Open Settings, update agency name, hotline, auto-approve preference, backup schedule, and notification channel, then Save Settings.'
    }
    return `Response settings:\n• Agency: ${data.agencyName}\n• Hotline: ${data.hotline}\n• Auto-approve volunteers: ${data.autoApproveVolunteers}\n• Backup schedule: ${data.backupSchedule}\n• Notifications: ${data.notificationChannel}`
  }

  if (includesAny(q, ['report', 'analytics', 'operation reports', 'logistics report', 'activity reports were submitted'])) {
    if (includesAny(q, ['how do i generate operation'])) {
      return 'Open Reports in the coordinator sidebar and generate the disaster operation report to compile status, shifts, and task metrics.'
    }
    if (includesAny(q, ['logistics report'])) {
      return `Logistics snapshot:\n• Inventory SKUs needing attention: ${data.lowStock.length}\n• Donations: ${data.donationsCount}\n• Deliveries pending/in transit: ${data.deliveries.filter((d) => d.status !== 'delivered').length}\n• Vehicles available: ${data.availableVehicles}/${data.vehiclesCount}\nOpen Reports to generate the full logistics report.`
    }
    return `DVMS supports system-wide, volunteer participation, disaster response, task completion, donation, operation, and logistics reports.\n• Activity reports submitted: ${data.reportsCount} (${data.submittedReports} awaiting review)\n• Audit log events: ${data.logsCount}`
  }

  if (includesAny(q, ['recent system activity', 'monitor audit', 'audit logs'])) {
    if (includesAny(q, ['how do i monitor'])) {
      return 'Open Monitor to view the activity stream with timestamp, actor, module, and action for administrative and operational events.'
    }
    return list(data.recentLogs, 'No recent activity logs are available.')
  }

  if (includesAny(q, ['view all system records', 'all system records'])) {
    return 'Open Records to view cross-module data: operations, volunteers, evacuation centers, and donations in one place.'
  }

  if (includesAny(q, ['manage roles', 'roles and permissions'])) {
    return 'Open Roles to review capability matrices for Super Admin, Disaster Coordinator, Volunteer, and Logistics Officer, including active membership counts.'
  }

  if (includesAny(q, ['needs administrator attention', 'needs coordinator attention', 'what needs attention', 'logistics attention'])) {
    return `Attention summary:\n• ${data.pendingVolunteers.length} volunteer approvals pending\n• ${data.lowStock.length} inventory items low or out of stock\n• ${data.tasks.filter((task) => task.status !== 'completed').length} tasks not completed\n• ${data.deliveries.filter((delivery) => delivery.status !== 'delivered').length} deliveries not completed\n• ${data.maintenanceEquipment.length} equipment items in maintenance\n• ${data.unreadAlerts.length} unread alerts`
  }

  if (includesAny(q, ['summarize logistics status', 'monitor relief distribution'])) {
    if (includesAny(q, ['how do i monitor relief'])) {
      return 'Open Distribution to track delivery pipeline status against warehouse stock supporting distribution.'
    }
    return `Logistics status:\n• Low/out stock: ${data.lowStock.length}\n• Donations: ${data.donationsCount} (distributed ${data.distributedDonations})\n• Deliveries not completed: ${data.deliveries.filter((d) => d.status !== 'delivered').length}\n• Vehicles available: ${data.availableVehicles}/${data.vehiclesCount}\n• Equipment in maintenance: ${data.maintenanceEquipment.length}`
  }

  if (includesAny(q, ['how do i create', 'create a new operation', 'update operation status'])) {
    if (includesAny(q, ['update operation status'])) {
      return 'Open Operations and use Activate or Complete on an operation row. Status options include planning, active, suspended, and completed.'
    }
    return 'Open Operations from the coordinator sidebar, enter the title, disaster category, location, initial status, and description, then select Create Operation. Activate it when the response is ready to begin.'
  }

  if (includesAny(q, ['assign a volunteer', 'how do i assign', 'volunteers get assigned'])) {
    return 'Open Assign, choose an operation and volunteer profile, enter the mission task, then submit. The system adds the task, updates the operation assignment count, and marks the volunteer as deployed.'
  }

  if (includesAny(q, ['manage relief activities', 'relief activities'])) {
    return 'Open Relief, enter activity title, operation, assignee, and priority, then Add Activity. Mark activities Complete when finished. These appear in task monitoring.'
  }

  if (includesAny(q, ['check in', 'check out'])) {
    return 'Open Check In from the volunteer sidebar. Check in when your scheduled shift begins. Check out after completing the shift; this marks attendance complete and adds service hours.'
  }

  if (includesAny(q, ['apply for a mission', 'apply mission'])) {
    return 'Open Missions, review active operations, and select Apply. Your application appears as a pending task for coordinator review and assignment.'
  }

  if (includesAny(q, ['activity report', 'submit a report', 'submit an activity'])) {
    return 'Open Reports in the volunteer dashboard, choose the operation, describe the work completed and important observations, then submit. Coordinators and administrators can review the report.'
  }

  if (includesAny(q, ['allocate supplies', 'supply allocation'])) {
    return 'Open Allocate, choose an inventory item, quantity, and destination operation. The system checks available stock, reduces the quantity, and creates a scheduled delivery record.'
  }

  if (includesAny(q, ['monitor warehouse'])) {
    return 'Open Warehouse to view stock grouped by warehouse with restock hints for low and out-of-stock items.'
  }

  for (const knowledge of outsideKnowledge) {
    if (includesAny(q, knowledge.terms)) return knowledge.answer
  }

  if (includesAny(q, ['hotline', 'emergency number'])) {
    return `The system-configured response hotline is ${data.hotline}. For a real emergency, contact the verified emergency service for your current location and follow local authority instructions.`
  }

  return null
}
