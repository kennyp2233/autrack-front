// api/authService.ts
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
        const response = await apiRequest<any>(
            '/auth/login',
            'POST',
            {
                correo: credentials.email,
                contrasena: credentials.password
            },
            false // No requiere autenticación previa
        );

        // Guardar el token recibido
        if (response.token || response.access_token) {
            const token = response.token || response.access_token;
            await setAuthToken(token);

            // Transformar la respuesta a nuestro formato esperado
            // Manejamos diferentes estructuras de respuesta
            const userData = response.user || response.usuario || response;

            return {
                token: token,
                user: {
                    id: userData.id || userData.id_usuario,
                    email: userData.correo || userData.email,
                    fullName: userData.nombre_completo || userData.fullName,
                    createdAt: userData.fecha_creacion || userData.created_at || userData.createdAt,
                    lastLogin: userData.ultimo_inicio_sesion || userData.last_login || userData.lastLogin,
                }
            };
        }

        throw new Error('Token no recibido en la respuesta');
    },

    /**
     * Registra un nuevo usuario
     * @param data Datos de registro del usuario
     */
    register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
        const response = await apiRequest<any>(
            '/auth/register',
            'POST',
            {
                correo: data.email,
                contrasena: data.password,
                nombre_completo: data.fullName,
            },
            false // No requiere autenticación previa
        );

        // Guardar el token recibido
        if (response.token) {
            await setAuthToken(response.token);

            // Transformar la respuesta a nuestro formato esperado
            return {
                token: response.token,
                user: {
                    id: response.user.id,
                    email: response.user.email,
                    fullName: response.user.nombre_completo || response.user.fullName,
                    createdAt: response.user.created_at || response.user.createdAt,
                    lastLogin: response.user.last_login || response.user.lastLogin,
                }
            };
        }

        throw new Error('Token no recibido en la respuesta');
    },

    /**
     * Solicita un correo de recuperación de contraseña
     * @param email Correo electrónico del usuario
     */
    forgotPassword: async (email: string): Promise<void> => {
        await apiRequest<void>(
            '/auth/forgot-password',
            'POST',
            { email },
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
                password: newPassword,
                password_confirmation: newPassword
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
            '/auth/change-password',
            'PATCH',
            {
                password_current: currentPassword,
                password: newPassword,
                password_confirmation: newPassword
            }
        );
    },

    /**
     * Obtiene el perfil del usuario
     */
    getProfile: async (): Promise<User> => {
        const response = await apiRequest<any>('/auth/profile', 'GET');

        return {
            id: response.id,
            email: response.email,
            fullName: response.nombre_completo || response.fullName,
            createdAt: response.created_at || response.createdAt,
            lastLogin: response.last_login || response.lastLogin,
        };
    },

    /**
     * Cierra la sesión del usuario
     */
    logout: async (): Promise<void> => {
        try {
            // Intenta hacer logout en el servidor (si el endpoint existe)
            await apiRequest<void>('/auth/logout', 'POST');
        } catch (error) {
            // Si falla, solo limpiamos el token localmente
            console.warn('Error en logout del servidor:', error);
        }

        // Limpiamos el token localmente
        await setAuthToken(null);
    }
};