import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SettingsStore } from '../../../store/settings.store';
import { CommonInputComponent } from '../../../shared/components/common-input.component';
import { CommonSelectComponent } from '../../../shared/components/common-select.component';
import { CommonButtonComponent } from '../../../shared/components/common-button.component';

@Component({
    selector: 'app-company-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, ButtonModule, CommonInputComponent, CommonSelectComponent, CommonButtonComponent],
    template: `
        <p-card class="!shadow-none !border-slate-300 dark:!border-slate-800">
            <div class="p-6">
                <div class="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Company Profile</h2>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage standard company configurations.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <app-common-input label="Company Name" [(ngModel)]="form.companyName" placeholder="Enter company name..." icon="pi pi-building"></app-common-input>
                    <app-common-input label="Contact Email" [(ngModel)]="form.hrEmail" placeholder="HR contact email..." icon="pi pi-envelope" type="email"></app-common-input>
                    <app-common-select label="Timezone" [options]="timezoneOptions" [(ngModel)]="form.timezone" placeholder="Select timezone..."></app-common-select>
                    <app-common-select label="Currency" [options]="currencyOptions" [(ngModel)]="form.currency" placeholder="Select currency..."></app-common-select>
                    <app-common-select label="Date Format" [options]="dateFormatOptions" [(ngModel)]="form.dateFormat" placeholder="Select date format..."></app-common-select>
                    <app-common-input label="Fiscal Year Start" [(ngModel)]="form.fiscalYear" placeholder="e.g. April to March" icon="pi pi-calendar"></app-common-input>
                </div>

                <div class="mt-6 flex justify-end">
                    <app-button label="Save Changes" icon="pi pi-save" variant="primary" (onClick)="save()" [loading]="store.saving()"></app-button>
                </div>
            </div>
        </p-card>
    `
})
export class CompanySettingsComponent {
    protected store = inject(SettingsStore);
    settingsCategory = 'company';

    // Form model
    form = {
        companyName: '',
        hrEmail: '',
        timezone: 'UTC',
        currency: 'USD',
        dateFormat: 'DD/MM/YYYY',
        fiscalYear: 'January to December'
    };

    // Dropdown choices
    timezoneOptions = [
        { label: 'UTC (GMT)', value: 'UTC' },
        { label: 'IST (India Standard Time)', value: 'Asia/Kolkata' },
        { label: 'PST (Pacific Standard Time)', value: 'America/Los_Angeles' },
        { label: 'AEST (Australian Eastern Standard Time)', value: 'Australia/Sydney' }
    ];

    currencyOptions = [
        { label: 'USD ($)', value: 'USD' },
        { label: 'INR (₹)', value: 'INR' },
        { label: 'EUR (€)', value: 'EUR' },
        { label: 'GBP (£)', value: 'GBP' }
    ];

    dateFormatOptions = [
        { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
        { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
        { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
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
