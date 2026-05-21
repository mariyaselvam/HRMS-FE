export interface Holiday {
    id: string;
    companyId: string;
    workLocationId?: string | null;
    workLocation?: {
        id: string;
        name: string;
    };
    date: string;
    name: string;
    isOptional: boolean;
    createdAt: string;
}

export interface CreateHolidayInput {
    name: string;
    date: string | Date;
    isOptional?: boolean;
    workLocationId?: string | null;
}

export interface HolidayState {
    holidays: Holiday[];
    loading: boolean;
    error: string | null;
}
