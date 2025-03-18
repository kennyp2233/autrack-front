// api/vehicleService.ts
import { apiRequest } from './config';
import { Vehicle, VehicleFormData } from '@/types/Vehicle';

/**
 * Servicio para gestionar vehículos
 */
export const VehicleService = {
    /**
     * Obtiene todos los vehículos del usuario
     */
    getAllVehicles: async (): Promise<Vehicle[]> => {
        const response = await apiRequest<any[]>('/vehicles');
        return response;
    },

    /**
     * Obtiene un vehículo por su ID
     * @param id ID del vehículo
     */
    getVehicleById: async (id: number): Promise<Vehicle> => {
        const response = await apiRequest<Vehicle>(`/vehicles/${id}`);
        return response;
    },

    /**
     * Crea un nuevo vehículo
     * @param vehicleData Datos del vehículo a crear
     */
    createVehicle: async (vehicleData: VehicleFormData): Promise<Vehicle> => {
        // Adaptamos el objeto para que coincida con la estructura del backend
        const requestData = {
            placa: vehicleData.placa,
            id_marca: vehicleData.id_marca,
            id_modelo: vehicleData.id_modelo,
            anio: Number(vehicleData.anio),
            kilometraje_actual: Number(vehicleData.kilometraje_actual)
        };

        return await apiRequest<Vehicle>(
            '/vehicles',
            'POST',
            requestData
        );
    },

    /**
     * Actualiza un vehículo existente
     * @param id ID del vehículo a actualizar
     * @param vehicleData Datos a actualizar del vehículo
     */
    updateVehicle: async (id: number, vehicleData: Partial<VehicleFormData>): Promise<Vehicle> => {
        const requestData: any = {};

        if (vehicleData.placa !== undefined) requestData.placa = vehicleData.placa;
        if (vehicleData.id_marca !== undefined) requestData.id_marca = vehicleData.id_marca;
        if (vehicleData.id_modelo !== undefined) requestData.id_modelo = vehicleData.id_modelo;
        if (vehicleData.anio !== undefined) requestData.anio = Number(vehicleData.anio);
        if (vehicleData.kilometraje_actual !== undefined) requestData.kilometraje_actual = Number(vehicleData.kilometraje_actual);

        return await apiRequest<Vehicle>(
            `/vehicles/${id}`,
            'PATCH',
            requestData
        );
    },

    /**
     * Actualiza solo el kilometraje de un vehículo
     * @param id ID del vehículo
     * @param kilometraje Nuevo kilometraje
     */
    updateKilometraje: async (id: number, kilometraje: number): Promise<Vehicle> => {
        return await apiRequest<Vehicle>(
            `/vehicles/${id}/kilometraje`,
            'PATCH',
            { kilometraje }
        );
    },

    /**
     * Elimina un vehículo
     * @param id ID del vehículo a eliminar
     */
    deleteVehicle: async (id: number): Promise<void> => {
        await apiRequest<void>(
            `/vehicles/${id}`,
            'DELETE'
        );
    },

    /**
     * Obtiene todas las marcas de vehículos disponibles
     */
    getAllBrands: async (): Promise<any[]> => {
        return await apiRequest<any[]>('/vehicles/brands/all');
    },

    /**
     * Obtiene una marca específica por su ID
     * @param id ID de la marca
     */
    getBrandById: async (id: number): Promise<any> => {
        return await apiRequest<any>(`/vehicles/brands/${id}`);
    },

    /**
     * Crea una nueva marca
     * @param nombre Nombre de la marca
     */
    createBrand: async (nombre: string): Promise<any> => {
        return await apiRequest<any>(
            '/vehicles/brands',
            'POST',
            { nombre }
        );
    },

    /**
     * Obtiene todos los modelos asociados a una marca
     * @param brandId ID de la marca
     */
    getModelsByBrand: async (brandId: number): Promise<any[]> => {
        return await apiRequest<any[]>(`/vehicles/brands/${brandId}/models`);
    },

    /**
     * Obtiene un modelo específico por su ID
     * @param id ID del modelo
     */
    getModelById: async (id: number): Promise<any> => {
        return await apiRequest<any>(`/vehicles/models/${id}`);
    },

    /**
     * Crea un nuevo modelo
     * @param createModelDto Datos del modelo a crear
     */
    createModel: async (createModelDto: { id_marca: number, nombre: string }): Promise<any> => {
        return await apiRequest<any>(
            '/vehicles/models',
            'POST',
            createModelDto
        );
    }
};