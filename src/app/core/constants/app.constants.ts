export const APP_CONFIG = {
    API_BASE_URL: 'https://hrms-be-7ll7.onrender.com/api/v1',
    PAGE_SIZE: 10,
    DATE_FORMAT: 'dd/MM/yyyy'
};

export const API_ENDPOINTS = {
    EMPLOYEES: '/employees',
    EMPLOYEE_ONBOARD: '/employees/onboard',
    EMPLOYEE_PERSONAL: (id: string) => `/employees/${id}/personal`,
    EMPLOYEE_JOB: (id: string) => `/employees/${id}/job`,
    EMPLOYEE_STATUTORY: (id: string) => `/employees/${id}/statutory`,
    EMPLOYEE_FINALIZE: (id: string) => `/employees/${id}/finalize`,
    ATTENDANCE: '/attendance',
    PAYROLL: '/payroll',
    SALARY_SETUP: '/payroll/salary-setup',
    LEAVE: '/leave',
    DASHBOARD: '/dashboard',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile'
    },
    ORG: '/org',
    DEPARTMENTS: '/org/departments',
    LOCATIONS: '/org/locations'
};
