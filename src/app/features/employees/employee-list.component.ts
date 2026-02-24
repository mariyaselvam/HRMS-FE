import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeStore } from '../../store/employee.store';
import { CommonTableComponent, Column } from '../../shared/components/common-table.component';
import { CommonButtonComponent } from '../../shared/components/common-button.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { EmployeeFormComponent, OnboardPayload } from './employee-form.component';
import { Employee } from '../../core/models/employee.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [CommonModule, CommonTableComponent, CommonButtonComponent, CardModule, DialogModule, EmployeeFormComponent],
    templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
    protected store = inject(EmployeeStore);
    private notify = inject(NotificationService);

    showDialog = false;
    editingEmployee: Employee | null = null;

    columns: Column[] = [
        { field: 'employeeCode', header: 'Employee Code' },
        { field: 'email', header: 'Email' },
        { field: 'department', header: 'Department' },
        { field: 'team', header: 'Team' },
        { field: 'dateOfJoining', header: 'Joining Date', type: 'date' },
        { field: 'employmentStatus', header: 'Status', type: 'status' }
    ];

    get dialogTitle(): string {
        return this.editingEmployee ? 'Edit Employee' : 'Onboard Employee';
    }

    ngOnInit() {
        this.store.loadEmployees();
    }

    openAddDialog(): void {
        this.editingEmployee = null;
        this.showDialog = true;
    }

    onEdit(employee: Employee): void {
        this.editingEmployee = employee;
        this.showDialog = true;
    }

    onSave(payload: OnboardPayload): void {
        if (this.editingEmployee) {
            this.store.updateEmployee(this.editingEmployee.id, payload as any);
        } else {
            this.store.onboardEmployee(payload);
        }
        this.showDialog = false;
        this.editingEmployee = null;
    }

    onCancelDialog(): void {
        this.showDialog = false;
        this.editingEmployee = null;
    }

    onDelete(employee: Employee): void {
        this.notify.confirmDelete(employee.employeeCode, () => {
            this.store.deleteEmployee(employee.id);
        });
    }
}
