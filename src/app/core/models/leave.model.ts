export interface LeaveType {
    id: string;
    name: string;
    description?: string;
    daysAllowed: number;
    isPaid: boolean;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
    id: string;
    employeeId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveStatus;
    appliedDays: number;
    approverId?: string;
    approverRemarks?: string;
    createdAt: string;
    updatedAt: string;
    // Included relations (matches backend employee include)
    employee?: LeaveRequestEmployee;
    leaveType?: LeaveType;
}

export interface LeaveRequestEmployee {
    id?: string;
    employeeCode?: string;
    user?: { email: string };
    personalDetails?: {
        firstName?: string;
        lastName?: string;
    };
}

/** Display label for leave request employee relation */
export function getLeaveRequestEmployeeLabel(employee?: LeaveRequestEmployee): string {
    if (!employee) return '—';
    const first = employee.personalDetails?.firstName;
    if (first) {
        return `${first} ${employee.personalDetails?.lastName || ''}`.trim();
    }
    return employee.user?.email ?? employee.employeeCode ?? '—';
}

export interface LeaveBalance {
    leaveType: LeaveType;
    totalDays: number;
    usedDays: number;
    availableDays: number;
}

export interface CreateLeaveTypeInput {
    name: string;
    description?: string;
    daysAllowed: number;
    isPaid: boolean;
}

export interface CreateLeaveRequestInput {
    leaveTypeId: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    reason: string;
}

export interface LeaveActionInput {
    status: 'approved' | 'rejected';
    remarks?: string;
}

export interface LeaveState {
    leaveTypes: LeaveType[];
    myRequests: LeaveRequest[];
    allRequests: LeaveRequest[];
    balances: LeaveBalance[];
    loading: boolean;
    error: string | null;
}
