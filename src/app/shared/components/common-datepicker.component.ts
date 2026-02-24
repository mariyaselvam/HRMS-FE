import { Component, input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-common-datepicker',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePickerModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CommonDatepickerComponent),
            multi: true
        }
    ],
    templateUrl: './common-datepicker.component.html',
    styleUrl: './common-datepicker.component.css'
})
export class CommonDatepickerComponent implements ControlValueAccessor {
    id = input<string>('datepicker-' + Math.random().toString(36).substring(2, 9));
    label = input<string>('');
    placeholder = input<string>('Select date');
    dateFormat = input<string>('yy-mm-dd');
    showIcon = input<boolean>(true);
    error = input<string | null>(null);

    disabled = signal<boolean>(false);
    value: Date | null = null;

    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        if (value) {
            // Handle both string dates and Date objects
            this.value = typeof value === 'string' ? new Date(value) : value;
        } else {
            this.value = null;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    onDateChange(date: Date | null): void {
        this.value = date;
        if (date) {
            // Format as YYYY-MM-DD string for the backend
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            this.onChange(`${year}-${month}-${day}`);
        } else {
            this.onChange(null);
        }
    }

    onBlur(): void {
        this.onTouched();
    }
}
