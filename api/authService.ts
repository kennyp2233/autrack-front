// services/api/authService.ts
import { apiRequest, setAuthToken } from './config';
import { AuthCredentials, RegisterData, User } from '@/types/Users';

/**
 * Servicio para gestionar la autenticación de usuarios
 */
export const AuthService = {
    /**
     * Inicia sesión de usuario
     * @param credentials Credenciales de autenticación (email y password)
     */
    login: async (credentials: AuthCredentials): Promise<{ user: User; token: string }> => {
        const response = await apiRequest<{ user: User; token: string }>(
            '/auth/login',
            'POST',
            {
                correo: credentials.email,
                contrasena: credentials.password
            },
            false // No requiere autenticación previa
        );

        // Guardar el token recibido
        if (response.token) {
            setAuthToken(response.token);
        }

        return response;
    },

    /**
     * Registra un nuevo usuario
     * @param data Datos de registro del usuario
     */
    register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
        const response = await apiRequest<{ user: User; token: string }>(
            '/auth/register',
            'POST',
            {
                correo: data.email,
                nombre_completo: data.fullName,
                contrasena: data.password
            },
            false // No requiere autenticación previa
        );

        // Guardar el token recibido
        if (response.token) {
            setAuthToken(response.token);
        }

        return response;
    },

    /**
     * Solicita un correo de recuperación de contraseña
     * @param email Correo electrónico del usuario
     */
    forgotPassword: async (email: string): Promise<void> => {
        await apiRequest<void>(
            '/auth/forgot-password',
            'POST',
            { correo: email },
            false // No requiere autenticación previa
        );
    },

    /**
     * Restablece la contraseña con un token de recuperación
     * @param token Token de recuperación recibido por correo
     * @param newPassword Nueva contraseña
     */
    resetPassword: async (token: string, newPassword: string): Promise<void> => {
        await apiRequest<void>(
            '/auth/reset-password',
            'POST',
            {
                token,
                contrasena: newPassword
            },
            false // No requiere autenticación previa
        );
    },

    /**
     * Cambia la contraseña del usuario autenticado
     * @param currentPassword Contraseña actual
     * @param newPassword Nueva contraseña
     */
    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await apiRequest<void>(
            '/users/change-password',
            'PATCH',
            {
                contrasenaActual: currentPassword,
                nuevaContrasena: newPassword
            }
        );
    },

    /**
     * Cierra la sesión del usuario
     */
    logout: (): void => {
        setAuthToken(null);
    }
};