import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { RoleLayout } from './components/layout/RoleLayout'
import { AIAssistant } from './components/chatbot/AIAssistant'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import {
  BackupRestore,
  ConfigureSettings,
  GenerateReports,
  ManageCategories,
  ManageRoles,
  ManageUsers,
  MonitorActivities,
  SuperAdminDashboard,
  ViewRecords,
  superAdminNav,
} from './roles/super-admin'
import {
  ApproveVolunteers,
  AssignVolunteers,
  CoordinatorDashboard,
  CreateOperations,
  GenerateOperationReports,
  ManageEvacuationCenters,
  ManageReliefActivities,
  MonitorDeployment,
  ScheduleShifts,
  coordinatorNav,
} from './roles/disaster-coordinator'
import {
  ApplyMissions,
  CheckInOut,
  EmergencyAlerts,
  RegisterVolunteer,
  ServiceHistory,
  UpdateProfile,
  UploadActivityReports,
  ViewTasks,
  VolunteerDashboard,
  volunteerNav,
} from './roles/volunteer'
import {
  AllocateSupplies,
  CoordinateDeliveries,
  GenerateLogisticsReports,
  LogisticsDashboard,
  ManageInventory,
  MonitorDistribution,
  MonitorWarehouse,
  RecordDonations,
  TrackEquipment,
  logisticsNav,
} from './roles/logistics-officer'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute roles={['super-admin']} />}>
        <Route
          path="/super-admin"
          element={
            <RoleLayout
              role="super-admin"
              basePath="/super-admin"
              navItems={superAdminNav}
            />
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-roles" element={<ManageRoles />} />
          <Route path="configure-settings" element={<ConfigureSettings />} />
          <Route path="manage-categories" element={<ManageCategories />} />
          <Route path="view-records" element={<ViewRecords />} />
          <Route path="generate-reports" element={<GenerateReports />} />
          <Route path="backup-restore" element={<BackupRestore />} />
          <Route path="monitor-activities" element={<MonitorActivities />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['disaster-coordinator']} />}>
        <Route
          path="/disaster-coordinator"
          element={
            <RoleLayout
              role="disaster-coordinator"
              basePath="/disaster-coordinator"
              navItems={coordinatorNav}
            />
          }
        >
          <Route index element={<CoordinatorDashboard />} />
          <Route path="create-operations" element={<CreateOperations />} />
          <Route path="approve-volunteers" element={<ApproveVolunteers />} />
          <Route path="assign-volunteers" element={<AssignVolunteers />} />
          <Route
            path="manage-evacuation-centers"
            element={<ManageEvacuationCenters />}
          />
          <Route path="schedule-shifts" element={<ScheduleShifts />} />
          <Route path="monitor-deployment" element={<MonitorDeployment />} />
          <Route
            path="manage-relief-activities"
            element={<ManageReliefActivities />}
          />
          <Route
            path="generate-operation-reports"
            element={<GenerateOperationReports />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['volunteer']} />}>
        <Route
          path="/volunteer"
          element={
            <RoleLayout
              role="volunteer"
              basePath="/volunteer"
              navItems={volunteerNav}
            />
          }
        >
          <Route index element={<VolunteerDashboard />} />
          <Route path="register-volunteer" element={<RegisterVolunteer />} />
          <Route path="update-profile" element={<UpdateProfile />} />
          <Route path="apply-missions" element={<ApplyMissions />} />
          <Route path="view-tasks" element={<ViewTasks />} />
          <Route path="check-in-out" element={<CheckInOut />} />
          <Route
            path="upload-activity-reports"
            element={<UploadActivityReports />}
          />
          <Route path="service-history" element={<ServiceHistory />} />
          <Route path="emergency-alerts" element={<EmergencyAlerts />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['logistics-officer']} />}>
        <Route
          path="/logistics-officer"
          element={
            <RoleLayout
              role="logistics-officer"
              basePath="/logistics-officer"
              navItems={logisticsNav}
            />
          }
        >
          <Route index element={<LogisticsDashboard />} />
          <Route path="manage-inventory" element={<ManageInventory />} />
          <Route path="allocate-supplies" element={<AllocateSupplies />} />
          <Route path="track-equipment" element={<TrackEquipment />} />
          <Route path="monitor-distribution" element={<MonitorDistribution />} />
          <Route path="record-donations" element={<RecordDonations />} />
          <Route
            path="generate-logistics-reports"
            element={<GenerateLogisticsReports />}
          />
          <Route path="monitor-warehouse" element={<MonitorWarehouse />} />
          <Route path="coordinate-deliveries" element={<CoordinateDeliveries />} />
        </Route>
      </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AIAssistant />
    </>
  )
}
