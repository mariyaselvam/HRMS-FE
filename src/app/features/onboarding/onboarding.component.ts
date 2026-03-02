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
import { LocationStore } from '../../store/location.store';
import { GENDER_OPTIONS, MARITAL_OPTIONS, EMP_TYPE_OPTIONS, WORK_MODE_OPTIONS, TAX_OPTIONS, ROLE_OPTIONS, STATUS_OPTIONS } from './onboarding.constants';

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
  templateUrl: './onboarding.component.html'
})
export class OnboardingComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected store = inject(EmployeeStore);
  protected deptStore = inject(DepartmentStore);
  protected locationStore = inject(LocationStore);
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
    workLocationId: [null, [Validators.required]],
    dateOfJoining: [new Date(), [Validators.required]],
    role: ['employee', [Validators.required]],
    status: ['probation', [Validators.required]],
    managerId: [null]
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

  locationOptions = computed(() =>
    this.locationStore.locations().map(l => ({ label: l.name, value: l.id }))
  );

  genderOptions = GENDER_OPTIONS;
  maritalOptions = MARITAL_OPTIONS;
  empTypeOptions = EMP_TYPE_OPTIONS;
  workModeOptions = WORK_MODE_OPTIONS;
  taxOptions = TAX_OPTIONS;
  roleOptions = ROLE_OPTIONS;
  statusOptions = STATUS_OPTIONS;

  employeeOptions = computed(() =>
    this.store.employees().map(e => ({ label: e.email, value: e.id }))
  );

  ngOnInit() {
    this.deptStore.loadDepartments();
    this.locationStore.loadLocations();
    this.store.loadEmployees();

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
        workLocationId: emp.workLocationId,
        dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining) : new Date(),
        role: emp.role || 'employee',
        status: emp.employmentStatus || 'probation',
        managerId: emp.managerId || null
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
