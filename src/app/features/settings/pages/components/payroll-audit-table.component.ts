import { Component, Input, OnChanges, inject, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PayrollRulesService } from '../../services/payroll-rules.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-payroll-audit-table',
    standalone: true,
    imports: [CommonModule, TableModule, TagModule, DatePipe, DecimalPipe],
    template: `
        <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <p-table [value]="runs" [loading]="loading" [paginator]="true" [rows]="10" styleClass="p-datatable-sm p-datatable-gridlines">
                <ng-template pTemplate="header">
                    <tr>
                        <th class="!bg-slate-50 dark:!bg-slate-900 !text-slate-700 dark:!text-slate-300">Period</th>
                        <th class="!bg-slate-50 dark:!bg-slate-900 !text-slate-700 dark:!text-slate-300">Run Type</th>
                        <th class="!bg-slate-50 dark:!bg-slate-900 !text-slate-700 dark:!text-slate-300">Started At</th>
                        <th class="!bg-slate-50 dark:!bg-slate-900 !text-slate-700 dark:!text-slate-300">Status</th>
                        <th class="!bg-slate-50 dark:!bg-slate-900 !text-slate-700 dark:!text-slate-300">Employees</th>
                        <th class="!bg-slate-50 dark:!bg-slate-900 !text-slate-700 dark:!text-slate-300">Total Amount</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-run>
                    <tr>
                        <td>{{ run.payrollPeriod }}</td>
                        <td>{{ run.runType }}</td>
                        <td>{{ run.startedAt | date:'medium' }}</td>
                        <td>
                            <p-tag [severity]="getSeverity(run.status)" [value]="run.status"></p-tag>
                            <span *ngIf="run.errorMessage" class="text-xs text-red-500 block mt-1" [title]="run.errorMessage">Error details</span>
                        </td>
                        <td>{{ run.employeeCount }}</td>
                        <td>{{ run.totalAmount | number:'1.2-2' }}</td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td colspan="6" class="text-center p-4">No payroll runs found.</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class PayrollAuditTableComponent implements OnChanges {
    @Input() refreshTrigger = 0;
    
    private service = inject(PayrollRulesService);
    private notify = inject(NotificationService);

    runs: any[] = [];
    loading = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['refreshTrigger']) {
            this.loadRuns();
        }
    }

    loadRuns() {
        this.loading = true;
        this.service.getRuns().subscribe({
            next: (res: any) => {
                this.runs = res || [];
                this.loading = false;
            },
            error: (err: any) => {
                this.notify.error('Failed to load runs', err.message);
                this.loading = false;
            }
        });
    }

    getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (status) {
            case 'Completed': return 'success';
            case 'Processing': return 'warn';
            case 'Failed': return 'danger';
            default: return 'info';
        }
    }
}
