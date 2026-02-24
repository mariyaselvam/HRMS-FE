import { Injectable, signal, computed, inject } from '@angular/core';
import {
    LeaveType,
    LeaveRequest,
    LeaveBalance,
    LeaveState,
    CreateLeaveTypeInput,
    CreateLeaveRequestInput,
    LeaveActionInput
} from '../core/models/leave.model';
import { BaseHttpService } from '../core/services/base-http.service';
import { API_ENDPOINTS } from '../core/constants/app.constants';
import { ApiResponse } from '../core/models/employee.model';
import { NotificationService } from '../core/services/notification.service';
import { finalize } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LeaveStore {
    private http = inject(BaseHttpService);
    private notify = inject(NotificationService);

    // State
    private state = signal<LeaveState>({
        leaveTypes: [],
        myRequests: [],
        allRequests: [],
        balances: [],
        loading: false,
        error: null
    });

    // Selectors
    readonly leaveTypes = computed(() => this.state().leaveTypes);
    readonly myRequests = computed(() => this.state().myRequests);
    readonly allRequests = computed(() => this.state().allRequests);
    readonly balances = computed(() => this.state().balances);
    readonly loading = computed(() => this.state().loading);
    readonly error = computed(() => this.state().error);

    // Actions - Leave Types
    loadLeaveTypes() {
        this.setLoading(true);
        this.http.get<ApiResponse<LeaveType[]>>(`${API_ENDPOINTS.LEAVE}/types`)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => this.state.update(s => ({ ...s, leaveTypes: res.data })),
                error: (err) => this.handleError('Failed to load leave types', err)
            });
    }

    createLeaveType(data: CreateLeaveTypeInput) {
        this.setLoading(true);
        this.http.post<ApiResponse<LeaveType>>(`${API_ENDPOINTS.LEAVE}/types`, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.state.update(s => ({ ...s, leaveTypes: [...s.leaveTypes, res.data] }));
                    this.notify.success('Leave Type Created', `Successfully created ${res.data.name}`);
                },
                error: (err) => this.handleError('Failed to create leave type', err)
            });
    }

    // Actions - Leave Requests (Employee)
    applyLeave(data: CreateLeaveRequestInput) {
        this.setLoading(true);
        this.http.post<ApiResponse<LeaveRequest>>(`${API_ENDPOINTS.LEAVE}/apply`, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.state.update(s => ({ ...s, myRequests: [res.data, ...s.myRequests] }));
                    this.notify.success('Leave Applied', 'Your leave request has been submitted.');
                },
                error: (err) => this.handleError('Failed to apply leave', err)
            });
    }

    loadMyRequests() {
        this.setLoading(true);
        this.http.get<ApiResponse<LeaveRequest[]>>(`${API_ENDPOINTS.LEAVE}/my-requests`)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => this.state.update(s => ({ ...s, myRequests: res.data })),
                error: (err) => this.handleError('Failed to load your requests', err)
            });
    }

    // Actions - Leave Management (Admin/Manager)
    loadAllRequests() {
        this.setLoading(true);
        this.http.get<ApiResponse<LeaveRequest[]>>(`${API_ENDPOINTS.LEAVE}/all-requests`)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => this.state.update(s => ({ ...s, allRequests: res.data })),
                error: (err) => this.handleError('Failed to load all requests', err)
            });
    }

    handleLeaveAction(requestId: string, action: LeaveActionInput) {
        this.setLoading(true);
        this.http.patch<ApiResponse<LeaveRequest>>(`${API_ENDPOINTS.LEAVE}/requests/${requestId}/action`, action)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.state.update(s => ({
                        ...s,
                        allRequests: s.allRequests.map(r => r.id === requestId ? res.data : r)
                    }));
                    this.notify.success('Leave Action', `Leave request ${action.status} successfully.`);
                },
                error: (err) => this.handleError(`Failed to ${action.status} leave`, err)
            });
    }

    private setLoading(loading: boolean) {
        this.state.update(s => ({ ...s, loading }));
    }

    private handleError(message: string, error: any) {
        const errorMsg = error.error?.message || error.message || 'Unknown error';
        this.state.update(s => ({ ...s, error: errorMsg }));
        this.notify.error(message, errorMsg);
    }
}
