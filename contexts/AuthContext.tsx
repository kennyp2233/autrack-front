import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Alert } from 'react-native';
import { User, AuthCredentials, RegisterData } from '../types/Users';

// API base URL
const API_URL = 'http://192.168.100.39:3000/api/v1/auth';

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
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const segments = useSegments();

    // Verificar si el usuario está autenticado cuando cambian los segmentos de la ruta
    useEffect(() => {
        if (!isLoading) {
            const inAuthGroup = segments[0] === '(auth)';

            if (!user && !inAuthGroup) {
                // Redirigir a la pantalla de login si no hay usuario autenticado
                //router.replace('/(auth)/login');
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
                // Aquí implementarías la lógica para cargar el token y usuario desde AsyncStorage
                // const storedToken = await AsyncStorage.getItem('userToken');
                // const storedUser = await AsyncStorage.getItem('userData');
                
                // Por ahora, simulamos que no hay datos almacenados
                setToken(null);
                setUser(null);
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
        console.log(API_URL);
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: credentials.email,
                    contrasena: credentials.password
                }),
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al iniciar sesión');
            }

            const data = await response.json();
            
            if (data.user && data.token) {
                // Transformar la respuesta de la API a nuestro formato de Usuario
                const userData: User = {
                    id: data.user.id,
                    email: data.user.correo,
                    fullName: data.user.nombre_completo,
                    createdAt: data.user.fecha_creacion,
                    lastLogin: data.user.ultimo_inicio_sesion
                };
                
                // Guardar en el estado
                setUser(userData);
                setToken(data.token);
                
                // Guardar en AsyncStorage para persistencia
                // await AsyncStorage.setItem('userToken', data.token);
                // await AsyncStorage.setItem('userData', JSON.stringify(userData));
                
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
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: data.email,
                    nombre_completo: data.fullName,
                    contrasena: data.password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrarse');
            }

            const responseData = await response.json();
            
            if (responseData.user && responseData.token) {
                // Transformar la respuesta de la API a nuestro formato de Usuario
                const userData: User = {
                    id: responseData.user.id,
                    email: responseData.user.correo,
                    fullName: responseData.user.nombre_completo,
                    createdAt: responseData.user.fecha_creacion,
                    lastLogin: responseData.user.ultimo_inicio_sesion
                };
                
                // Guardar en el estado
                setUser(userData);
                setToken(responseData.token);
                
                // Guardar en AsyncStorage para persistencia
                // await AsyncStorage.setItem('userToken', responseData.token);
                // await AsyncStorage.setItem('userData', JSON.stringify(userData));
                
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
    const logout = () => {
        // Eliminar usuario y token del estado
        setUser(null);
        setToken(null);
        
        // Eliminar de AsyncStorage
        // AsyncStorage.removeItem('userToken');
        // AsyncStorage.removeItem('userData');
        
        router.replace('/(auth)/login');
    };

    // Función para recuperar contraseña
    const forgotPassword = async (email: string) => {
        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo: email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al enviar correo de recuperación');
            }

            return Promise.resolve();
        } catch (error) {
            console.error('Error al enviar correo de recuperación:', error);
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