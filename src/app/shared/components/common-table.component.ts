import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

export interface Column {
    field: string;
    header: string;
    type?: 'text' | 'date' | 'time' | 'duration' | 'status' | 'action';
}

@Component({
    selector: 'app-common-table',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule],
    templateUrl: './common-table.component.html',
    styleUrl: './common-table.component.css'
})
export class CommonTableComponent {
    data = input<any[]>([]);
    columns = input<Column[]>([]);
    hasActions = input<boolean>(false);

    edit = output<any>();
    delete = output<any>();

    resolveFieldValue(rowData: any, field: string): any {
        if (!field) return '';
        return field.split('.').reduce((acc, part) => acc && acc[part], rowData);
    }

    getStatusClass(value: any): string {
        const val = String(value).toLowerCase();
        switch (val) {
            case 'present':
            case 'active':
            case 'approved':
            case 'paid':
            case 'true':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50';
            case 'absent':
            case 'inactive':
            case 'rejected':
            case 'unpaid':
            case 'false':
                return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50';
            case 'late':
            case 'pending':
            case 'probation':
                return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50';
            case 'notice':
            case 'cancelled':
                return 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700';
        }
    }

    getStatusLabel(value: any): string {
        if (value === true || value === 'true') return 'Paid';
        if (value === false || value === 'false') return 'Unpaid';
        return String(value);
    }

    /**
     * Converts a raw duration value to human-readable "Xhr Ym" format.
     * Handles milliseconds (if value > 1000) OR decimal hours (if value <= 24).
     */
    formatDuration(value: any): string {
        if (value === null || value === undefined || value === '') return '—';
        const num = Number(value);
        if (isNaN(num) || num === 0) return '0h 0m';

        let totalMinutes: number;

        if (num > 1000) {
            // Likely raw milliseconds from backend
            totalMinutes = Math.floor(num / 1000 / 60);
        } else {
            // Likely already in decimal hours (e.g. 8.5)
            totalMinutes = Math.floor(num * 60);
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    }
}
