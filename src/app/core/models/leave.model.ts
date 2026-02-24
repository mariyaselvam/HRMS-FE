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
    // Included relations
    employee?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    leaveType?: LeaveType;
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
