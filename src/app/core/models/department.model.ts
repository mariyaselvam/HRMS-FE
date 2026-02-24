export interface Department {
    id: string;
    name: string;
    companyId: string;
    managerId?: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        employees: number;
        teams: number;
    };
}

export interface CreateDepartmentInput {
    name: string;
    managerId?: string;
}

export interface DepartmentState {
    departments: Department[];
    loading: boolean;
    error: string | null;
}
