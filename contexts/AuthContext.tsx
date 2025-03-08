import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { User, AuthCredentials, RegisterData } from '../types/Users';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: AuthCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    forgotPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    forgotPassword: async () => { },
});

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    const segments = useSegments();

    // Verificar si el usuario está autenticado cuando cambian los segmentos de la ruta
    useEffect(() => {
        if (!isLoading) {
            const inAuthGroup = segments[0] === '(auth)';

            if (!user && !inAuthGroup) {
                // Redirigir a la pantalla de login si no hay usuario autenticado
                router.replace('/(auth)/login');
            } else if (user && inAuthGroup) {
                // Redirigir al dashboard si el usuario está autenticado
                router.replace('/(app)');
            }
        }
    }, [user, segments, isLoading]);

    // Verificar si hay un usuario almacenado al iniciar la aplicación
    useEffect(() => {
        // Simular la carga de un usuario almacenado localmente
        const loadUser = async () => {
            try {
                // Aquí se implementaría la lógica para cargar el usuario desde almacenamiento local
                // Por ahora simulamos la ausencia de usuario almacenado
                setUser(null);
            } catch (error) {
                console.error('Error al cargar el usuario:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Función para iniciar sesión
    const login = async (credentials: AuthCredentials) => {
        setIsLoading(true);
        try {
            // Aquí se implementaría la lógica de autenticación con API
            // Por ahora simulamos un usuario de prueba
            const mockUser: User = {
                id: 1,
                email: credentials.email,
                fullName: 'Usuario de Prueba',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            };

            // Guardar usuario en el estado y almacenamiento local
            setUser(mockUser);
            // Aquí se guardaría el usuario en almacenamiento local

            router.replace('/(app)');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Función para registrarse
    const register = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            // Aquí se implementaría la lógica de registro con API
            // Por ahora simulamos un usuario de prueba
            const mockUser: User = {
                id: 1,
                email: data.email,
                fullName: data.fullName,
                createdAt: new Date().toISOString(),
            };

            // Guardar usuario en el estado y almacenamiento local
            setUser(mockUser);
            // Aquí se guardaría el usuario en almacenamiento local

            router.replace('/(app)');
        } catch (error) {
            console.error('Error al registrarse:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        // Eliminar usuario del estado y almacenamiento local
        setUser(null);
        // Aquí se eliminaría el usuario del almacenamiento local

        router.replace('/(auth)/login');
    };

    // Función para recuperar contraseña
    const forgotPassword = async (email: string) => {
        try {
            // Aquí se implementaría la lógica para recuperar contraseña con API
            console.log(`Enviando correo de recuperación a: ${email}`);
            // Simular éxito
            return Promise.resolve();
        } catch (error) {
            console.error('Error al enviar correo de recuperación:', error);
            throw error;
        }
    };

    const value = {
        user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}