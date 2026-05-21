import { TestBed } from '@angular/core/testing';
import { HolidayListComponent } from './holiday-list.component';
import { HolidayStore } from '../../store/holiday.store';
import { ContextStore } from '../../store/context.store';
import { NotificationService } from '../../core/services/notification.service';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { MessageService, ConfirmationService } from 'primeng/api';

describe('HolidayListComponent', () => {
    let component: HolidayListComponent;
    let storeMock: any;
    let contextStoreMock: any;
    let notifyMock: any;

    beforeEach(async () => {
        storeMock = {
            holidays: signal([]),
            loading: signal(false),
            loadHolidays: vi.fn(),
            addHoliday: vi.fn(),
            deleteHoliday: vi.fn()
        };

        contextStoreMock = {
            activeBranchId: signal('branch-123')
        };

        notifyMock = {
            confirm: vi.fn(),
            confirmDelete: vi.fn(),
            success: vi.fn(),
            error: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [HolidayListComponent],
            providers: [
                { provide: HolidayStore, useValue: storeMock },
                { provide: ContextStore, useValue: contextStoreMock },
                { provide: NotificationService, useValue: notifyMock },
                MessageService,
                ConfirmationService
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(HolidayListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
