import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeStore } from '../../store/employee.store';
import { CommonTableComponent, Column } from '../../shared/components/common-table.component';
import { CommonButtonComponent } from '../../shared/components/common-button.component';
import { CardModule } from 'primeng/card';

import { Employee } from '../../core/models/employee.model';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [CommonModule, CommonTableComponent, CommonButtonComponent, CardModule],
    templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
    protected store = inject(EmployeeStore);
    private notify = inject(NotificationService);
    private router = inject(Router);



    columns: Column[] = [
        { field: 'employeeCode', header: 'Employee Code' },
        { field: 'email', header: 'Email' },
        { field: 'department', header: 'Department' },
        { field: 'workLocation', header: 'Branch' },
        { field: 'team', header: 'Team' },
        { field: 'dateOfJoining', header: 'Joining Date', type: 'date' },
        { field: 'profileCompletion', header: 'Progress', type: 'progress' },
        { field: 'employmentStatus', header: 'Status', type: 'status' }
    ];



    ngOnInit() {
        this.store.loadEmployees();
    }

    openAddDialog(): void {
        this.router.navigate(['/employees/onboard']);
    }

    onEdit(employee: Employee): void {
        this.router.navigate(['/employees/onboard', employee.id]);
    }

    onDelete(employee: Employee): void {
        this.notify.confirmDelete(employee.employeeCode, () => {
            this.store.deleteEmployee(employee.id);
        });
    }
}
