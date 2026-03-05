export interface Team {
    id: string;
    name: string;
    companyId: string;
    departmentId: string;
    department?: {
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    _count?: {
        employees: number;
    };
}

export interface CreateTeamInput {
    name: string;
    departmentId: string;
}

export interface TeamState {
    teams: Team[];
    loading: boolean;
    error: string | null;
}
