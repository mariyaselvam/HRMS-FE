export interface SidebarNavItem {
    label: string;
    icon: string;
    route: string;
    exact?: boolean;
}

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard', exact: true },
    { label: 'Employees', icon: 'pi pi-users', route: '/employees' },
    { label: 'Departments', icon: 'pi pi-building', route: '/departments' },
    { label: 'Leave Requests', icon: 'pi pi-calendar-plus', route: '/leave/requests' },
    { label: 'Leave Approvals', icon: 'pi pi-check-square', route: '/leave/approvals' },
    { label: 'Leave Types', icon: 'pi pi-list', route: '/leave/types' },
    { label: 'Attendance', icon: 'pi pi-calendar', route: '/attendance' },
    { label: 'Payroll', icon: 'pi pi-money-bill', route: '/payroll' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
];

export const SIDEBAR_APP_TITLE = 'HRMS Admin';
