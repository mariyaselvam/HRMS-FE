export enum ApiMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT',
    LATE = 'LATE',
    LEAVE = 'LEAVE'
}

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    COMPANY_ADMIN = 'COMPANY_ADMIN',
    MANAGER = 'MANAGER',
    HR = 'HR',
    EMPLOYEE = 'EMPLOYEE'
}
