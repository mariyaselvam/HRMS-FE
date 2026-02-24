import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollStore } from '../../store/payroll.store';
import { CommonTableComponent, Column } from '../../shared/components/common-table.component';
import { CommonButtonComponent } from '../../shared/components/common-button.component';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-payroll',
    standalone: true,
    imports: [
        CommonModule,
        CommonTableComponent,
        CommonButtonComponent,
        CardModule,
        FormsModule
    ],
    templateUrl: './payroll.component.html'
})
export class PayrollComponent implements OnInit {
    protected store = inject(PayrollStore);

    selectedMonth: string = new Date().toISOString().slice(0, 7); // YYYY-MM

    columns: Column[] = [
        { field: 'employee.user.email', header: 'Employee' },
        { field: 'employee.department.name', header: 'Department' },
        { field: 'grossSalary', header: 'Gross' },
        { field: 'attendanceDeduction', header: 'Deductions' },
        { field: 'netSalary', header: 'Net Salary' },
        { field: 'status', header: 'Status', type: 'status' }
    ];

    ngOnInit() {
        this.loadPayroll();
    }

    loadPayroll() {
        if (this.selectedMonth) {
            this.store.loadRecords(this.selectedMonth);
        }
    }

    onGenerate() {
        if (this.selectedMonth) {
            this.store.generatePayroll({ month: this.selectedMonth });
        }
    }

    onFinalize() {
        const firstRecord = this.store.records()[0];
        if (firstRecord && confirm('Are you sure you want to finalize this month\'s payroll? This cannot be undone.')) {
            this.store.finalizePayroll(firstRecord.payrollCycleId, this.selectedMonth);
        }
    }

    get canFinalize(): boolean {
        const records = this.store.records();
        return records.length > 0 && records[0].status !== 'finalized';
    }
}
