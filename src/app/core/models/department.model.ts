import { WorkLocation } from './location.model';

export interface Department {
    id: string;
    name: string;
    companyId: string;
    managerId?: string | null;
    workLocationId?: string | null;
    workLocation?: WorkLocation | null;
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
    workLocationId?: string | null;
}

export interface DepartmentState {
    departments: Department[];
    loading: boolean;
    error: string | null;
}
