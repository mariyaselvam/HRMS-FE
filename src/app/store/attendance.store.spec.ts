import { TestBed } from '@angular/core/testing';
import { AttendanceStore } from './attendance.store';
import { BaseHttpService } from '../core/services/base-http.service';
import { NotificationService } from '../core/services/notification.service';
import { of, throwError } from 'rxjs';
import { AttendanceLog } from '../core/models/attendance.model';

describe('AttendanceStore', () => {
    let store: AttendanceStore;
    let httpMock: any;
    let notifyMock: any;

    beforeEach(() => {
        httpMock = {
            get: vi.fn(),
            post: vi.fn()
        };
        notifyMock = {
            success: vi.fn(),
            error: vi.fn()
        };

        TestBed.configureTestingModule({
            providers: [
                AttendanceStore,
                { provide: BaseHttpService, useValue: httpMock },
                { provide: NotificationService, useValue: notifyMock }
            ]
        });

        store = TestBed.inject(AttendanceStore);
    });

    it('should have initial state', () => {
        expect(store.logs()).toEqual([]);
        expect(store.loading()).toBe(false);
        expect(store.error()).toBeNull();
    });

    describe('loadLogs', () => {
        it('should load logs successfully and map them', () => {
            const mockLogs: any[] = [
                { 
                    id: '1', 
                    attendance_date: '2024-01-01', 
                    status: 'present',
                    check_in: '2024-01-01T09:00:00Z'
                }
            ];
            const mockResponse = { data: { records: mockLogs, total: 1 } };
            httpMock.get.mockReturnValue(of(mockResponse));

            store.loadLogs();

            expect(store.loading()).toBe(false);
            expect(store.logs().length).toBe(1);
            expect(store.logs()[0].id).toBe('1');
            // Check mapping (attendance_date -> attendanceDate)
            expect(store.logs()[0].attendanceDate).toBe('2024-01-01');
            expect(store.totalLogs()).toBe(1);
        });

        it('should handle error when loading logs', () => {
            const errorResponse = { 
                error: { message: 'Server connection failed' } 
            };
            httpMock.get.mockReturnValue(throwError(() => errorResponse));

            store.loadLogs();

            expect(store.loading()).toBe(false);
            expect(store.error()).toBe('Server connection failed');
            expect(notifyMock.error).toHaveBeenCalledWith('Failed to load attendance logs', 'Server connection failed');
        });
    });

    describe('checkIn', () => {
        it('should update state after successful check-in', () => {
            const now = new Date().toISOString();
            const mockLog = { 
                id: '2', 
                check_in: now, 
                status: 'present',
                attendance_date: now.split('T')[0]
            };
            httpMock.post.mockReturnValue(of({ data: mockLog }));

            store.checkIn({ note: 'Working from home' });

            expect(store.loading()).toBe(false);
            expect(store.todayStatus()?.id).toBe('2');
            expect(store.logs().some(l => l.id === '2')).toBe(true);
            expect(notifyMock.success).toHaveBeenCalled();
        });
    });

    describe('checkOut', () => {
        it('should update existing log after check-out', () => {
            // Initial state with a check-in
            const checkInLog: any = { id: '3', check_in: '2024-01-01T09:00:00Z', status: 'present' };
            store['state'].update(s => ({ ...s, logs: [checkInLog] }));

            const checkOutLog = { ...checkInLog, check_out: '2024-01-01T17:00:00Z', total_hours: 8 };
            httpMock.post.mockReturnValue(of({ data: checkOutLog }));

            store.checkOut({ note: 'Finished tasks' });

            expect(store.loading()).toBe(false);
            expect(store.logs()[0].checkOut).toBe('2024-01-01T17:00:00Z');
            expect(store.logs()[0].totalHours).toBe(8);
            expect(notifyMock.success).toHaveBeenCalled();
        });
    });
});
