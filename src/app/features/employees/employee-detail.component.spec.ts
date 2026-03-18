import { TestBed } from '@angular/core/testing';
import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeStore } from '../../store/employee.store';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';

describe('EmployeeDetailComponent', () => {
    let component: EmployeeDetailComponent;
    let storeMock: any;
    let routeMock: any;
    let routerMock: any;

    beforeEach(async () => {
        storeMock = {
            selectedEmployee: signal({
                id: '123',
                employeeCode: 'EMP001',
                personalDetails: { firstName: 'John', lastName: 'Doe' }
            }),
            loading: signal(false),
            loadEmployeeById: vi.fn(),
            saveDocuments: vi.fn()
        };
        
        routeMock = {
            snapshot: {
                paramMap: {
                    get: vi.fn().mockReturnValue('123')
                }
            }
        };

        routerMock = {
            navigate: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [EmployeeDetailComponent],
            providers: [
                { provide: EmployeeStore, useValue: storeMock },
                { provide: ActivatedRoute, useValue: routeMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(EmployeeDetailComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load employee on init', () => {
        component.ngOnInit();
        expect(storeMock.loadEmployeeById).toHaveBeenCalledWith('123');
    });

    it('should generate initials correctly', () => {
        expect(component.getInitials('John Doe')).toBe('JD');
        expect(component.getInitials('John')).toBe('JO');
        expect(component.getInitials('')).toBe('EE');
    });

    it('should get display name correctly', () => {
        expect(component.getDisplayName()).toBe('John Doe');
        
        // Mock anonymous employee
        storeMock.selectedEmployee.set({ employeeCode: 'EMP001' });
        expect(component.getDisplayName()).toBe('EMP001');
    });

    it('should format bytes correctly', () => {
        expect(component.formatBytes(1024)).toBe('1 KB');
        expect(component.formatBytes(1048576)).toBe('1 MB');
        expect(component.formatBytes(500)).toBe('500 Bytes');
        expect(component.formatBytes(0)).toBe('0 Bytes');
    });

    it('should navigate back to employees list', () => {
        component.goBack();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/employees']);
    });

    it('should map document icons correctly', () => {
        expect(component.getDocumentIcon('resume')).toBe('pi-file-pdf');
        expect(component.getDocumentIcon('id_proof')).toBe('pi-id-card');
        expect(component.getDocumentIcon('other')).toBe('pi-file');
    });
});
