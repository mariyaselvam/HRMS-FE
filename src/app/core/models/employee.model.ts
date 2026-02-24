/** Matches the exact shape returned by GET /api/v1/employees */
export interface EmployeeApiResponse {
    id: string;
    companyId: string;
    userId: string;
    employeeCode: string;
    departmentId: string;
    teamId: string | null;
    managerId: string | null;
    dateOfJoining: string;
    employmentStatus: string;
    dateOfLeaving: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        email: string;
    };
    department: {
        name: string;
    };
    team: {
        name: string;
    } | null;
    manager: {
        user: { email: string };
    } | null;
}

/** Flattened employee used throughout the frontend UI */
export interface Employee {
    id: string;
    employeeCode: string;
    email: string;
    department: string;
    team: string;
    employmentStatus: string;
    dateOfJoining: string;
    dateOfLeaving: string | null;
    managerId: string | null;
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
        team: raw.team?.name ?? '-',
        employmentStatus: raw.employmentStatus,
        dateOfJoining: raw.dateOfJoining,
        dateOfLeaving: raw.dateOfLeaving,
        managerId: raw.managerId,
    };
}
