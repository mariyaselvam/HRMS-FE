import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { EmployeeStore } from '../../store/employee.store';
import { DepartmentStore } from '../../store/department.store';
import { CommonInputComponent } from '../../shared/components/common-input.component';
import { CommonSelectComponent } from '../../shared/components/common-select.component';
import { CommonDatepickerComponent } from '../../shared/components/common-datepicker.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepperModule,
    ButtonModule,
    CardModule,
    CommonInputComponent,
    CommonSelectComponent,
    CommonDatepickerComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 border-none">Employee Onboarding</h1>
        <p class="text-slate-500">Complete the recruitment journey for a new team member.</p>
      </div>

      <p-stepper [value]="activeStep()" (valueChange)="onStepChange($event)">
        <p-step-list>
          <p-step [value]="1">Account</p-step>
          <p-step [value]="2">Personal</p-step>
          <p-step [value]="3">Job</p-step>
          <p-step [value]="4">Payroll</p-step>
          <p-step [value]="5">Finalize</p-step>
        </p-step-list>

        <p-step-panels>
          <!-- Step 1: Core Account -->
          <p-step-panel [value]="1">
            <ng-template pTemplate="content" let-nextCallback="nextCallback">
              <p-card styleClass="!shadow-none !border-slate-200">
                <form [formGroup]="step1Form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <app-common-input formControlName="email" label="Work Email" type="email" [error]="getErrorMessage(step1Form, 'email')"></app-common-input>
                  <app-common-input formControlName="password" label="Initial Password" type="password" [error]="getErrorMessage(step1Form, 'password')"></app-common-input>
                  <app-common-input formControlName="employeeCode" label="Employee Code" [error]="getErrorMessage(step1Form, 'employeeCode')"></app-common-input>
                  <app-common-select formControlName="departmentId" label="Department" [options]="deptOptions()" [error]="getErrorMessage(step1Form, 'departmentId')"></app-common-select>
                  <app-common-datepicker formControlName="dateOfJoining" label="Joining Date" [error]="getErrorMessage(step1Form, 'dateOfJoining')"></app-common-datepicker>
                </form>
                <div class="flex justify-end mt-8">
                  <p-button label="Next Step" icon="pi pi-arrow-right" iconPos="right" (onClick)="handleStep1(nextCallback)"></p-button>
                </div>
              </p-card>
            </ng-template>
          </p-step-panel>

          <!-- Step 2: Personal Details -->
          <p-step-panel [value]="2">
            <ng-template pTemplate="content" let-prevCallback="prevCallback" let-nextCallback="nextCallback">
              <p-card styleClass="!shadow-none !border-slate-200">
                <form [formGroup]="step2Form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <app-common-input formControlName="firstName" label="First Name" [error]="getErrorMessage(step2Form, 'firstName')"></app-common-input>
                  <app-common-input formControlName="lastName" label="Last Name" [error]="getErrorMessage(step2Form, 'lastName')"></app-common-input>
                  <app-common-input formControlName="mobile" label="Mobile Number" [error]="getErrorMessage(step2Form, 'mobile')"></app-common-input>
                  <app-common-select formControlName="gender" label="Gender" [options]="genderOptions"></app-common-select>
                  <app-common-datepicker formControlName="dob" label="Date of Birth"></app-common-datepicker>
                  <app-common-select formControlName="maritalStatus" label="Marital Status" [options]="maritalOptions"></app-common-select>
                </form>
                <div class="flex justify-between mt-8">
                  <p-button label="Back" icon="pi pi-arrow-left" [text]="true" (onClick)="prevCallback()"></p-button>
                  <p-button label="Save & Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="handleStep2(nextCallback)"></p-button>
                </div>
              </p-card>
            </ng-template>
          </p-step-panel>

          <!-- Step 3: Job Details -->
          <p-step-panel [value]="3">
            <ng-template pTemplate="content" let-prevCallback="prevCallback" let-nextCallback="nextCallback">
              <p-card styleClass="!shadow-none !border-slate-200">
                <form [formGroup]="step3Form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <app-common-input formControlName="designation" label="Designation"></app-common-input>
                  <app-common-select formControlName="employmentType" label="Employment Type" [options]="empTypeOptions"></app-common-select>
                  <app-common-select formControlName="workLocationType" label="Work Mode" [options]="workModeOptions"></app-common-select>
                  <app-common-input formControlName="probationPeriod" label="Probation (Months)" type="number"></app-common-input>
                  <app-common-input formControlName="noticePeriod" label="Notice Period (Days)" type="number"></app-common-input>
                </form>
                <div class="flex justify-between mt-8">
                  <p-button label="Back" icon="pi pi-arrow-left" [text]="true" (onClick)="prevCallback()"></p-button>
                  <p-button label="Save & Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="handleStep3(nextCallback)"></p-button>
                </div>
              </p-card>
            </ng-template>
          </p-step-panel>

          <!-- Step 4: Statutory -->
          <p-step-panel [value]="4">
            <ng-template pTemplate="content" let-prevCallback="prevCallback" let-nextCallback="nextCallback">
              <p-card styleClass="!shadow-none !border-slate-200">
                <form [formGroup]="step4Form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <app-common-input formControlName="accountNumber" label="Bank Account Number"></app-common-input>
                  <app-common-input formControlName="ifscCode" label="IFSC Code"></app-common-input>
                  <app-common-input formControlName="pan" label="PAN Number"></app-common-input>
                  <app-common-input formControlName="uan" label="PF UAN (Optional)"></app-common-input>
                  <app-common-select formControlName="taxRegime" label="Tax Regime" [options]="taxOptions"></app-common-select>
                </form>
                <div class="flex justify-between mt-8">
                  <p-button label="Back" icon="pi pi-arrow-left" [text]="true" (onClick)="prevCallback()"></p-button>
                  <p-button label="Complete Setup" icon="pi pi-check" severity="success" (onClick)="handleStep4(nextCallback)"></p-button>
                </div>
              </p-card>
            </ng-template>
          </p-step-panel>

          <!-- Step 5: Finalize -->
          <p-step-panel [value]="5">
            <ng-template pTemplate="content" let-prevCallback="prevCallback">
              <p-card styleClass="!shadow-none !border-slate-200">
                <div class="text-center py-8">
                  <i class="pi pi-verified text-6xl text-emerald-500 mb-4"></i>
                  <h3 class="text-xl font-bold">Ready to Activate!</h3>
                  <p class="text-slate-500 mb-8 px-12">All mandatory details have been collected. Click below to finalize the onboarding and activate the employee profile.</p>
                  <div class="flex justify-center gap-4">
                    <p-button label="Back to Payroll" [text]="true" (onClick)="prevCallback()"></p-button>
                    <p-button label="Finalize & Activate" severity="success" (onClick)="handleFinalize()"></p-button>
                  </div>
                </div>
              </p-card>
            </ng-template>
          </p-step-panel>
        </p-step-panels>
      </p-stepper>
    </div>
  `
})
export class OnboardingComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected store = inject(EmployeeStore);
  protected deptStore = inject(DepartmentStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeStep = signal(1);
  employeeId = signal<string | null>(null);

  onStepChange(step: number | undefined) {
    if (step !== undefined) {
      this.activeStep.set(step);
    }
  }

  // Forms
  step1Form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    employeeCode: ['', [Validators.required]],
    departmentId: [null, [Validators.required]],
    dateOfJoining: [new Date(), [Validators.required]]
  });

  step2Form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    gender: ['Male'],
    dob: [null],
    maritalStatus: ['Single'],
    currentAddress: [''],
    permAddress: ['']
  });

  step3Form: FormGroup = this.fb.group({
    designation: [''],
    employmentType: ['Full-time'],
    workLocationType: ['Office'],
    probationPeriod: [6],
    noticePeriod: [90]
  });

  step4Form: FormGroup = this.fb.group({
    accountNumber: ['', [Validators.pattern(/^\d{9,18}$/)]],
    ifscCode: ['', [Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
    pan: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
    uan: [''],
    taxRegime: ['new']
  });

  // Options
  deptOptions = computed(() =>
    this.deptStore.departments().map(d => ({ label: d.name, value: d.id }))
  );

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];
  maritalOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' }
  ];
  empTypeOptions = [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Intern', value: 'Intern' }
  ];
  workModeOptions = [
    { label: 'Office', value: 'Office' },
    { label: 'Remote', value: 'Remote' },
    { label: 'Hybrid', value: 'Hybrid' }
  ];
  taxOptions = [
    { label: 'New Tax Regime', value: 'new' },
    { label: 'Old Tax Regime', value: 'old' }
  ];

  ngOnInit() {
    this.deptStore.loadDepartments();

    // Check if resuming from ID
    this.route.params.subscribe(params => {
      if (params['id']) {
        const id = params['id'];
        this.employeeId.set(id);
        this.fetchEmployeeData(id);
      }
    });
  }

  fetchEmployeeData(id: string) {
    this.store.getEmployee(id).subscribe(emp => {
      // 1. Pre-fill Step 1 (Core)
      this.step1Form.patchValue({
        email: emp.email,
        employeeCode: emp.employeeCode,
        departmentId: emp.departmentId,
        dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining) : new Date()
      });

      // 2. Pre-fill Step 2 (Personal)
      if (emp.personalDetails) {
        this.step2Form.patchValue({
          ...emp.personalDetails,
          dob: emp.personalDetails.dob ? new Date(emp.personalDetails.dob) : null
        });
      }

      // 3. Pre-fill Step 3 (Job)
      if (emp.jobDetails) {
        this.step3Form.patchValue(emp.jobDetails);
      }

      // 4. Pre-fill Step 4 (Statutory/Bank)
      if (emp.bankDetails || emp.statutoryDetails) {
        this.step4Form.patchValue({
          accountNumber: emp.bankDetails?.accountNumber,
          ifscCode: emp.bankDetails?.ifscCode,
          pan: emp.statutoryDetails?.pan,
          uan: emp.statutoryDetails?.uan,
          taxRegime: emp.statutoryDetails?.taxRegime
        });
      }

      // 5. Jump to correct step
      // If the backend says the next step is 3, they finished 2.
      // So we set activeStep to what the backend says.
      this.activeStep.set(emp.onboardingStep || 1);
    });
  }

  getErrorMessage(form: FormGroup, controlName: string): string | null {
    const control = form.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) return 'Required';
      if (control.errors?.['email']) return 'Invalid email';
      if (control.errors?.['pattern']) return 'Invalid format';
      if (control.errors?.['minlength']) return `Min ${control.errors['minlength'].requiredLength} chars`;
    }
    return null;
  }

  handleStep1(nextCallback: any) {
    if (this.step1Form.invalid) {
      this.step1Form.markAllAsTouched();
      return;
    }
    this.store.onboardEmployee(this.step1Form.value).subscribe({
      next: (newEmp) => {
        this.employeeId.set(newEmp.id);
        this.activeStep.set(2);
        if (typeof nextCallback === 'function') nextCallback();
      },
      error: () => { }
    });
  }

  handleStep2(nextCallback: any) {
    if (this.step2Form.invalid) {
      this.step2Form.markAllAsTouched();
      return;
    }
    this.store.savePersonalDetails(this.employeeId()!, this.step2Form.value);
    this.activeStep.set(3);
    if (typeof nextCallback === 'function') nextCallback();
  }

  handleStep3(nextCallback: any) {
    if (this.step3Form.invalid) {
      this.step3Form.markAllAsTouched();
      return;
    }
    this.store.saveJobDetails(this.employeeId()!, this.step3Form.value);
    this.activeStep.set(4);
    if (typeof nextCallback === 'function') nextCallback();
  }

  handleStep4(nextCallback: any) {
    if (this.step4Form.invalid) {
      this.step4Form.markAllAsTouched();
      return;
    }
    this.store.saveStatutoryDetails(this.employeeId()!, this.step4Form.value);
    this.activeStep.set(5);
    if (typeof nextCallback === 'function') nextCallback();
  }

  handleFinalize() {
    this.store.finalizeOnboarding(this.employeeId()!);
    this.router.navigate(['/employees']);
  }
}
