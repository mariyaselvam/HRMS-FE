export interface Shift {
    id: string;
    name: string;
    startTime: string; // "HH:mm" stored as Date in DB, returned as ISO string
    endTime: string;   // "HH:mm"
    graceMinutes: number;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'half_day';

export interface AttendanceLog {
    id: string;
    employeeId: string;
    shiftId?: string | null;
    workLocationId?: string | null;
    attendanceDate: string;   // ISO date string — comes as "attendanceDate" from backend
    checkIn: string | null;   // ISO datetime string
    checkOut: string | null;  // ISO datetime string
    totalHours: number | null; // Calculated on checkout
    status: AttendanceStatus;
    note?: string;
    createdAt: string;
    updatedAt: string;
    // Relations included from backend
    employee?: {
        employeeCode: string;
        user: { email: string };
    };
    shift?: {
        name: string;
    };
    workLocation?: {
        name: string;
    };
}

export interface AttendanceState {
    logs: AttendanceLog[];
    shifts: Shift[];
    todayStatus: AttendanceLog | null;
    loading: boolean;
    error: string | null;
}

// Flow 2: POST /attendance/check-in
export interface CheckInInput {
    shiftId?: string;        // optional UUID
    workLocationId?: string; // optional UUID
    note?: string;           // optional note
}

// Flow 3: POST /attendance/check-out
export interface CheckOutInput {
    note?: string; // only note is accepted
}

// Flow 1: POST /attendance/shifts
export interface CreateShiftInput {
    name: string;
    startTime: string;     // "HH:mm" format
    endTime: string;       // "HH:mm" format
    graceMinutes?: number; // optional, 0–60
}

// Flow 4: GET /attendance/logs filters
export interface AttendanceLogFilters {
    startDate?: string;  // YYYY-MM-DD
    endDate?: string;    // YYYY-MM-DD
    employeeId?: string; // optional UUID
}
