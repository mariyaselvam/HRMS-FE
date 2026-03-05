import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TeamStore } from '../../store/team.store';
import { DepartmentStore } from '../../store/department.store';
import { CommonTableComponent, Column } from '../../shared/components/common-table.component';
import { CommonButtonComponent } from '../../shared/components/common-button.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { CommonInputComponent } from '../../shared/components/common-input.component';
import { CommonSelectComponent } from '../../shared/components/common-select.component';
import { Team } from '../../core/models/team.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-team-list',
    standalone: true,
    imports: [
        CommonModule,
        CommonTableComponent,
        CommonButtonComponent,
        CardModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        CommonInputComponent,
        CommonSelectComponent
    ],
    templateUrl: './team-list.component.html'
})
export class TeamListComponent implements OnInit {
    protected store = inject(TeamStore);
    protected deptStore = inject(DepartmentStore);
    private fb = inject(FormBuilder);
    private notify = inject(NotificationService);

    showDialog = false;
    isEdit = false;
    selectedTeamId: string | null = null;
    submitted = false;

    columns: Column[] = [
        { field: 'name', header: 'Team Name' },
        { field: 'department.name', header: 'Department' },
        { field: '_count.employees', header: 'Members' },
        { field: 'createdAt', header: 'Created At', type: 'date' }
    ];

    form = this.fb.group({
        name: ['', [Validators.required]],
        departmentId: ['', [Validators.required]]
    });

    deptOptions = computed(() =>
        this.deptStore.departments().map(d => ({ label: d.name, value: d.id }))
    );

    ngOnInit() {
        this.store.loadTeams();
        this.deptStore.loadDepartments();
    }

    openAddDialog() {
        this.isEdit = false;
        this.selectedTeamId = null;
        this.form.reset();
        this.submitted = false;
        this.showDialog = true;
    }

    onEdit(team: Team) {
        this.isEdit = true;
        this.selectedTeamId = team.id;
        this.form.patchValue({
            name: team.name,
            departmentId: team.departmentId
        });
        this.submitted = false;
        this.showDialog = true;
    }

    onDelete(team: Team) {
        this.notify.confirmDelete(team.name, () => {
            this.store.deleteTeam(team.id);
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.valid) {
            const val = this.form.value as any;
            if (this.isEdit && this.selectedTeamId) {
                this.store.updateTeam(this.selectedTeamId, val);
            } else {
                this.store.addTeam(val);
            }
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
