export interface SidebarNavItem {
    label: string;
    icon: string;
    route: string;
    exact?: boolean;
    roles?: string[];
}

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard', exact: true },
    { label: 'Employees', icon: 'pi pi-users', route: '/employees', roles: ['admin', 'hr', 'manager'] },
    { label: 'Departments', icon: 'pi pi-building', route: '/departments', roles: ['admin', 'hr'] },
    { label: 'Branches', icon: 'pi pi-map-marker', route: '/branches', roles: ['admin', 'hr'] },
    { label: 'Leave Requests', icon: 'pi pi-calendar-plus', route: '/leave/requests' },
    { label: 'Leave Approvals', icon: 'pi pi-check-square', route: '/leave/approvals', roles: ['admin', 'hr', 'manager'] },
    { label: 'Leave Types', icon: 'pi pi-list', route: '/leave/types', roles: ['admin', 'hr'] },
    { label: 'Attendance', icon: 'pi pi-calendar', route: '/attendance' },
    { label: 'Payroll', icon: 'pi pi-money-bill', route: '/payroll', roles: ['admin', 'hr'] },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings', roles: ['admin', 'hr'] },
];



export const SIDEBAR_APP_TITLE = 'HRMS Admin';
