// contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthCredentials, RegisterData } from '../types/Users';
import { AuthService, setAuthToken, getAuthToken } from '@/api';

// Claves para almacenamiento local
const TOKEN_STORAGE_KEY = 'autrack_auth_token';
const USER_STORAGE_KEY = 'autrack_user_data';

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
        const loadUserFromStorage = async () => {
            try {
                // Cargar token y datos de usuario desde AsyncStorage
                const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
                const storedUserJson = await AsyncStorage.getItem(USER_STORAGE_KEY);

                if (storedToken && storedUserJson) {
                    const storedUser = JSON.parse(storedUserJson) as User;

                    // Establecer el token en el servicio API
                    setAuthToken(storedToken);

                    // Establecer el usuario en el estado
                    setUser(storedUser);
                }
            } catch (error) {
                console.error('Error al cargar datos de usuario:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserFromStorage();
    }, []);

    // Función para iniciar sesión
    const login = async (credentials: AuthCredentials) => {
        setIsLoading(true);
        try {
            // Llamar al servicio de autenticación
            const response = await AuthService.login(credentials);

            if (response.user && response.token) {
                // Guardar en el estado
                setUser(response.user);

                // Guardar en AsyncStorage para persistencia
                await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.token);
                await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

                router.replace('/(app)');
            } else {
                throw new Error('Datos de usuario incompletos');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Error al iniciar sesión');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Función para registrarse
    const register = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            // Llamar al servicio de registro
            const response = await AuthService.register(data);

            if (response.user && response.token) {
                // Guardar en el estado
                setUser(response.user);

                // Guardar en AsyncStorage para persistencia
                await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.token);
                await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

                router.replace('/(app)');
            } else {
                throw new Error('Datos de usuario incompletos');
            }
        } catch (error) {
            console.error('Error al registrarse:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Error al registrarse');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        try {
            // Limpiar token y estado
            setAuthToken(null);
            setUser(null);

            // Limpiar almacenamiento local
            await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
            await AsyncStorage.removeItem(USER_STORAGE_KEY);

            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Función para recuperar contraseña
    const forgotPassword = async (email: string) => {
        try {
            await AuthService.forgotPassword(email);
            return Promise.resolve();
        } catch (error) {
            console.error('Error al solicitar recuperación de contraseña:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Error al enviar correo');
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