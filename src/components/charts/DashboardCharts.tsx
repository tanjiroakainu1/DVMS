import { useMemo, type ReactNode } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Activity, BarChart3, Sparkles, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

const COLORS = ['#0f766e', '#0284c7', '#d97706', '#c81e1e', '#7c3aed']
const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #dbe4ed',
  boxShadow: '0 12px 30px rgba(15, 42, 67, 0.12)',
  fontSize: 12,
}

function ChartCard({
  title,
  description,
  children,
  accent = 'teal',
}: {
  title: string
  description: string
  children: ReactNode
  accent?: 'teal' | 'blue' | 'amber' | 'violet'
}) {
  const accentClasses = {
    teal: 'from-teal-500 to-teal-deep',
    blue: 'from-sky-400 to-sky-700',
    amber: 'from-amber-300 to-amber-strong',
    violet: 'from-violet-400 to-violet-700',
  }

  return (
    <section className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5">
      <span
        className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${accentClasses[accent]}`}
      />
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-sm font-bold text-navy-900 sm:text-base">
            {title}
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-steel sm:text-xs">
            {description}
          </p>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-soft text-teal-deep">
          <TrendingUp className="h-4 w-4" />
        </span>
      </div>
      <div className="h-64 min-w-0 sm:h-72">{children}</div>
    </section>
  )
}

function AnalyticsHeading({
  title = 'Live Analytics',
  subtitle = 'Interactive charts update automatically as system records change.',
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-deep to-navy-900 text-white shadow-md">
            <BarChart3 className="h-4 w-4" />
          </span>
          <h2 className="font-display text-lg font-bold text-navy-900 sm:text-xl">
            {title}
          </h2>
        </div>
        <p className="mt-1 text-xs text-steel sm:text-sm">{subtitle}</p>
      </div>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-teal-200 bg-teal-soft/60 px-2.5 py-1 text-[10px] font-bold text-teal-deep">
        <Activity className="h-3 w-3" />
        Live system data
      </span>
    </div>
  )
}

function DonutChart({
  data,
  centerLabel,
}: {
  data: Array<{ name: string; value: number }>
  centerLabel: string
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="47%"
          innerRadius="48%"
          outerRadius="72%"
          paddingAngle={4}
          stroke="none"
        >
          {data.map((item, index) => (
            <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <text
          x="50%"
          y="43%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#102a43"
          fontSize="24"
          fontWeight="800"
        >
          {total}
        </text>
        <text
          x="50%"
          y="53%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#627d98"
          fontSize="10"
          fontWeight="700"
        >
          {centerLabel}
        </text>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11 }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function SuperAdminCharts() {
  const { users, operations, logs } = useData()

  const roleData = useMemo(
    () => [
      {
        name: 'Admin',
        users: users.filter((item) => item.role === 'super-admin').length,
      },
      {
        name: 'Coordinator',
        users: users.filter((item) => item.role === 'disaster-coordinator')
          .length,
      },
      {
        name: 'Volunteer',
        users: users.filter((item) => item.role === 'volunteer').length,
      },
      {
        name: 'Logistics',
        users: users.filter((item) => item.role === 'logistics-officer').length,
      },
    ],
    [users],
  )
  const statusData = useMemo(
    () =>
      ['active', 'planning', 'completed', 'suspended'].map((status) => ({
        name: status,
        value: operations.filter((item) => item.status === status).length,
      })),
    [operations],
  )
  const moduleData = useMemo(() => {
    const counts = new Map<string, number>()
    logs.forEach((log) => counts.set(log.module, (counts.get(log.module) ?? 0) + 1))
    return Array.from(counts, ([module, events]) => ({ module, events })).slice(
      0,
      8,
    )
  }, [logs])

  return (
    <div className="space-y-4">
      <AnalyticsHeading title="System Intelligence" />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Users by Role"
          description="Account distribution across access levels"
          accent="blue"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roleData} margin={{ top: 10, right: 6, left: -24 }}>
              <defs>
                <linearGradient id="adminBars" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="users" fill="url(#adminBars)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Operation Portfolio"
          description="Response operations grouped by status"
          accent="teal"
        >
          <DonutChart data={statusData} centerLabel="OPERATIONS" />
        </ChartCard>
        <ChartCard
          title="Activity by Module"
          description="Audit events reveal where teams are working"
          accent="violet"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moduleData} margin={{ top: 10, right: 8, left: -28 }}>
              <defs>
                <linearGradient id="activityArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="module" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="events"
                stroke="#7c3aed"
                strokeWidth={3}
                fill="url(#activityArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

export function CoordinatorCharts() {
  const { operations, centers, volunteerProfiles, tasks } = useData()
  const operationData = useMemo(
    () =>
      operations.map((item) => ({
        name: item.title.length > 18 ? `${item.title.slice(0, 18)}…` : item.title,
        volunteers: item.volunteersAssigned,
        status: item.status,
      })),
    [operations],
  )
  const centerData = useMemo(
    () =>
      centers.map((item) => ({
        name: item.name.length > 19 ? `${item.name.slice(0, 19)}…` : item.name,
        occupancy: item.occupancy,
        available: Math.max(item.capacity - item.occupancy, 0),
      })),
    [centers],
  )
  const deploymentData = useMemo(
    () => [
      {
        name: 'Available',
        value: volunteerProfiles.filter((item) => item.availability === 'available')
          .length,
      },
      {
        name: 'Deployed',
        value: volunteerProfiles.filter((item) => item.availability === 'deployed')
          .length,
      },
      {
        name: 'Unavailable',
        value: volunteerProfiles.filter(
          (item) => item.availability === 'unavailable',
        ).length,
      },
    ],
    [volunteerProfiles],
  )
  const taskData = useMemo(
    () =>
      ['pending', 'in-progress', 'completed'].map((status) => ({
        status,
        tasks: tasks.filter((item) => item.status === status).length,
      })),
    [tasks],
  )

  return (
    <div className="space-y-4">
      <AnalyticsHeading title="Response Command Analytics" />
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Volunteer Deployment"
          description="Assigned volunteers across response operations"
          accent="blue"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={operationData} margin={{ top: 10, right: 8, left: -22 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="volunteers" fill="#0284c7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Evacuation Capacity"
          description="Occupied versus remaining center capacity"
          accent="amber"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={centerData} layout="vertical" margin={{ left: 12, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={105}
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="occupancy" stackId="capacity" fill="#d97706" radius={[6, 0, 0, 6]} />
              <Bar dataKey="available" stackId="capacity" fill="#ccfbf1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Workforce Readiness"
          description="Current availability of registered volunteers"
          accent="teal"
        >
          <DonutChart data={deploymentData} centerLabel="VOLUNTEERS" />
        </ChartCard>
        <ChartCard
          title="Mission Task Pipeline"
          description="Progress from pending assignment to completion"
          accent="violet"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={taskData} margin={{ top: 12, right: 10, left: -28 }}>
              <defs>
                <linearGradient id="taskPipeline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="status" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="#0f766e"
                strokeWidth={3}
                fill="url(#taskPipeline)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

export function VolunteerCharts() {
  const { user } = useAuth()
  const { tasks, shifts, reports, volunteerProfiles } = useData()
  const name = user?.name ?? ''
  const profile = volunteerProfiles.find(
    (item) => item.userId === user?.id || item.name === name,
  )
  const myTasks = tasks.filter((item) => item.assignedTo === name)
  const myShifts = shifts.filter((item) => item.volunteerName === name)
  const myReports = reports.filter((item) => item.volunteerName === name)
  const taskData = useMemo(
    () =>
      ['pending', 'in-progress', 'completed'].map((status) => ({
        name: status,
        value: myTasks.filter((item) => item.status === status).length,
      })),
    [myTasks],
  )
  const shiftData = useMemo(
    () =>
      myShifts.map((item, index) => ({
        shift: `Shift ${index + 1}`,
        hours: Math.max(
          Number(item.endTime.split(':')[0]) - Number(item.startTime.split(':')[0]),
          0,
        ),
        status: item.status,
      })),
    [myShifts],
  )
  const impactData = [
    { metric: 'Hours', value: Math.min(profile?.serviceHours ?? 0, 100) },
    { metric: 'Tasks', value: Math.min(myTasks.length * 20, 100) },
    { metric: 'Shifts', value: Math.min(myShifts.length * 25, 100) },
    { metric: 'Reports', value: Math.min(myReports.length * 25, 100) },
    { metric: 'Skills', value: Math.min((profile?.skills.length ?? 0) * 18, 100) },
  ]

  return (
    <div className="space-y-4">
      <AnalyticsHeading title="My Volunteer Impact" />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Task Progress"
          description="Your current mission task completion"
          accent="teal"
        >
          <DonutChart data={taskData} centerLabel="TASKS" />
        </ChartCard>
        <ChartCard
          title="Scheduled Service"
          description="Hours assigned across your shifts"
          accent="blue"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={shiftData} margin={{ top: 12, right: 10, left: -28 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="shift" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ fill: '#0284c7', strokeWidth: 3, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Impact Profile"
          description="A view of service, activity, and readiness"
          accent="violet"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={impactData} outerRadius="70%">
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#627d98' }} />
              <Radar
                dataKey="value"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

export function LogisticsCharts() {
  const { inventory, deliveries, vehicles, equipment, donations } = useData()
  const stockData = useMemo(
    () =>
      ['in-stock', 'low', 'out-of-stock'].map((status) => ({
        name: status,
        value: inventory.filter((item) => item.status === status).length,
      })),
    [inventory],
  )
  const warehouseData = useMemo(() => {
    const totals = new Map<string, number>()
    inventory.forEach((item) =>
      totals.set(item.warehouse, (totals.get(item.warehouse) ?? 0) + item.quantity),
    )
    return Array.from(totals, ([warehouse, quantity]) => ({
      warehouse,
      quantity,
    }))
  }, [inventory])
  const deliveryData = useMemo(
    () =>
      ['scheduled', 'in-transit', 'delivered'].map((status) => ({
        status,
        deliveries: deliveries.filter((item) => item.status === status).length,
      })),
    [deliveries],
  )
  const assetData = useMemo(
    () => [
      {
        asset: 'Vehicles',
        available: vehicles.filter((item) => item.status === 'available').length,
        deployed: vehicles.filter((item) => item.status === 'deployed').length,
        maintenance: vehicles.filter((item) => item.status === 'maintenance').length,
      },
      {
        asset: 'Equipment',
        available: equipment.filter((item) => item.status === 'available').length,
        deployed: equipment.filter((item) => item.status === 'in-use').length,
        maintenance: equipment.filter((item) => item.status === 'maintenance')
          .length,
      },
    ],
    [vehicles, equipment],
  )
  const donationData = useMemo(
    () =>
      ['received', 'distributed', 'pending'].map((status) => ({
        name: status,
        value: donations.filter((item) => item.status === status).length,
      })),
    [donations],
  )

  return (
    <div className="space-y-4">
      <AnalyticsHeading title="Logistics Control Analytics" />
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Inventory Health"
          description="Stock keeping units grouped by availability"
          accent="teal"
        >
          <DonutChart data={stockData} centerLabel="STOCK ITEMS" />
        </ChartCard>
        <ChartCard
          title="Warehouse Volume"
          description="Combined item quantities by storage location"
          accent="amber"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={warehouseData} margin={{ top: 12, right: 8, left: -20 }}>
              <defs>
                <linearGradient id="warehouseBars" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="warehouse" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="quantity" fill="url(#warehouseBars)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Delivery Pipeline"
          description="Supply movement from scheduling to arrival"
          accent="blue"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={deliveryData} margin={{ top: 12, right: 8, left: -28 }}>
              <defs>
                <linearGradient id="deliveryArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="status" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="deliveries"
                stroke="#0284c7"
                strokeWidth={3}
                fill="url(#deliveryArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Fleet & Equipment Readiness"
          description="Operational asset status at a glance"
          accent="violet"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetData} margin={{ top: 12, right: 8, left: -26 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="asset" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="available" stackId="asset" fill="#0f766e" />
              <Bar dataKey="deployed" stackId="asset" fill="#0284c7" />
              <Bar dataKey="maintenance" stackId="asset" fill="#d97706" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Donation Flow"
          description="Received, pending, and distributed contributions"
          accent="amber"
        >
          <DonutChart data={donationData} centerLabel="DONATIONS" />
        </ChartCard>
      </div>
    </div>
  )
}

export function SystemReportCharts() {
  const { users, operations, volunteerProfiles, tasks, reports } = useData()
  const participationData = [
    {
      metric: 'Registered',
      value: users.filter((item) => item.role === 'volunteer').length,
    },
    { metric: 'Profiles', value: volunteerProfiles.length },
    {
      metric: 'Available',
      value: volunteerProfiles.filter((item) => item.availability === 'available')
        .length,
    },
    {
      metric: 'Deployed',
      value: volunteerProfiles.filter((item) => item.availability === 'deployed')
        .length,
    },
  ]
  const completionData = [
    {
      name: 'Pending',
      value: tasks.filter((item) => item.status === 'pending').length,
    },
    {
      name: 'In progress',
      value: tasks.filter((item) => item.status === 'in-progress').length,
    },
    {
      name: 'Completed',
      value: tasks.filter((item) => item.status === 'completed').length,
    },
    {
      name: 'Reports',
      value: reports.length,
    },
  ]
  const operationData = operations.map((item) => ({
    operation:
      item.title.length > 18 ? `${item.title.slice(0, 18)}…` : item.title,
    volunteers: item.volunteersAssigned,
  }))

  return (
    <div className="space-y-4">
      <AnalyticsHeading
        title="System Report Visuals"
        subtitle="Visual evidence supporting generated system-wide reports."
      />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <ChartCard title="Volunteer Participation" description="Workforce readiness funnel" accent="teal">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={participationData} margin={{ top: 12, right: 8, left: -26 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="metric" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#0f766e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Response Participation" description="Volunteers assigned by operation" accent="blue">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={operationData} margin={{ top: 12, right: 8, left: -26 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="operation" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="volunteers" stroke="#0284c7" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Completion Evidence" description="Tasks and submitted field reports" accent="violet">
          <DonutChart data={completionData} centerLabel="RECORDS" />
        </ChartCard>
      </div>
    </div>
  )
}

export function ActivityReportCharts() {
  const { user } = useAuth()
  const { reports, operations, tasks, shifts, volunteerProfiles } = useData()
  const volunteerName = user?.name ?? ''
  const mine = useMemo(
    () => reports.filter((report) => report.volunteerName === volunteerName),
    [reports, volunteerName],
  )
  const profile = volunteerProfiles.find(
    (item) => item.userId === user?.id || item.name === volunteerName,
  )

  const reportingTimeline = useMemo(() => {
    const totals = new Map<string, number>()
    mine.forEach((report) =>
      totals.set(report.date, (totals.get(report.date) ?? 0) + 1),
    )
    let cumulative = 0
    return Array.from(totals, ([date, submitted]) => ({ date, submitted }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((item) => {
        cumulative += item.submitted
        return { ...item, cumulative }
      })
  }, [mine])

  const operationCoverage = useMemo(
    () =>
      operations.map((operation) => ({
        name:
          operation.title.length > 15
            ? `${operation.title.slice(0, 15)}…`
            : operation.title,
        reports: mine.filter(
          (report) => report.operationTitle === operation.title,
        ).length,
        tasks: tasks.filter(
          (task) =>
            task.operationTitle === operation.title &&
            task.assignedTo === volunteerName,
        ).length,
        shifts: shifts.filter(
          (shift) =>
            shift.operationId === operation.id &&
            shift.volunteerName === volunteerName,
        ).length,
      })),
    [operations, mine, tasks, shifts, volunteerName],
  )

  const reviewData = useMemo(
    () =>
      ['submitted', 'reviewed'].map((status) => ({
        name: status,
        value: mine.filter((report) => report.status === status).length,
      })),
    [mine],
  )

  const signalData = useMemo(
    () =>
      mine.slice(0, 6).map((report, index) => ({
        name: `Report ${mine.length - index}`,
        quality: Math.min(
          Math.round(report.summary.trim().split(/\s+/).length * 4),
          100,
        ),
        words: report.summary.trim().split(/\s+/).length,
        fill: COLORS[index % COLORS.length],
      })),
    [mine],
  )

  const reviewed = mine.filter((report) => report.status === 'reviewed').length
  const coveredOperations = new Set(mine.map((report) => report.operationTitle))
    .size
  const myTasks = tasks.filter((task) => task.assignedTo === volunteerName)
  const completedTasks = myTasks.filter(
    (task) => task.status === 'completed',
  ).length
  const impactData = [
    {
      metric: 'Reports',
      score: Math.min(mine.length * 20, 100),
    },
    {
      metric: 'Reviewed',
      score: mine.length ? Math.round((reviewed / mine.length) * 100) : 0,
    },
    {
      metric: 'Coverage',
      score: operations.length
        ? Math.round((coveredOperations / operations.length) * 100)
        : 0,
    },
    {
      metric: 'Tasks',
      score: myTasks.length
        ? Math.round((completedTasks / myTasks.length) * 100)
        : 0,
    },
    {
      metric: 'Service',
      score: Math.min(profile?.serviceHours ?? 0, 100),
    },
  ]
  const averageWords = mine.length
    ? Math.round(
        mine.reduce(
          (sum, report) =>
            sum + report.summary.trim().split(/\s+/).filter(Boolean).length,
          0,
        ) / mine.length,
      )
    : 0

  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-br from-navy-950 via-indigo-950 to-teal-950 p-3 shadow-2xl sm:p-5">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 via-sky-500 to-teal-400 text-white shadow-lg shadow-indigo-950/40">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300">
                Personal field intelligence
              </p>
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                Impact Signal
              </h2>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            Your live evidence trail across deployments, reviews, tasks, and
            documented field activity.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Evidence', mine.length],
            ['Reviewed', reviewed],
            ['Avg. words', averageWords],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 backdrop-blur sm:px-3"
            >
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 sm:text-[9px]">
                {label}
              </p>
              <p className="mt-0.5 text-lg font-black tabular-nums text-white">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative grid min-w-0 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Reporting Velocity"
          description="Submission activity and cumulative evidence over time"
          accent="violet"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={reportingTimeline}
              margin={{ top: 14, right: 8, left: -25 }}
            >
              <defs>
                <linearGradient id="reportVelocity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="cumulative" stroke="#7c3aed" strokeWidth={3} fill="url(#reportVelocity)" />
              <Bar dataKey="submitted" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Deployment Footprint"
          description="Reports, assigned tasks, and shifts across operations"
          accent="blue"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={operationCoverage} margin={{ top: 14, right: 8, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="reports" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              <Bar dataKey="tasks" fill="#0284c7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="shifts" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Evidence Review Orbit"
          description="Submitted field records versus coordinator-reviewed evidence"
          accent="teal"
        >
          <DonutChart data={reviewData} centerLabel="MY REPORTS" />
        </ChartCard>

        <ChartCard
          title="Volunteer Impact Radar"
          description="Reporting, review, operation coverage, tasks, and service"
          accent="violet"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={impactData} outerRadius="72%">
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#627d98' }} />
              <Radar
                dataKey="score"
                stroke="#7c3aed"
                fill="#8b5cf6"
                fillOpacity={0.4}
                strokeWidth={3}
              />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Report Signal Strength"
          description="Summary detail score for your latest field evidence"
          accent="amber"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={signalData}
              innerRadius="18%"
              outerRadius="92%"
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="quality" background cornerRadius={8}>
                {signalData.map((item) => (
                  <Cell key={item.name} fill={item.fill} />
                ))}
              </RadialBar>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, _name, item) => [
                  `${value}% (${item.payload.words} words)`,
                  'Evidence strength',
                ]}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

export function OperationReportCharts() {
  const { operations, shifts, tasks, centers } = useData()

  const operationMetrics = useMemo(
    () =>
      operations.map((operation) => {
        const relatedTasks = tasks.filter(
          (task) => task.operationTitle === operation.title,
        )
        const completedTasks = relatedTasks.filter(
          (task) => task.status === 'completed',
        ).length
        return {
          name:
            operation.title.length > 16
              ? `${operation.title.slice(0, 16)}…`
              : operation.title,
          volunteers: operation.volunteersAssigned,
          shifts: shifts.filter((shift) => shift.operationId === operation.id)
            .length,
          tasks: relatedTasks.length,
          completion: relatedTasks.length
            ? Math.round((completedTasks / relatedTasks.length) * 100)
            : 0,
        }
      }),
    [operations, shifts, tasks],
  )

  const taskMatrix = useMemo(
    () =>
      operations.map((operation) => {
        const related = tasks.filter(
          (task) => task.operationTitle === operation.title,
        )
        return {
          name:
            operation.title.length > 14
              ? `${operation.title.slice(0, 14)}…`
              : operation.title,
          pending: related.filter((task) => task.status === 'pending').length,
          active: related.filter((task) => task.status === 'in-progress').length,
          completed: related.filter((task) => task.status === 'completed').length,
        }
      }),
    [operations, tasks],
  )

  const statusData = useMemo(
    () =>
      ['active', 'planning', 'completed', 'suspended'].map((status) => ({
        name: status,
        value: operations.filter((operation) => operation.status === status)
          .length,
      })),
    [operations],
  )

  const centerLoad = useMemo(
    () =>
      centers.map((center, index) => ({
        name:
          center.name.length > 18
            ? `${center.name.slice(0, 18)}…`
            : center.name,
        utilization: center.capacity
          ? Math.round((center.occupancy / center.capacity) * 100)
          : 0,
        occupancy: center.occupancy,
        capacity: center.capacity,
        fill: COLORS[index % COLORS.length],
      })),
    [centers],
  )

  const shiftReadiness = useMemo(
    () =>
      ['scheduled', 'checked-in', 'completed', 'missed'].map((status) => ({
        metric: status,
        value: shifts.filter((shift) => shift.status === status).length,
      })),
    [shifts],
  )

  const completedTasks = tasks.filter((task) => task.status === 'completed').length
  const taskCompletion = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0
  const occupied = centers.reduce((sum, center) => sum + center.occupancy, 0)
  const capacity = centers.reduce((sum, center) => sum + center.capacity, 0)
  const capacityLoad = capacity ? Math.round((occupied / capacity) * 100) : 0

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-300/20 bg-gradient-to-br from-navy-950 via-navy-900 to-teal-950 p-3 shadow-2xl sm:p-5">
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 text-white shadow-lg shadow-sky-950/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300">
                Live command intelligence
              </p>
              <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
                Operation Pulse
              </h2>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            A synchronized view of response force, mission progress, shelter
            pressure, and shift readiness.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 min-[460px]:grid-cols-3">
          {[
            ['Task success', `${taskCompletion}%`],
            ['Center load', `${capacityLoad}%`],
            ['Live ops', operations.filter((item) => item.status === 'active').length],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur"
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                {label}
              </p>
              <p className="mt-0.5 text-lg font-black tabular-nums text-white">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative grid min-w-0 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Response Force & Completion"
          description="Volunteers, shifts, tasks, and completion rate by operation"
          accent="blue"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={operationMetrics}
              margin={{ top: 14, right: 8, left: -25 }}
            >
              <defs>
                <linearGradient id="reportVolunteers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="count" allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="percent" orientation="right" domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <Bar yAxisId="count" dataKey="volunteers" fill="url(#reportVolunteers)" radius={[7, 7, 0, 0]} />
              <Bar yAxisId="count" dataKey="shifts" fill="#0f766e" radius={[7, 7, 0, 0]} />
              <Line yAxisId="percent" type="monotone" dataKey="completion" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Mission Task Matrix"
          description="Stacked workload from pending through field completion"
          accent="violet"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskMatrix} layout="vertical" margin={{ left: 14, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={95} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="pending" stackId="tasks" fill="#fbbf24" />
              <Bar dataKey="active" stackId="tasks" fill="#0284c7" />
              <Bar dataKey="completed" stackId="tasks" fill="#0f766e" radius={[0, 7, 7, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Evacuation Pressure Rings"
          description="Real-time utilization percentage across tracked centers"
          accent="amber"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={centerLoad}
              innerRadius="18%"
              outerRadius="92%"
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="utilization" background cornerRadius={8}>
                {centerLoad.map((center) => (
                  <Cell key={center.name} fill={center.fill} />
                ))}
              </RadialBar>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, _name, item) => [
                  `${value}% (${item.payload.occupancy}/${item.payload.capacity})`,
                  'Center load',
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 10 }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Command Readiness Radar"
          description="Shift coverage balanced against the operation portfolio"
          accent="teal"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={shiftReadiness} outerRadius="72%">
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#627d98' }} />
              <Radar
                dataKey="value"
                stroke="#0f766e"
                fill="#14b8a6"
                fillOpacity={0.4}
                strokeWidth={3}
              />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Operation Status Orbit"
          description="Portfolio balance across every response phase"
          accent="blue"
        >
          <DonutChart data={statusData} centerLabel="OPERATIONS" />
        </ChartCard>
      </div>
    </div>
  )
}

export function LogisticsReportCharts() {
  return (
    <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-white p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2 px-1">
        <Sparkles className="h-4 w-4 text-amber-strong" />
        <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
          Report-ready visual analytics
        </p>
      </div>
      <LogisticsCharts />
    </div>
  )
}
