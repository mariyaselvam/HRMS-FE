import { Injectable, signal, computed, inject } from '@angular/core';
import {
    AttendanceLog,
    Shift,
    AttendanceState,
    CheckInInput,
    CheckOutInput,
    CreateShiftInput,
    AttendanceLogFilters
} from '../core/models/attendance.model';
import { BaseHttpService } from '../core/services/base-http.service';
import { API_ENDPOINTS } from '../core/constants/app.constants';
import { ApiResponse } from '../core/models/employee.model';
import { NotificationService } from '../core/services/notification.service';
import { finalize } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AttendanceStore {
    private http = inject(BaseHttpService);
    private notify = inject(NotificationService);

    // State
    private state = signal<AttendanceState>({
        logs: [],
        shifts: [],
        todayStatus: null,
        loading: false,
        error: null
    });

    // Selectors
    readonly logs = computed(() => this.state().logs);
    readonly shifts = computed(() => this.state().shifts);
    readonly todayStatus = computed(() => this.state().todayStatus);
    readonly loading = computed(() => this.state().loading);
    readonly error = computed(() => this.state().error);

    // ─── Flow 4: GET /attendance/logs ─────────────────────────────────────────
    loadLogs(filters: AttendanceLogFilters = {}) {
        this.setLoading(true);
        this.http.get<ApiResponse<AttendanceLog[]>>(`${API_ENDPOINTS.ATTENDANCE}/logs`, filters)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.state.update(s => ({ ...s, logs: res.data }));
                    // Compare using local date to avoid UTC offset issues (e.g. IST +5:30)
                    const now = new Date();
                    const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                    const todayLog = res.data.find(l => {
                        // attendanceDate comes as "2026-02-22T00:00:00.000Z" — use UTC date part
                        const logDate = l.attendanceDate ? l.attendanceDate.split('T')[0] : '';
                        return logDate === todayLocal;
                    });
                    if (todayLog) {
                        this.state.update(s => ({ ...s, todayStatus: todayLog }));
                    }
                },
                error: (err) => this.handleError('Failed to load attendance logs', err)
            });
    }

    // ─── Flow 2: POST /attendance/check-in ────────────────────────────────────
    // Body: { shiftId?, workLocationId?, note? }
    checkIn(data: CheckInInput = {}) {
        this.setLoading(true);
        this.http.post<ApiResponse<AttendanceLog>>(`${API_ENDPOINTS.ATTENDANCE}/check-in`, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    const checkInTime = new Date(res.data.checkIn!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    this.state.update(s => ({
                        ...s,
                        todayStatus: res.data,
                        logs: [res.data, ...s.logs]
                    }));
                    this.notify.success('Check-In Successful', `Checked in at ${checkInTime}`);
                },
                error: (err) => this.handleError('Check-In Failed', err)
            });
    }

    // ─── Flow 3: POST /attendance/check-out ───────────────────────────────────
    // Body: { note? } only
    checkOut(data: CheckOutInput = {}) {
        this.setLoading(true);
        this.http.post<ApiResponse<AttendanceLog>>(`${API_ENDPOINTS.ATTENDANCE}/check-out`, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    const checkOutTime = new Date(res.data.checkOut!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    this.state.update(s => ({
                        ...s,
                        todayStatus: res.data,
                        logs: s.logs.map(l => l.id === res.data.id ? res.data : l)
                    }));
                    this.notify.success(
                        'Check-Out Successful',
                        `Checked out at ${checkOutTime}. Total: ${res.data.totalHours ?? 0} hrs`
                    );
                },
                error: (err) => this.handleError('Check-Out Failed', err)
            });
    }

    // ─── Flow 1: GET /attendance/shifts ───────────────────────────────────────
    loadShifts() {
        this.setLoading(true);
        this.http.get<ApiResponse<Shift[]>>(`${API_ENDPOINTS.ATTENDANCE}/shifts`)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => this.state.update(s => ({ ...s, shifts: res.data })),
                error: (err) => this.handleError('Failed to load shifts', err)
            });
    }

    // ─── Flow 1: POST /attendance/shifts ──────────────────────────────────────
    // Body: { name, startTime (HH:mm), endTime (HH:mm), graceMinutes? }
    createShift(data: CreateShiftInput) {
        this.setLoading(true);
        this.http.post<ApiResponse<Shift>>(`${API_ENDPOINTS.ATTENDANCE}/shifts`, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.state.update(s => ({ ...s, shifts: [...s.shifts, res.data] }));
                    this.notify.success('Shift Created', `Successfully created ${res.data.name} shift`);
                },
                error: (err) => this.handleError('Failed to create shift', err)
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
