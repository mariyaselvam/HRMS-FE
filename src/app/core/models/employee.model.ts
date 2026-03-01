/** Matches the exact shape returned by GET /api/v1/employees */
export interface EmployeeApiResponse {
    id: string;
    companyId: string;
    userId: string;
    employeeCode: string;
    departmentId: string;
    workLocationId: string | null;
    teamId: string | null;
    managerId: string | null;
    dateOfJoining: string;
    employmentStatus: string;
    onboardingStep: number;
    profileCompletion: number;
    dateOfLeaving: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        email: string;
    };
    department: {
        name: string;
    };
    workLocation: {
        name: string;
    } | null;
    team: {
        name: string;
    } | null;
    manager: {
        employeeCode: string;
    } | null;
    personalDetails?: any;
    jobDetails?: any;
    bankDetails?: any;
    statutoryDetails?: any;
}

/** Flattened employee used throughout the frontend UI */
export interface Employee {
    id: string;
    employeeCode: string;
    email: string;
    department: string;
    workLocation: string;
    team: string;
    employmentStatus: string;
    dateOfJoining: string;
    dateOfLeaving: string | null;
    managerId: string | null;
    onboardingStep: number;
    profileCompletion: number;
    // Raw details for forms
    personalDetails?: any;
    jobDetails?: any;
    bankDetails?: any;
    statutoryDetails?: any;
    departmentId?: string;
    workLocationId?: string;
}

/** Generic API wrapper matching backend response shape */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface EmployeeState {
    employees: Employee[];
    loading: boolean;
    error: string | null;
    selectedEmployee: Employee | null;
}

/** Map API response to flat frontend model */
export function mapEmployeeResponse(raw: EmployeeApiResponse): Employee {
    return {
        id: raw.id,
        employeeCode: raw.employeeCode,
        email: raw.user?.email ?? '',
        department: raw.department?.name ?? '',
        workLocation: raw.workLocation?.name ?? '-',
        team: raw.team?.name ?? '-',
        employmentStatus: raw.employmentStatus,
        dateOfJoining: raw.dateOfJoining,
        dateOfLeaving: raw.dateOfLeaving,
        managerId: raw.managerId,
        onboardingStep: raw.onboardingStep,
        profileCompletion: raw.profileCompletion,
        personalDetails: raw.personalDetails,
        jobDetails: raw.jobDetails,
        bankDetails: raw.bankDetails,
        statutoryDetails: raw.statutoryDetails,
        departmentId: raw.departmentId,
        workLocationId: raw.workLocationId ?? undefined
    };
}
