import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { EmployeeFormComponent } from './employee-form.component';
import { EmployeeStore } from '../../store/employee.store';
import { Employee } from '../../core/models/employee.model';

@Component({
    selector: 'app-employee-add',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, EmployeeFormComponent],
    template: `
    <div class="space-y-6">
      <div class="flex items-center gap-4 px-4">
        <p-button icon="pi pi-arrow-left" [text]="true" [rounded]="true"
          (onClick)="goBack()"></p-button>
        <div>
          <h1 class="text-2xl font-bold text-slate-900 border-none">Add Employee</h1>
          <p class="text-slate-500">Create a new employee record</p>
        </div>
      </div>

      <p-card styleClass="!shadow-sm !border-slate-200">
        <app-employee-form
          submitLabel="Create Employee"
          (save)="onSave($event)"
          (cancel)="goBack()">
        </app-employee-form>
      </p-card>
    </div>
  `
})
export class EmployeeAddComponent {
    private store = inject(EmployeeStore);
    private router = inject(Router);

    onSave(employee: Partial<Employee>): void {
        this.store.addEmployee(employee);
        this.router.navigate(['/employees']);
    }

    goBack(): void {
        this.router.navigate(['/employees']);
    }
}
