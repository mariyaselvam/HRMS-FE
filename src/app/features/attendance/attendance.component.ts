import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceStore } from '../../store/attendance.store';
import { CommonTableComponent, Column } from '../../shared/components/common-table.component';
import { CommonButtonComponent } from '../../shared/components/common-button.component';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-attendance',
    standalone: true,
    imports: [
        CommonModule,
        CommonTableComponent,
        CommonButtonComponent,
        CardModule,
        FormsModule
    ],
    templateUrl: './attendance.component.html'
})
export class AttendanceComponent implements OnInit, OnDestroy {
    protected store = inject(AttendanceStore);

    currentTime = new Date();
    private timer: any;

    // ─── Table columns matching backend response fields ──────────────────────
    // Backend returns: attendanceDate, checkIn, checkOut, totalHours, status
    // Relations: employee.user.email, shift.name
    columns: Column[] = [
        { field: 'employee.user.email', header: 'Employee' },
        { field: 'shift.name', header: 'Shift' },
        { field: 'attendanceDate', header: 'Date', type: 'date' },
        { field: 'checkIn', header: 'Check In', type: 'time' },
        { field: 'checkOut', header: 'Check Out', type: 'time' },
        { field: 'totalHours', header: 'Hours', type: 'duration' },
        { field: 'status', header: 'Status', type: 'status' }
    ];

    ngOnInit() {
        // Flow 4: Load attendance history — optional filters can be passed
        this.store.loadLogs();
        this.timer = setInterval(() => {
            this.currentTime = new Date();
        }, 1000);
    }

    ngOnDestroy() {
        if (this.timer) clearInterval(this.timer);
    }

    // Flow 2: Check-in — sends { shiftId?, workLocationId?, note? }
    onCheckIn() {
        this.store.checkIn();
    }

    // Flow 3: Check-out — sends only { note? }
    onCheckOut() {
        this.store.checkOut();
    }

    get canCheckIn(): boolean {
        return !this.store.todayStatus()?.checkIn;
    }

    get canCheckOut(): boolean {
        const today = this.store.todayStatus();
        return !!(today?.checkIn && !today?.checkOut);
    }

    get todayHours(): string {
        const log = this.store.todayStatus();
        const raw = log?.totalHours;
        if (!raw) return '—';
        const num = Number(raw);
        if (isNaN(num) || num === 0) return '0h 0m';
        // If > 1000, treat as milliseconds; otherwise treat as decimal hours
        const totalMinutes = num > 1000
            ? Math.floor(num / 1000 / 60)
            : Math.floor(num * 60);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${h}h ${m}m`;
    }
}
