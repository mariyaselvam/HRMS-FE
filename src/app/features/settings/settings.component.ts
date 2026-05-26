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

            <div class="flex flex-col gap-6">
                <!-- Top Navigation -->
                <div class="border-b border-slate-200 dark:border-slate-800">
                    <nav class="flex overflow-x-auto">
                        @for (item of menuItems; track item.path) {
                            <a [routerLink]="item.path"
                               routerLinkActive="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-semibold"
                               [routerLinkActiveOptions]="{exact: false}"
                               class="flex items-center gap-2 px-6 py-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors border-b-2 border-transparent text-sm font-medium whitespace-nowrap">
                                <i [class]="item.icon + ' text-lg opacity-70'"></i>
                                {{ item.label }}
                            </a>
                        }
                    </nav>
                </div>

                <!-- Main Content Area -->
                <div class="px-2">
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
        { label: 'Payroll', icon: 'pi pi-wallet', path: 'payroll' },
        { label: 'Notifications', icon: 'pi pi-bell', path: 'notifications' }
    ];

    ngOnInit() {
        this.store.loadSettings();
    }
}
