export interface EmployeeStats {
    total: number;
    breakdown: { status: string; count: number }[];
}

export interface AttendanceStats {
    presentToday: number;
}

export interface ApprovalsPending {
    leaves: number;
    attendance: number;
}

export interface PayrollSummary {
    month: string;
    totalNetSalary: number;
    totalGrossSalary: number;
    employeeCount: number;
}

export interface DashboardSummary {
    employees: EmployeeStats;
    attendance: AttendanceStats;
    approvalsPending: ApprovalsPending;
    latestPayroll: PayrollSummary | null;
}

export interface DashboardState {
    summary: DashboardSummary | null;
    loading: boolean;
    error: string | null;
}
