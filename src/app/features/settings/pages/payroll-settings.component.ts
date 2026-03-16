import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SettingsStore } from '../../../store/settings.store';
import { CommonInputComponent } from '../../../shared/components/common-input.component';
import { CommonSelectComponent } from '../../../shared/components/common-select.component';
import { CommonButtonComponent } from '../../../shared/components/common-button.component';

@Component({
    selector: 'app-payroll-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, CommonInputComponent, CommonSelectComponent, CommonButtonComponent],
    template: `
        <p-card class="!shadow-none !border-slate-300 dark:!border-slate-800">
            <div class="p-6">
                <div class="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Payroll Rules</h2>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Setup configurations regarding compensations and cycles.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <app-common-select label="Salary Cycle" [options]="cycleOptions" [(ngModel)]="form.cycle" placeholder="Select cycle..."></app-common-select>
                    <app-common-input label="Pay Date (Day of Month)" [(ngModel)]="form.payDate" placeholder="e.g. 30" icon="pi pi-calendar-times" type="number"></app-common-input>
                    <app-common-input label="Overtime Multiplier" [(ngModel)]="form.overtimeMultiplier" placeholder="e.g. 1.5" icon="pi pi-percentage" type="number"></app-common-input>
                    
                    <div class="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex items-center gap-4 mt-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                            <input type="checkbox" id="taxDeduction" [(ngModel)]="form.taxDeductionEnabled" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 bg-white border-slate-300">
                            <div>
                                <label for="taxDeduction" class="font-semibold text-slate-800 dark:text-slate-200 block">Enable Tax Deduction</label>
                                <p class="text-xs text-slate-500 mt-1">Auto deduct income tax dynamically</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4 mt-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                            <input type="checkbox" id="pfEsi" [(ngModel)]="form.pfEsiEnabled" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 bg-white border-slate-300">
                            <div>
                                <label for="pfEsi" class="font-semibold text-slate-800 dark:text-slate-200 block">Enable PF / ESI</label>
                                <p class="text-xs text-slate-500 mt-1">Compute statutory compliance metrics</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex justify-end">
                    <app-button label="Save Rules" icon="pi pi-save" variant="primary" (onClick)="save()" [loading]="store.saving()"></app-button>
                </div>
            </div>
        </p-card>
    `
})
export class PayrollSettingsComponent {
    protected store = inject(SettingsStore);
    settingsCategory = 'payroll';

    form = {
        cycle: 'monthly',
        payDate: 30,
        overtimeMultiplier: 1.5,
        taxDeductionEnabled: true,
        pfEsiEnabled: true
    };

    cycleOptions = [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Bi-Weekly', value: 'bi-weekly' },
        { label: 'Monthly', value: 'monthly' }
    ];

    constructor() {
        const catSettings = this.store.getCategorySettings(this.settingsCategory);
        effect(() => {
            const data = catSettings();
            if (data && Object.keys(data).length > 0) {
                this.form = { ...this.form, ...data };
            }
        });
    }

    save() {
        this.store.updateCategorySettings(this.settingsCategory, this.form);
    }
}
