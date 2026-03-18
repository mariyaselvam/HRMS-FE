import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SettingsStore } from '../../../store/settings.store';
import { CommonInputComponent } from '../../../shared/components/common-input.component';
import { CommonButtonComponent } from '../../../shared/components/common-button.component';

@Component({
    selector: 'app-attendance-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, CommonInputComponent, CommonButtonComponent],
    template: `
        <p-card class="!shadow-none !border-slate-300 dark:!border-slate-800">
            <div class="p-6">
                <div class="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Attendance Policies</h2>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure global working hours, grace periods, and tracking constraints.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <app-common-input label="Standard Work Hours" [(ngModel)]="form.workHours" placeholder="e.g. 8" icon="pi pi-clock" type="number"></app-common-input>
                    <app-common-input label="Late Grace Time (Mins)" [(ngModel)]="form.lateGraceMins" placeholder="e.g. 10" icon="pi pi-step-forward" type="number"></app-common-input>
                    <app-common-input label="Half Day Threshold (Hours)" [(ngModel)]="form.halfDayThreshold" placeholder="e.g. 4.5" icon="pi pi-adjust" type="number"></app-common-input>
                    <app-common-input label="Auto Checkout Time" [(ngModel)]="form.autoCheckout" placeholder="e.g. 23:00" icon="pi pi-sign-out" type="time"></app-common-input>
                </div>

                <div class="mt-6 flex justify-end">
                    <app-button label="Save Policies" icon="pi pi-save" variant="primary" (onClick)="save()" [loading]="store.saving()"></app-button>
                </div>
            </div>
        </p-card>
    `
})
export class AttendanceSettingsComponent {
    protected store = inject(SettingsStore);
    settingsCategory = 'attendance';

    form = {
        workHours: 8,
        lateGraceMins: 10,
        halfDayThreshold: 4,
        autoCheckout: '20:30'
    };

    constructor() {
        const catSettings = this.store.getCategorySettings(this.settingsCategory);
        effect(() => {
            const data = catSettings();
            if (data && Object.keys(data).length > 0) {
                setTimeout(() => {
                    this.form = { ...this.form, ...data };
                });
            }
        });
    }

    save() {
        this.store.updateCategorySettings(this.settingsCategory, this.form);
    }
}
