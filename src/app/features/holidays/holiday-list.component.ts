import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HolidayStore } from '../../store/holiday.store';
import { CommonTableComponent, Column } from '../../shared/components/common-table.component';
import { CommonButtonComponent } from '../../shared/components/common-button.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonInputComponent } from '../../shared/components/common-input.component';
import { CommonDatepickerComponent } from '../../shared/components/common-datepicker.component';
import { Holiday } from '../../core/models/holiday.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-holiday-list',
    standalone: true,
    imports: [
        CommonModule,
        CommonTableComponent,
        CommonButtonComponent,
        CardModule,
        DialogModule,
        CheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        CommonInputComponent,
        CommonDatepickerComponent
    ],
    templateUrl: './holiday-list.component.html'
})
export class HolidayListComponent implements OnInit {
    protected store = inject(HolidayStore);
    private fb = inject(FormBuilder);
    private notify = inject(NotificationService);

    showDialog = false;
    submitted = false;

    columns: Column[] = [
        { field: 'date', header: 'Date', type: 'date' },
        { field: 'name', header: 'Holiday Name' },
        { field: 'isOptional', header: 'Type', type: 'boolean' }
    ];

    form = this.fb.group({
        name: ['', [Validators.required]],
        date: [null as any, [Validators.required]],
        isOptional: [false]
    });

    ngOnInit() {
        this.store.loadHolidays();
    }

    openAddDialog() {
        this.form.reset({ isOptional: false });
        this.submitted = false;
        this.showDialog = true;
    }

    onDelete(holiday: Holiday) {
        this.notify.confirmDelete(holiday.name, () => {
            this.store.deleteHoliday(holiday.id);
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.valid) {
            this.store.addHoliday(this.form.value as any);
            this.showDialog = false;
        }
    }

    getErrorMessage(controlName: string): string | null {
        if (!this.submitted) return null;
        const control = this.form.get(controlName);
        if (control?.errors?.['required']) return 'This field is required';
        return null;
    }
}
