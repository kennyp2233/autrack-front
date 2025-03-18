// services/api/config.ts

// Configuración base de la API
export const API_BASE_URL = 'http://localhost:3000/api/v1'; // Cambia esto por la URL correcta del servidor

// Almacenamiento del token JWT
let authToken: string | null = null;

/**
 * Establece el token de autenticación para las peticiones a la API
 * @param token Token JWT a utilizar en las peticiones
 */
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

/**
 * Obtiene el token actual de autenticación
 */
export const getAuthToken = () => {
  return authToken;
};

/**
 * Obtiene los headers necesarios para las peticiones autenticadas
 */
export const getAuthHeaders = () => {
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    // Manejar respuestas de error HTTP
    if (!response.ok) {
      let errorMessage = 'Error en la petición';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Si no se puede parsear el JSON, usar el mensaje genérico
      }
      
      throw new Error(errorMessage);
    }

    // Para respuestas 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
};