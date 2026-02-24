import { Injectable, signal, computed, inject } from '@angular/core';
import { Department, DepartmentState, CreateDepartmentInput } from '../core/models/department.model';
import { BaseHttpService } from '../core/services/base-http.service';
import { API_ENDPOINTS } from '../core/constants/app.constants';
import { ApiResponse } from '../core/models/employee.model';
import { NotificationService } from '../core/services/notification.service';
import { finalize } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DepartmentStore {
    private http = inject(BaseHttpService);
    private notify = inject(NotificationService);

    // State
    private state = signal<DepartmentState>({
        departments: [],
        loading: false,
        error: null
    });

    // Selectors
    readonly departments = computed(() => this.state().departments);
    readonly loading = computed(() => this.state().loading);
    readonly error = computed(() => this.state().error);

    // Actions
    loadDepartments() {
        this.setLoading(true);
        this.http.get<ApiResponse<Department[]>>(API_ENDPOINTS.DEPARTMENTS)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => this.state.update(s => ({ ...s, departments: res.data })),
                error: (err) => this.handleError('Failed to load departments', err)
            });
    }

    addDepartment(data: CreateDepartmentInput) {
        this.setLoading(true);
        this.http.post<ApiResponse<Department>>(API_ENDPOINTS.DEPARTMENTS, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.state.update(s => ({ ...s, departments: [...s.departments, res.data] }));
                    this.notify.success('Department Added', `Successfully created ${res.data.name}`);
                },
                error: (err) => this.handleError('Failed to add department', err)
            });
    }

    updateDepartment(id: string, data: Partial<Department>) {
        this.setLoading(true);
        this.http.patch<ApiResponse<Department>>(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.state.update(s => ({
                        ...s,
                        departments: s.departments.map(d => d.id === id ? res.data : d)
                    }));
                    this.notify.success('Department Updated', `Successfully updated ${res.data.name}`);
                },
                error: (err) => this.handleError('Failed to update department', err)
            });
    }

    deleteDepartment(id: string) {
        this.setLoading(true);
        this.http.delete<ApiResponse<any>>(`${API_ENDPOINTS.DEPARTMENTS}/${id}`)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: () => {
                    this.state.update(s => ({
                        ...s,
                        departments: s.departments.filter(d => d.id !== id)
                    }));
                    this.notify.success('Department Deleted', 'The department has been removed.');
                },
                error: (err) => this.handleError('Failed to delete department', err)
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
