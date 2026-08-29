
export interface UserResponse {
    id: number;
    fullName: string;
    email: string;
    roleName: string;
}

export interface AuthResponse {
    token: string;
    user: UserResponse;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}