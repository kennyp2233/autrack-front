// api/maintenanceService.ts
import { apiRequest } from './config';
import {
    MaintenanceCategory,
    MaintenanceType,
    MaintenanceRecord,
    MaintenanceReminder,
    CreateMaintenanceRecordDto,
    UpdateMaintenanceRecordDto,
    CreateMaintenanceReminderDto
} from '@/types/Maintenance';

/**
 * Servicio para interactuar con los endpoints de mantenimiento
 */
export const MaintenanceService = {
    // CATEGORÍAS DE MANTENIMIENTO
    /**
     * Obtener todas las categorías de mantenimiento
     */
    getAllCategories: async (): Promise<MaintenanceCategory[]> => {
        return await apiRequest<MaintenanceCategory[]>('/maintenance/categories');
    },

    /**
     * Obtener una categoría por su ID
     */
    getCategoryById: async (id: number): Promise<MaintenanceCategory> => {
        return await apiRequest<MaintenanceCategory>(`/maintenance/categories/${id}`);
    },

    /**
     * Crear una nueva categoría de mantenimiento
     */
    createCategory: async (data: { nombre: string, descripcion?: string }): Promise<MaintenanceCategory> => {
        return await apiRequest<MaintenanceCategory>('/maintenance/categories', 'POST', data);
    },

    // TIPOS DE MANTENIMIENTO
    /**
     * Obtener todos los tipos de mantenimiento
     */
    getAllTypes: async (): Promise<MaintenanceType[]> => {
        return await apiRequest<MaintenanceType[]>('/maintenance/types');
    },

    /**
     * Obtener un tipo de mantenimiento por su ID
     */
    getTypeById: async (id: number): Promise<MaintenanceType> => {
        return await apiRequest<MaintenanceType>(`/maintenance/types/${id}`);
    },

    /**
     * Obtener tipos de mantenimiento por categoría
     */
    getTypesByCategory: async (categoryId: number): Promise<MaintenanceType[]> => {
        return await apiRequest<MaintenanceType[]>(`/maintenance/categories/${categoryId}/types`);
    },

    /**
     * Crear un nuevo tipo de mantenimiento
     */
    createType: async (data: {
        id_categoria: number,
        nombre: string,
        descripcion?: string,
        costo_estimado?: number,
        frecuencia_recomendada_meses?: number,
        frecuencia_recomendada_km?: number
    }): Promise<MaintenanceType> => {
        return await apiRequest<MaintenanceType>('/maintenance/types', 'POST', data);
    },

    // REGISTROS DE MANTENIMIENTO
    /**
     * Obtener todos los registros de mantenimiento de un vehículo
     */
    getRecordsByVehicle: async (vehicleId: number): Promise<MaintenanceRecord[]> => {
        return await apiRequest<MaintenanceRecord[]>(`/maintenance/vehicles/${vehicleId}/records`);
    },

    /**
     * Obtener un registro de mantenimiento por su ID
     */
    getRecordById: async (id: number): Promise<MaintenanceRecord> => {
        return await apiRequest<MaintenanceRecord>(`/maintenance/records/${id}`);
    },

    /**
     * Crear un nuevo registro de mantenimiento
     */
    createRecord: async (data: CreateMaintenanceRecordDto): Promise<MaintenanceRecord> => {
        return await apiRequest<MaintenanceRecord>('/maintenance/records', 'POST', data);
    },

    /**
     * Actualizar un registro de mantenimiento
     */
    updateRecord: async (id: number, data: UpdateMaintenanceRecordDto): Promise<MaintenanceRecord> => {
        return await apiRequest<MaintenanceRecord>(`/maintenance/records/${id}`, 'PATCH', data);
    },

    /**
     * Eliminar un registro de mantenimiento
     */
    deleteRecord: async (id: number): Promise<void> => {
        await apiRequest<void>(`/maintenance/records/${id}`, 'DELETE');
    },

    // RECORDATORIOS DE MANTENIMIENTO
    /**
     * Obtener todos los recordatorios de un vehículo
     */
    getRemindersByVehicle: async (vehicleId: number): Promise<MaintenanceReminder[]> => {
        return await apiRequest<MaintenanceReminder[]>(`/maintenance/vehicles/${vehicleId}/reminders`);
    },

    /**
     * Obtener un recordatorio por su ID
     */
    getReminderById: async (id: number): Promise<MaintenanceReminder> => {
        return await apiRequest<MaintenanceReminder>(`/maintenance/reminders/${id}`);
    },

    /**
     * Crear un nuevo recordatorio de mantenimiento
     */
    createReminder: async (data: CreateMaintenanceReminderDto): Promise<MaintenanceReminder> => {
        return await apiRequest<MaintenanceReminder>('/maintenance/reminders', 'POST', data);
    },

    /**
     * Desactivar un recordatorio
     */
    deactivateReminder: async (id: number): Promise<void> => {
        await apiRequest<void>(`/maintenance/reminders/${id}`, 'DELETE');
    },

    // FUNCIONES AUXILIARES
    /**
     * Convertir fecha de formato DD/MM/YYYY a YYYY-MM-DD para API
     */
    formatDateForApi: (date: string): string => {
        if (!date) return '';

        // Si ya está en formato ISO o YYYY-MM-DD, retornar tal cual
        if (date.includes('-')) return date;

        // Convertir de DD/MM/YYYY a YYYY-MM-DD
        const parts = date.split('/');
        if (parts.length !== 3) return date;

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    },

    /**
     * Convertir fecha de formato ISO o YYYY-MM-DD a DD/MM/YYYY para UI
     */
    formatDateForUI: (date: string | Date): string => {
        if (!date) return '';

        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return String(date);
        }
    }
};