import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentStore } from '../../store/department.store';
import { CommonTableComponent, Column } from '../../shared/components/common-table.component';
import { CommonButtonComponent } from '../../shared/components/common-button.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonInputComponent } from '../../shared/components/common-input.component';
import { Department } from '../../core/models/department.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-department-list',
    standalone: true,
    imports: [
        CommonModule,
        CommonTableComponent,
        CommonButtonComponent,
        CardModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        CommonInputComponent
    ],
    templateUrl: './department-list.component.html'
})
export class DepartmentListComponent implements OnInit {
    protected store = inject(DepartmentStore);
    private fb = inject(FormBuilder);
    private notify = inject(NotificationService);

    showDialog = false;
    submitted = false;
    editingDepartment: Department | null = null;

    columns: Column[] = [
        { field: 'name', header: 'Department Name' },
        { field: 'createdAt', header: 'Created At', type: 'date' }
    ];

    form = this.fb.group({
        name: ['', [Validators.required]]
    });

    ngOnInit() {
        this.store.loadDepartments();
    }

    get dialogTitle(): string {
        return this.editingDepartment ? 'Edit Department' : 'Add Department';
    }

    openAddDialog() {
        this.editingDepartment = null;
        this.form.reset();
        this.submitted = false;
        this.showDialog = true;
    }

    onEdit(department: Department) {
        this.editingDepartment = department;
        this.form.patchValue({
            name: department.name
        });
        this.submitted = false;
        this.showDialog = true;
    }

    onDelete(department: Department) {
        this.notify.confirmDelete(department.name, () => {
            this.store.deleteDepartment(department.id);
        });
    }

    onSave() {
        this.submitted = true;
        if (this.form.valid) {
            if (this.editingDepartment) {
                this.store.updateDepartment(this.editingDepartment.id, this.form.value as { name: string });
            } else {
                this.store.addDepartment(this.form.value as { name: string });
            }
            this.showDialog = false;
        }
    }

    getErrorMessage(controlName: string): string | null {
        if (!this.submitted) return null;
        const control = this.form.get(controlName);
        if (control?.errors?.['required']) return 'Department name is required';
        return null;
    }
}
