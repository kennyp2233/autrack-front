// services/api/userService.ts
import { apiRequest } from './config';
import { User, UserSettings } from '@/types/Users';

/**
 * Servicio para gestionar la información de usuarios
 */
export const UserService = {
  /**
   * Obtiene el perfil del usuario autenticado
   */
  getProfile: async (): Promise<User> => {
    const response = await apiRequest<any>('/users/profile');
    
    // Transformar la respuesta de la API a nuestro modelo de datos
    return {
      id: response.id_usuario,
      email: response.correo,
      fullName: response.nombre_completo,
      createdAt: response.fecha_creacion,
      lastLogin: response.ultimo_inicio_sesion
    };
  },

  /**
   * Actualiza el perfil del usuario
   * @param userData Datos a actualizar del perfil
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiRequest<any>(
      '/users/profile',
      'PATCH',
      {
        nombre_completo: userData.fullName
      }
    );
    
    // Transformar la respuesta de la API a nuestro modelo de datos
    return {
      id: response.id_usuario,
      email: response.correo,
      fullName: response.nombre_completo,
      createdAt: response.fecha_creacion,
      lastLogin: response.ultimo_inicio_sesion
    };
  },

  /**
   * Obtiene la configuración del usuario
   */
  getUserSettings: async (): Promise<UserSettings> => {
    const response = await apiRequest<any>('/users/config');
    
    // Transformar la respuesta de la API a nuestro modelo de datos
    return {
      userId: response.id_usuario,
      emailNotifications: response.notificaciones_email || false,
      pushNotifications: response.notificaciones_push || false,
      defaultCurrency: response.moneda_predeterminada || 'MXN',
      measurementUnit: response.unidad_medida || 'km',
      theme: response.tema || 'light',
      language: response.idioma || 'es'
    };
  },

  /**
   * Actualiza la configuración del usuario
   * @param settings Configuración a actualizar
   */
  updateUserSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    const requestData: any = {};
    
    if (settings.emailNotifications !== undefined) requestData.notificaciones_email = settings.emailNotifications;
    if (settings.pushNotifications !== undefined) requestData.notificaciones_push = settings.pushNotifications;
    if (settings.defaultCurrency) requestData.moneda_predeterminada = settings.defaultCurrency;
    if (settings.measurementUnit) requestData.unidad_medida = settings.measurementUnit;
    if (settings.theme) requestData.tema = settings.theme;
    if (settings.language) requestData.idioma = settings.language;
    
    const response = await apiRequest<any>(
      '/users/config',
      'PATCH',
      requestData
    );
    
    // Transformar la respuesta de la API a nuestro modelo de datos
    return {
      userId: response.id_usuario,
      emailNotifications: response.notificaciones_email || false,
      pushNotifications: response.notificaciones_push || false,
      defaultCurrency: response.moneda_predeterminada || 'MXN',
      measurementUnit: response.unidad_medida || 'km',
      theme: response.tema || 'light',
      language: response.idioma || 'es'
    };
  }
};