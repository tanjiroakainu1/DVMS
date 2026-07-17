import type { NavItem } from '../../types'

export const superAdminNav: NavItem[] = [
  { label: 'Dashboard', path: '' },
  { label: 'Users', path: 'manage-users' },
  { label: 'Roles', path: 'manage-roles' },
  { label: 'Settings', path: 'configure-settings' },
  { label: 'Categories', path: 'manage-categories' },
  { label: 'Records', path: 'view-records' },
  { label: 'Reports', path: 'generate-reports' },
  { label: 'Backup', path: 'backup-restore' },
  { label: 'Monitor', path: 'monitor-activities' },
]
