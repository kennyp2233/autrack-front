export interface User {
    id: number;
    email: string;
    fullName: string;
    createdAt: string;
    lastLogin?: string;
}

export interface UserSettings {
    userId: number;
    emailNotifications: boolean;
    pushNotifications: boolean;
    defaultCurrency: string;
    measurementUnit: 'km' | 'mi';
    theme: 'light' | 'dark';
    language: string;
}

export interface AuthCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}