export interface Team {
    id: string;
    name: string;
    companyId: string;
    departmentId: string;
    workLocationId?: string | null;
    department?: {
        name: string;
    };
    workLocation?: {
        name: string;
    } | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        employees: number;
    };
}

export interface CreateTeamInput {
    name: string;
    departmentId: string;
    workLocationId?: string | null;
}

export interface TeamState {
    teams: Team[];
    loading: boolean;
    error: string | null;
}
