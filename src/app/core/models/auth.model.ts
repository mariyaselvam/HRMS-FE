export interface AuthUser {
    id: string;
    email: string;
    role: string;
    companyId: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        token: string;
        user: AuthUser;
    };
}

export interface JwtPayload {
    userId: string;
    companyId: string;
    role: string;
}
