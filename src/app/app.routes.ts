import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
        canActivate: [loginGuard]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'employees',
        loadComponent: () => import('./features/employees/employee-list.component').then(m => m.EmployeeListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'employees/add',
        loadComponent: () => import('./features/employees/employee-add.component').then(m => m.EmployeeAddComponent),
        canActivate: [authGuard]
    },
    {
        path: 'employees/onboard',
        loadComponent: () => import('./features/onboarding/onboarding.component').then(m => m.OnboardingComponent),
        canActivate: [authGuard]
    },
    {
        path: 'employees/onboard/:id',
        loadComponent: () => import('./features/onboarding/onboarding.component').then(m => m.OnboardingComponent),
        canActivate: [authGuard]
    },
    {
        path: 'departments',
        loadComponent: () => import('./features/departments/department-list.component').then(m => m.DepartmentListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'branches',
        loadComponent: () => import('./features/locations/location-list.component').then(m => m.LocationListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'leave/types',
        loadComponent: () => import('./features/leave/leave-types.component').then(m => m.LeaveTypesComponent),
        canActivate: [authGuard]
    },
    {
        path: 'leave/requests',
        loadComponent: () => import('./features/leave/leave-requests.component').then(m => m.LeaveRequestsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'leave/approvals',
        loadComponent: () => import('./features/leave/leave-approvals.component').then(m => m.LeaveApprovalsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'attendance',
        loadComponent: () => import('./features/attendance/attendance.component').then(m => m.AttendanceComponent),
        canActivate: [authGuard]
    },
    {
        path: 'payroll',
        loadComponent: () => import('./features/payroll/payroll.component').then(m => m.PayrollComponent),
        canActivate: [authGuard]
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard' }
];
