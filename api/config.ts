// api/config.ts
import Constants from 'expo-constants';
import { getStorageItem, setStorageItem, removeStorageItem } from './storage';

// Obtener URL base del servidor
export const API_BASE_URL = Constants.manifest?.extra?.apiUrl || 'https://192.168.100.39:3443/api/v1';

// Clave para almacenar el token
const AUTH_TOKEN_KEY = 'auth_token';

let authToken: string | null = null;

export const loadAuthToken = async (): Promise<string | null> => {
  try {
    const token = await getStorageItem(AUTH_TOKEN_KEY);
    if (token) {
      authToken = token;
    }
    return token;
  } catch (error) {
    console.error('Error al cargar el token de autenticación:', error);
    return null;
  }
};

export const setAuthToken = async (token: string | null): Promise<void> => {
  try {
    authToken = token;
    if (token) {
      await setStorageItem(AUTH_TOKEN_KEY, token);
    } else {
      await removeStorageItem(AUTH_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error al guardar el token de autenticación:', error);
  }
};

export const getAuthToken = (): string | null => {
  return authToken;
};

export const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
};

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

    const responseText = await response.text();

    if (!response.ok) {
      console.error(`Error en ${method} ${endpoint}:`, responseText);
      let errorMessage = 'Error en la petición';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

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
