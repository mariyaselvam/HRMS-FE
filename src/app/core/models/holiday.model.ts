export interface Holiday {
    id: string;
    companyId: string;
    date: string;
    name: string;
    isOptional: boolean;
    createdAt: string;
}

export interface CreateHolidayInput {
    name: string;
    date: string | Date;
    isOptional?: boolean;
}

export interface HolidayState {
    holidays: Holiday[];
    loading: boolean;
    error: string | null;
}
