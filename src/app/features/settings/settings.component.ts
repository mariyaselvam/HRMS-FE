import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SettingsStore } from '../../store/settings.store';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, RouterModule, CardModule],
    template: `
        <div class="space-y-6 pb-10">
            <!-- Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
                <div>
                    <h1 class="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">System Settings</h1>
                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Configure global application preferences</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <!-- Sidebar Navigation -->
                <div class="md:col-span-3">
                    <p-card class="!shadow-sm !border-slate-300 dark:!border-slate-800 !overflow-hidden">
                        <nav class="flex flex-col -m-4">
                            @for (item of menuItems; track item.path) {
                                <a [routerLink]="item.path"
                                   routerLinkActive="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-l-4 border-indigo-600 font-semibold"
                                   [routerLinkActiveOptions]="{exact: false}"
                                   class="flex items-center gap-3 px-6 py-4 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all border-l-4 border-transparent text-sm font-medium">
                                    <i [class]="item.icon + ' text-lg opacity-70'"></i>
                                    {{ item.label }}
                                </a>
                            }
                        </nav>
                    </p-card>
                </div>

                <!-- Main Content Area -->
                <div class="md:col-span-9">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>
    `
})
export class SettingsComponent implements OnInit {
    private store = inject(SettingsStore);

    menuItems = [
        { label: 'Company', icon: 'pi pi-building', path: 'company' },
        { label: 'Attendance', icon: 'pi pi-clock', path: 'attendance' },
        { label: 'Leave Policy', icon: 'pi pi-calendar', path: 'leave' },
        { label: 'Payroll', icon: 'pi pi-wallet', path: 'payroll' },
        { label: 'Notifications', icon: 'pi pi-bell', path: 'notifications' }
    ];

    ngOnInit() {
        this.store.loadSettings();
    }
}
