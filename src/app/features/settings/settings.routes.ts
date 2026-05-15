import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { CompanySettingsComponent } from './pages/company-settings.component';
import { PayrollSettingsComponent } from './pages/payroll-settings.component';
import { NotificationSettingsComponent } from './pages/notification-settings.component';

export const SETTINGS_ROUTES: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            { path: '', redirectTo: 'company', pathMatch: 'full' },
            { path: 'company', component: CompanySettingsComponent },
            { path: 'payroll', component: PayrollSettingsComponent },
            { path: 'notifications', component: NotificationSettingsComponent }
        ]
    }
];
