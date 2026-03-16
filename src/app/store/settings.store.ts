import { Injectable, signal, computed, inject } from '@angular/core';
import { BaseHttpService } from '../core/services/base-http.service';
import { API_ENDPOINTS } from '../core/constants/app.constants';
import { NotificationService } from '../core/services/notification.service';
import { finalize } from 'rxjs';
import { ApiResponse } from '../core/models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class SettingsStore {
    private http = inject(BaseHttpService);
    private notify = inject(NotificationService);

    // Using any for now to hold key-value settings dynamically
    private state = signal<{
        data: Record<string, any>;
        loading: boolean;
        error: string | null;
        saving: boolean;
    }>({
        data: {},
        loading: false,
        error: null,
        saving: false
    });

    readonly settings = computed(() => this.state().data);
    readonly loading = computed(() => this.state().loading);
    readonly saving = computed(() => this.state().saving);

    getCategorySettings(category: string) {
        return computed(() => this.state().data[category] || {});
    }

    loadSettings() {
        this.state.update(s => ({ ...s, loading: true }));
        this.http.get<ApiResponse<any>>(`${API_ENDPOINTS.SETTINGS}`)
            .pipe(finalize(() => this.state.update(s => ({ ...s, loading: false }))))
            .subscribe({
                next: (res) => this.state.update(s => ({ ...s, data: res.data })),
                error: (err) => this.notify.error('Failed to load settings', err.message || 'Unknown error')
            });
    }

    updateCategorySettings(category: string, payload: Record<string, any>) {
        this.state.update(s => ({ ...s, saving: true }));
        this.http.put<ApiResponse<any>>(`${API_ENDPOINTS.SETTINGS}/${category}`, payload)
            .pipe(finalize(() => this.state.update(s => ({ ...s, saving: false }))))
            .subscribe({
                next: (res) => {
                    this.state.update(s => ({
                        ...s,
                        data: {
                            ...s.data,
                            [category]: res.data
                        }
                    }));
                    this.notify.success('Settings Updated', `${category} settings saved successfully`);
                },
                error: (err) => this.notify.error('Failed to save settings', err.message || 'Unknown error')
            });
    }
}
