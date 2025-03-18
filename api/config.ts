// api/config.ts
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Obtener URL base del servidor desde variables de entorno o usar valor por defecto
export const API_BASE_URL = Constants.manifest?.extra?.apiUrl || 'https://192.168.100.39:3443/api/v1';

// Clave para almacenar el token en AsyncStorage
const AUTH_TOKEN_KEY = 'auth_token';

// Almacenamiento del token JWT en memoria
let authToken: string | null = null;

/**
 * Carga el token de autenticación desde AsyncStorage al iniciar la aplicación
 */
export const loadAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      authToken = token;
    }
    return token;
  } catch (error) {
    console.error('Error al cargar el token de autenticación:', error);
    return null;
  }
};

/**
 * Establece el token de autenticación para las peticiones a la API
 * @param token Token JWT a utilizar en las peticiones
 */
export const setAuthToken = async (token: string | null): Promise<void> => {
  try {
    authToken = token;
    if (token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error al guardar el token de autenticación:', error);
  }
};

/**
 * Obtiene el token actual de autenticación
 */
export const getAuthToken = (): string | null => {
  return authToken;
};

/**
 * Obtiene los headers necesarios para las peticiones autenticadas
 */
export const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
};

/**
 * Función genérica para realizar peticiones a la API
 * @param endpoint Ruta del endpoint a consultar (sin el base URL)
 * @param method Método HTTP a utilizar (GET, POST, etc.)
 * @param body Cuerpo de la petición (para POST, PUT, PATCH)
 * @param requiresAuth Indica si la petición requiere autenticación
 */
export const apiRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  requiresAuth: boolean = true
): Promise<T> => {
  const headers = requiresAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
  
  try {
    console.log(`Requesting: ${API_BASE_URL}${endpoint}`, method, body ? JSON.stringify(body) : 'No body');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    // Obtener texto de la respuesta para depuración
    const responseText = await response.text();
    
    // Manejar respuestas de error HTTP
    if (!response.ok) {
      console.error(`Error en ${method} ${endpoint}:`, responseText);
      
      let errorMessage = 'Error en la petición';
      try {
        // Intentar parsear como JSON
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Si no se puede parsear el JSON, usar el texto de respuesta
        errorMessage = responseText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    // Para respuestas 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // Parsear la respuesta como JSON
    let responseData: T;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Error al parsear respuesta JSON:', e);
      throw new Error('Formato de respuesta inválido');
    }

    return responseData;
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
};