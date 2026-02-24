import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveStore } from '../../store/leave.store';
import { CommonTableComponent, Column } from '../../shared/components/common-table.component';
import { CommonButtonComponent } from '../../shared/components/common-button.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonInputComponent } from '../../shared/components/common-input.component';
import { LeaveRequest } from '../../core/models/leave.model';

@Component({
    selector: 'app-leave-approvals',
    standalone: true,
    imports: [
        CommonModule,
        CommonTableComponent,
        CommonButtonComponent,
        CardModule,
        DialogModule,
        ReactiveFormsModule,
        CommonInputComponent
    ],
    templateUrl: './leave-approvals.component.html'
})
export class LeaveApprovalsComponent implements OnInit {
    protected store = inject(LeaveStore);
    private fb = inject(FormBuilder);

    selectedRequest: LeaveRequest | null = null;
    showDialog = false;
    submitted = false;

    columns: Column[] = [
        { field: 'employee.firstName', header: 'Employee' },
        { field: 'leaveType.name', header: 'Type' },
        { field: 'startDate', header: 'From', type: 'date' },
        { field: 'endDate', header: 'To', type: 'date' },
        { field: 'appliedDays', header: 'Days' },
        { field: 'status', header: 'Status', type: 'status' }
    ];

    form = this.fb.group({
        remarks: ['']
    });

    ngOnInit() {
        this.store.loadAllRequests();
    }

    openReviewDialog(request: LeaveRequest) {
        this.selectedRequest = request;
        this.form.reset();
        this.showDialog = true;
    }

    onAction(status: 'approved' | 'rejected') {
        if (this.selectedRequest) {
            this.store.handleLeaveAction(this.selectedRequest.id, {
                status,
                remarks: this.form.value.remarks || ''
            });
            this.showDialog = false;
        }
    }
}
