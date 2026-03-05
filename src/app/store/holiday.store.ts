import { Injectable, signal, computed, inject } from '@angular/core';
import { Holiday, HolidayState, CreateHolidayInput } from '../core/models/holiday.model';
import { BaseHttpService } from '../core/services/base-http.service';
import { API_ENDPOINTS } from '../core/constants/app.constants';
import { ApiResponse } from '../core/models/employee.model';
import { NotificationService } from '../core/services/notification.service';
import { finalize } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HolidayStore {
    private http = inject(BaseHttpService);
    private notify = inject(NotificationService);

    // State
    private state = signal<HolidayState>({
        holidays: [],
        loading: false,
        error: null
    });

    // Selectors
    readonly holidays = computed(() => this.state().holidays);
    readonly loading = computed(() => this.state().loading);
    readonly error = computed(() => this.state().error);

    // Actions
    loadHolidays(year?: number) {
        this.setLoading(true);
        const params = year ? { year } : {};
        this.http.get<ApiResponse<Holiday[]>>(API_ENDPOINTS.HOLIDAYS, params)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => this.state.update(s => ({ ...s, holidays: res.data })),
                error: (err) => this.handleError('Failed to load holidays', err)
            });
    }

    addHoliday(data: CreateHolidayInput) {
        this.setLoading(true);
        this.http.post<ApiResponse<Holiday>>(API_ENDPOINTS.HOLIDAYS, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.state.update(s => ({ ...s, holidays: [...s.holidays, res.data] }));
                    this.notify.success('Holiday Added', `Successfully added ${res.data.name}`);
                },
                error: (err) => this.handleError('Failed to add holiday', err)
            });
    }

    deleteHoliday(id: string) {
        this.setLoading(true);
        this.http.delete<ApiResponse<any>>(`${API_ENDPOINTS.HOLIDAYS}/${id}`)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: () => {
                    this.state.update(s => ({
                        ...s,
                        holidays: s.holidays.filter(h => h.id !== id)
                    }));
                    this.notify.success('Holiday Deleted', 'The holiday has been removed.');
                },
                error: (err) => this.handleError('Failed to delete holiday', err)
            });
    }

    private setLoading(loading: boolean) {
        this.state.update(s => ({ ...s, loading }));
    }

    private handleError(summary: string, error: any) {
        const errorMsg = error.error?.message || error.message || 'An unexpected error occurred';
        this.state.update(s => ({ ...s, error: errorMsg }));
        this.notify.error(summary, errorMsg);
    }
}
