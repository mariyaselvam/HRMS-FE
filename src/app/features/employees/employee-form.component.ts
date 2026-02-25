import { Component, inject, output, input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonInputComponent } from '../../shared/components/common-input.component';
import { CommonSelectComponent } from '../../shared/components/common-select.component';
import { CommonDatepickerComponent } from '../../shared/components/common-datepicker.component';
import { CommonButtonComponent } from '../../shared/components/common-button.component';
import { Employee } from '../../core/models/employee.model';
import { EmployeeStore } from '../../store/employee.store';
import { DepartmentStore } from '../../store/department.store';

export interface OnboardPayload {
    email: string;
    password: string;
    employeeCode: string;
    departmentId: string;
    role: string;
    managerId?: string | null;
    dateOfJoining: string;
    status: string;
}


@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CommonInputComponent, CommonSelectComponent, CommonDatepickerComponent, CommonButtonComponent],
    templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    protected employeeStore = inject(EmployeeStore);
    protected departmentStore = inject(DepartmentStore);

    employeeData = input<Employee | null>(null);
    submitLabel = input<string>('Onboard Employee');

    save = output<OnboardPayload>();
    cancel = output<void>();

    submitted = false;

    form: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        employeeCode: ['', [Validators.required]],
        departmentId: [null, [Validators.required]],
        role: ['employee', [Validators.required]],
        managerId: [null],
        dateOfJoining: ['', [Validators.required]],
        status: ['probation', [Validators.required]]
    });

    statuses = [
        { label: 'Active', value: 'active' },
        { label: 'Probation', value: 'probation' },
        { label: 'Notice', value: 'notice' }
    ];

    roles = [
        { label: 'Employee', value: 'employee' },
        { label: 'Manager', value: 'manager' },
        { label: 'HR', value: 'hr' }
    ];

    ngOnInit() {
        this.departmentStore.loadDepartments();
        this.employeeStore.loadEmployees();
        this.resetForm();
    }


    ngOnChanges() {
        this.resetForm();
    }

    resetForm(): void {
        this.submitted = false;
        if (this.employeeData()) {
            this.form.patchValue(this.employeeData()!);
            this.form.get('password')?.clearValidators();
            this.form.get('password')?.updateValueAndValidity();
        } else {
            this.form.reset({ status: 'probation', role: 'employee' });
            this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
            this.form.get('password')?.updateValueAndValidity();
        }
        this.form.markAsPristine();
        this.form.markAsUntouched();
    }

    getErrorMessage(controlName: string): string | null {
        if (!this.submitted) return null;
        const control = this.form.get(controlName);
        if (control && control.invalid) {
            if (control.errors?.['required']) return 'This field is required';
            if (control.errors?.['email']) return 'Invalid email address';
            if (control.errors?.['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters`;
        }
        return null;
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.valid) {
            this.save.emit(this.form.value as OnboardPayload);
            this.submitted = false;
        }
    }
}
