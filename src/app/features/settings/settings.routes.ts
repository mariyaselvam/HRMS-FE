import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { CompanySettingsComponent } from './pages/company-settings.component';
import { AttendanceSettingsComponent } from './pages/attendance-settings.component';
import { LeaveSettingsComponent } from './pages/leave-settings.component';
import { PayrollSettingsComponent } from './pages/payroll-settings.component';
import { NotificationSettingsComponent } from './pages/notification-settings.component';

export const SETTINGS_ROUTES: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            { path: '', redirectTo: 'company', pathMatch: 'full' },
            { path: 'company', component: CompanySettingsComponent },
            { path: 'attendance', component: AttendanceSettingsComponent },
            { path: 'leave', component: LeaveSettingsComponent },
            { path: 'payroll', component: PayrollSettingsComponent },
            { path: 'notifications', component: NotificationSettingsComponent }
        ]
    }
];
