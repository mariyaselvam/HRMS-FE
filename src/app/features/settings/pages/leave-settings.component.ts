import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SettingsStore } from '../../../store/settings.store';
import { CommonInputComponent } from '../../../shared/components/common-input.component';
import { CommonButtonComponent } from '../../../shared/components/common-button.component';

@Component({
    selector: 'app-leave-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, CommonInputComponent, CommonButtonComponent],
    template: `
        <p-card class="!shadow-none !border-slate-300 dark:!border-slate-800">
            <div class="p-6">
                <div class="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Leave Policies</h2>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure company-wide standard leave configurations.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <app-common-input label="Annual Leaves Per Year" [(ngModel)]="form.annualLeaves" placeholder="e.g. 20" icon="pi pi-briefcase" type="number"></app-common-input>
                    <app-common-input label="Sick Leaves Per Year" [(ngModel)]="form.sickLeaves" placeholder="e.g. 10" icon="pi pi-heart-fill" type="number"></app-common-input>
                    <app-common-input label="Carry Forward Limit" [(ngModel)]="form.carryForwardLimit" placeholder="e.g. 5" icon="pi pi-refresh" type="number"></app-common-input>
                    <app-common-input label="Max Consecutive Days" [(ngModel)]="form.maxConsecutive" placeholder="e.g. 14" icon="pi pi-calendar" type="number"></app-common-input>
                    
                    <div class="col-span-1 md:col-span-2 flex items-center gap-4 mt-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <input type="checkbox" id="sandwichRule" [(ngModel)]="form.applySandwich" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 bg-white border-slate-300">
                        <div>
                            <label for="sandwichRule" class="font-semibold text-slate-800 dark:text-slate-200 block">Apply Sandwich Rule</label>
                            <p class="text-xs text-slate-500 mt-1">If a weekend falls between two leave days, it counts as leave.</p>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex justify-end">
                    <app-button label="Save Policies" icon="pi pi-save" variant="primary" (onClick)="save()" [loading]="store.saving()"></app-button>
                </div>
            </div>
        </p-card>
    `
})
export class LeaveSettingsComponent {
    protected store = inject(SettingsStore);
    settingsCategory = 'leave';

    form = {
        annualLeaves: 20,
        sickLeaves: 10,
        carryForwardLimit: 10,
        maxConsecutive: 14,
        applySandwich: false
    };

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
