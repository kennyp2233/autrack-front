// services/api/vehicleService.ts
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

        // Transformar la respuesta de la API a nuestro modelo de datos
        return response.map(item => ({
            id: item.id_vehiculo,
            userId: item.id_usuario,
            brand: item.marca,
            model: item.modelo,
            year: item.anio,
            plate: item.placa || '',
            mileage: item.kilometraje_actual,
            fuelType: item.tipo_combustible || '',
            color: item.color || '#3B82F6',
            vinNumber: item.numero_vin || '',
            purchaseDate: item.fecha_compra || '',
            createdAt: item.fecha_creacion,
            updatedAt: item.fecha_actualizacion,
            isActive: item.activo,
            lastMaintenance: item.ultimo_mantenimiento || '',
            nextMaintenance: item.proximo_mantenimiento || ''
        }));
    },

    /**
     * Obtiene un vehículo por su ID
     * @param id ID del vehículo
     */
    getVehicleById: async (id: number): Promise<Vehicle> => {
        const response = await apiRequest<any>(`/vehicles/${id}`);

        // Transformar la respuesta de la API a nuestro modelo de datos
        return {
            id: response.id_vehiculo,
            userId: response.id_usuario,
            brand: response.marca,
            model: response.modelo,
            year: response.anio,
            plate: response.placa || '',
            mileage: response.kilometraje_actual,
            fuelType: response.tipo_combustible || '',
            color: response.color || '#3B82F6',
            vinNumber: response.numero_vin || '',
            purchaseDate: response.fecha_compra || '',
            createdAt: response.fecha_creacion,
            updatedAt: response.fecha_actualizacion,
            isActive: response.activo,
            lastMaintenance: response.ultimo_mantenimiento || '',
            nextMaintenance: response.proximo_mantenimiento || ''
        };
    },

    /**
     * Crea un nuevo vehículo
     * @param vehicleData Datos del vehículo a crear
     */
    createVehicle: async (vehicleData: VehicleFormData): Promise<Vehicle> => {
        // Por ahora necesitamos obtener los IDs de marca y modelo
        // Esto debería ser reemplazado por un proceso adecuado
        const brandId = await VehicleService.getBrandIdByName(vehicleData.brand);
        const modelId = await VehicleService.getModelIdByName(vehicleData.model, brandId);

        const requestData = {
            id_marca: brandId,
            id_modelo: modelId,
            placa: vehicleData.plate,
            anio: Number(vehicleData.year),
            kilometraje_actual: Number(vehicleData.mileage),
            color: vehicleData.color,
            tipo_combustible: vehicleData.fuelType,
            numero_vin: vehicleData.vinNumber,
            fecha_compra: vehicleData.purchaseDate
        };

        const response = await apiRequest<any>(
            '/vehicles',
            'POST',
            requestData
        );

        // Transformar la respuesta de la API a nuestro modelo de datos
        return {
            id: response.id_vehiculo,
            userId: response.id_usuario,
            brand: response.marca,
            model: response.modelo,
            year: response.anio,
            plate: response.placa || '',
            mileage: response.kilometraje_actual,
            fuelType: response.tipo_combustible || '',
            color: response.color || '#3B82F6',
            vinNumber: response.numero_vin || '',
            purchaseDate: response.fecha_compra || '',
            createdAt: response.fecha_creacion,
            updatedAt: response.fecha_actualizacion,
            isActive: response.activo,
            lastMaintenance: response.ultimo_mantenimiento || '',
            nextMaintenance: response.proximo_mantenimiento || ''
        };
    },

    /**
     * Actualiza un vehículo existente
     * @param id ID del vehículo a actualizar
     * @param vehicleData Datos a actualizar del vehículo
     */
    updateVehicle: async (id: number, vehicleData: Partial<VehicleFormData>): Promise<Vehicle> => {
        const requestData: any = {};

        if (vehicleData.plate) requestData.placa = vehicleData.plate;
        if (vehicleData.year) requestData.anio = Number(vehicleData.year);
        if (vehicleData.mileage) requestData.kilometraje_actual = Number(vehicleData.mileage);
        if (vehicleData.color) requestData.color = vehicleData.color;
        if (vehicleData.fuelType) requestData.tipo_combustible = vehicleData.fuelType;
        if (vehicleData.vinNumber) requestData.numero_vin = vehicleData.vinNumber;
        if (vehicleData.purchaseDate) requestData.fecha_compra = vehicleData.purchaseDate;

        const response = await apiRequest<any>(
            `/vehicles/${id}`,
            'PATCH',
            requestData
        );

        // Transformar la respuesta de la API a nuestro modelo de datos
        return {
            id: response.id_vehiculo,
            userId: response.id_usuario,
            brand: response.marca,
            model: response.modelo,
            year: response.anio,
            plate: response.placa || '',
            mileage: response.kilometraje_actual,
            fuelType: response.tipo_combustible || '',
            color: response.color || '#3B82F6',
            vinNumber: response.numero_vin || '',
            purchaseDate: response.fecha_compra || '',
            createdAt: response.fecha_creacion,
            updatedAt: response.fecha_actualizacion,
            isActive: response.activo,
            lastMaintenance: response.ultimo_mantenimiento || '',
            nextMaintenance: response.proximo_mantenimiento || ''
        };
    },

    /**
     * Actualiza solo el kilometraje de un vehículo
     * @param id ID del vehículo
     * @param mileage Nuevo kilometraje
     */
    updateMileage: async (id: number, mileage: number): Promise<Vehicle> => {
        const response = await apiRequest<any>(
            `/vehicles/${id}/kilometraje`,
            'PATCH',
            { kilometraje: mileage }
        );

        // Transformar la respuesta de la API a nuestro modelo de datos
        return {
            id: response.id_vehiculo,
            userId: response.id_usuario,
            brand: response.marca,
            model: response.modelo,
            year: response.anio,
            plate: response.placa || '',
            mileage: response.kilometraje_actual,
            fuelType: response.tipo_combustible || '',
            color: response.color || '#3B82F6',
            vinNumber: response.numero_vin || '',
            purchaseDate: response.fecha_compra || '',
            createdAt: response.fecha_creacion,
            updatedAt: response.fecha_actualizacion,
            isActive: response.activo,
            lastMaintenance: response.ultimo_mantenimiento || '',
            nextMaintenance: response.proximo_mantenimiento || ''
        };
    },

    /**
     * Elimina (desactiva) un vehículo
     * @param id ID del vehículo a eliminar
     */
    deleteVehicle: async (id: number): Promise<boolean> => {
        await apiRequest<void>(
            `/vehicles/${id}`,
            'DELETE'
        );

        return true;
    },

    /**
     * Obtiene todas las marcas de vehículos disponibles
     */
    getAllBrands: async (): Promise<{ id: number, name: string }[]> => {
        const response = await apiRequest<any[]>('/vehicles/brands/all');

        return response.map(brand => ({
            id: brand.id_marca,
            name: brand.nombre
        }));
    },

    /**
     * Obtiene todos los modelos asociados a una marca
     * @param brandId ID de la marca
     */
    getModelsByBrand: async (brandId: number): Promise<{ id: number, name: string }[]> => {
        const response = await apiRequest<any[]>(`/vehicles/brands/${brandId}/models`);

        return response.map(model => ({
            id: model.id_modelo,
            name: model.nombre
        }));
    },

    /**
     * Método auxiliar para obtener el ID de una marca por su nombre
     * @param brandName Nombre de la marca
     */
    getBrandIdByName: async (brandName: string): Promise<number> => {
        const brands = await VehicleService.getAllBrands();
        const brand = brands.find((b: { name: string; }) => b.name.toLowerCase() === brandName.toLowerCase());

        if (brand) return brand.id;

        // Si no existe, crear la marca
        const response = await apiRequest<any>(
            '/vehicles/brands',
            'POST',
            { nombre: brandName }
        );

        return response.id_marca;
    },

    /**
     * Método auxiliar para obtener el ID de un modelo por su nombre y marca
     * @param modelName Nombre del modelo
     * @param brandId ID de la marca
     */
    getModelIdByName: async (modelName: string, brandId: number): Promise<number> => {
        const models = await VehicleService.getModelsByBrand(brandId);
        const model = models.find((m: { name: string; }) => m.name.toLowerCase() === modelName.toLowerCase());

        if (model) return model.id;

        // Si no existe, crear el modelo
        const response = await apiRequest<any>(
            '/vehicles/models',
            'POST',
            {
                id_marca: brandId,
                nombre: modelName
            }
        );

        return response.id_modelo;
    }
};