export interface WorkLocation {
    id: string;
    name: string;
    address?: string;
    companyId: string;
    latitude?: number;
    longitude?: number;
    createdAt: string;
    _count?: {
        employees: number;
    };
}

export interface WorkLocationState {
    locations: WorkLocation[];
    loading: boolean;
    error: string | null;
}
