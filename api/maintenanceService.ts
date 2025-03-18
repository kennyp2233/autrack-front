// services/api/maintenanceService.ts
import { apiRequest } from './config';
import { Maintenance, MaintenanceFormData } from '@/types/Maintenance';

/**
 * Servicio para gestionar mantenimientos de vehículos
 */
export const MaintenanceService = {
    /**
     * Obtiene todos los mantenimientos de un vehículo
     * @param vehicleId ID del vehículo
     */
    getMaintenanceByVehicle: async (vehicleId: number): Promise<Maintenance[]> => {
        const response = await apiRequest<any[]>(`/maintenance/vehicle/${vehicleId}`);

        // Transformar la respuesta de la API a nuestro modelo de datos
        return response.map(item => ({
            id: item.id_mantenimiento,
            vehicleId: item.id_vehiculo,
            type: item.tipo,
            date: item.fecha,
            time: item.hora,
            mileage: item.kilometraje,
            cost: item.costo,
            location: item.lugar,
            notes: item.notas,
            photos: item.fotos ? JSON.parse(item.fotos) : [],
            status: item.estado,
            createdAt: item.fecha_creacion,
            updatedAt: item.fecha_actualizacion
        }));
    },

    /**
     * Obtiene un mantenimiento específico por su ID
     * @param id ID del mantenimiento
     */
    getMaintenanceById: async (id: number): Promise<Maintenance> => {
        const response = await apiRequest<any>(`/maintenance/${id}`);

        // Transformar la respuesta de la API a nuestro modelo de datos
        return {
            id: response.id_mantenimiento,
            vehicleId: response.id_vehiculo,
            type: response.tipo,
            date: response.fecha,
            time: response.hora,
            mileage: response.kilometraje,
            cost: response.costo,
            location: response.lugar,
            notes: response.notas,
            photos: response.fotos ? JSON.parse(response.fotos) : [],
            status: response.estado,
            createdAt: response.fecha_creacion,
            updatedAt: response.fecha_actualizacion
        };
    },

    /**
     * Crea un nuevo registro de mantenimiento
     * @param maintenanceData Datos del mantenimiento a crear
     */
    createMaintenance: async (maintenanceData: MaintenanceFormData): Promise<Maintenance> => {
        const requestData = {
            id_vehiculo: maintenanceData.vehicleId,
            tipo: maintenanceData.type,
            fecha: maintenanceData.date,
            hora: maintenanceData.time,
            kilometraje: Number(maintenanceData.mileage),
            costo: maintenanceData.cost ? Number(maintenanceData.cost) : null,
            lugar: maintenanceData.location,
            notas: maintenanceData.notes,
            fotos: maintenanceData.photos ? JSON.stringify(maintenanceData.photos) : '[]',
            estado: 'completed'
        };

        const response = await apiRequest<any>(
            '/maintenance',
            'POST',
            requestData
        );

        // Transformar la respuesta de la API a nuestro modelo de datos
        return {
            id: response.id_mantenimiento,
            vehicleId: response.id_vehiculo,
            type: response.tipo,
            date: response.fecha,
            time: response.hora,
            mileage: response.kilometraje,
            cost: response.costo,
            location: response.lugar,
            notes: response.notas,
            photos: response.fotos ? JSON.parse(response.fotos) : [],
            status: response.estado,
            createdAt: response.fecha_creacion,
            updatedAt: response.fecha_actualizacion
        };
    },

    /**
     * Actualiza un mantenimiento existente
     * @param id ID del mantenimiento a actualizar
     * @param maintenanceData Datos a actualizar del mantenimiento
     */
    updateMaintenance: async (id: number, maintenanceData: Partial<MaintenanceFormData>): Promise<Maintenance> => {
        const requestData: any = {};

        if (maintenanceData.type) requestData.tipo = maintenanceData.type;
        if (maintenanceData.date) requestData.fecha = maintenanceData.date;
        if (maintenanceData.time) requestData.hora = maintenanceData.time;
        if (maintenanceData.mileage) requestData.kilometraje = Number(maintenanceData.mileage);
        if (maintenanceData.cost) requestData.costo = Number(maintenanceData.cost);
        if (maintenanceData.location) requestData.lugar = maintenanceData.location;
        if (maintenanceData.notes) requestData.notas = maintenanceData.notes;
        if (maintenanceData.photos) requestData.fotos = JSON.stringify(maintenanceData.photos);

        const response = await apiRequest<any>(
            `/maintenance/${id}`,
            'PATCH',
            requestData
        );

        // Transformar la respuesta de la API a nuestro modelo de datos
        return {
            id: response.id_mantenimiento,
            vehicleId: response.id_vehiculo,
            type: response.tipo,
            date: response.fecha,
            time: response.hora,
            mileage: response.kilometraje,
            cost: response.costo,
            location: response.lugar,
            notes: response.notas,
            photos: response.fotos ? JSON.parse(response.fotos) : [],
            status: response.estado,
            createdAt: response.fecha_creacion,
            updatedAt: response.fecha_actualizacion
        };
    },

    /**
     * Elimina un registro de mantenimiento
     * @param id ID del mantenimiento a eliminar
     */
    deleteMaintenance: async (id: number): Promise<boolean> => {
        await apiRequest<void>(
            `/maintenance/${id}`,
            'DELETE'
        );

        return true;
    },

    /**
     * Obtiene estadísticas de mantenimiento para un vehículo
     * @param vehicleId ID del vehículo
     */
    getMaintenanceStats: async (vehicleId: number): Promise<{
        totalCost: number;
        recordCount: number;
        lastMaintenanceDate: string;
        nextMaintenanceEstimate: string;
    }> => {
        const response = await apiRequest<any>(`/maintenance/stats/${vehicleId}`);

        return {
            totalCost: response.costo_total || 0,
            recordCount: response.cantidad_registros || 0,
            lastMaintenanceDate: response.fecha_ultimo_mantenimiento || '',
            nextMaintenanceEstimate: response.fecha_proximo_mantenimiento || ''
        };
    }
};