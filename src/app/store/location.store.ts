import { Injectable, signal, computed, inject } from '@angular/core';
import { WorkLocation, WorkLocationState } from '../core/models/location.model';
import { BaseHttpService } from '../core/services/base-http.service';
import { API_ENDPOINTS } from '../core/constants/app.constants';
import { ApiResponse } from '../core/models/employee.model';
import { NotificationService } from '../core/services/notification.service';
import { finalize } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocationStore {
    private http = inject(BaseHttpService);
    private notify = inject(NotificationService);

    // State
    private state = signal<WorkLocationState>({
        locations: [],
        loading: false,
        error: null
    });

    // Selectors
    readonly locations = computed(() => this.state().locations);
    readonly loading = computed(() => this.state().loading);
    readonly error = computed(() => this.state().error);

    // Actions
    loadLocations() {
        this.setLoading(true);
        this.http.get<ApiResponse<WorkLocation[]>>(API_ENDPOINTS.LOCATIONS)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => this.state.update(s => ({ ...s, locations: res.data })),
                error: (err) => this.handleError('Failed to load locations', err)
            });
    }

    addLocation(data: Partial<WorkLocation>) {
        this.setLoading(true);
        this.http.post<ApiResponse<WorkLocation>>(API_ENDPOINTS.LOCATIONS, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.state.update(s => ({ ...s, locations: [...s.locations, res.data] }));
                    this.notify.success('Branch Added', `Successfully created ${res.data.name}`);
                },
                error: (err) => this.handleError('Failed to add branch', err)
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
