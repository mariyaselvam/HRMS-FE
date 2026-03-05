import { Injectable, signal, computed, inject } from '@angular/core';
import { Team, TeamState, CreateTeamInput } from '../core/models/team.model';
import { BaseHttpService } from '../core/services/base-http.service';
import { API_ENDPOINTS } from '../core/constants/app.constants';
import { ApiResponse } from '../core/models/employee.model';
import { NotificationService } from '../core/services/notification.service';
import { finalize } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TeamStore {
    private http = inject(BaseHttpService);
    private notify = inject(NotificationService);

    // State
    private state = signal<TeamState>({
        teams: [],
        loading: false,
        error: null
    });

    // Selectors
    readonly teams = computed(() => this.state().teams);
    readonly loading = computed(() => this.state().loading);
    readonly error = computed(() => this.state().error);

    // Actions
    loadTeams(force: boolean = false) {
        if (!force && this.state().teams.length > 0) {
            return;
        }
        this.setLoading(true);
        this.http.get<ApiResponse<Team[]>>(API_ENDPOINTS.TEAMS)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => this.state.update(s => ({ ...s, teams: res.data })),
                error: (err) => this.handleError('Failed to load teams', err)
            });
    }

    addTeam(data: CreateTeamInput) {
        this.setLoading(true);
        this.http.post<ApiResponse<Team>>(API_ENDPOINTS.TEAMS, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.loadTeams(true); // Reload to get relations correctly
                    this.notify.success('Team Added', `Successfully created ${res.data.name}`);
                },
                error: (err) => this.handleError('Failed to add team', err)
            });
    }

    updateTeam(id: string, data: Partial<Team>) {
        this.setLoading(true);
        this.http.patch<ApiResponse<Team>>(`${API_ENDPOINTS.TEAMS}/${id}`, data)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (res) => {
                    this.loadTeams(true); // Reload to get relations
                    this.notify.success('Team Updated', `Successfully updated ${res.data.name}`);
                },
                error: (err) => this.handleError('Failed to update team', err)
            });
    }

    deleteTeam(id: string) {
        this.setLoading(true);
        this.http.delete<ApiResponse<any>>(`${API_ENDPOINTS.TEAMS}/${id}`)
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: () => {
                    this.state.update(s => ({
                        ...s,
                        teams: s.teams.filter(t => t.id !== id)
                    }));
                    this.notify.success('Team Deleted', 'The team has been removed.');
                },
                error: (err) => this.handleError('Failed to delete team', err)
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
