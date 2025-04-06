// contexts/VehiclesContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Vehicle, VehicleFormData } from '../types/Vehicle';
import { MaintenanceRecord, CreateMaintenanceRecordDto, UpdateMaintenanceRecordDto } from '../types/Maintenance';
import { VehicleService, MaintenanceService } from '@/api';

interface VehiclesContextType {
    vehicles: Vehicle[];
    maintenance: MaintenanceRecord[];
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<boolean>;
    getVehicle: (id: number) => Vehicle | undefined;
    getVehicleMaintenance: (vehicleId: number) => MaintenanceRecord[];
    getMaintenance: (id: number) => MaintenanceRecord | undefined;
    addVehicle: (vehicleData: VehicleFormData) => Promise<Vehicle>;
    updateVehicle: (id: number, vehicleData: Partial<VehicleFormData>) => Promise<Vehicle | undefined>;
    deleteVehicle: (id: number) => Promise<boolean>;
    addMaintenance: (maintenanceData: CreateMaintenanceRecordDto) => Promise<MaintenanceRecord>;
    updateMaintenance: (id: number, maintenanceData: Partial<UpdateMaintenanceRecordDto>) => Promise<MaintenanceRecord | undefined>;
    deleteMaintenance: (id: number) => Promise<boolean>;
}

export const VehiclesContext = createContext<VehiclesContextType>({
    vehicles: [],
    maintenance: [],
    isLoading: false,
    error: null,
    refreshData: async () => false,
    getVehicle: () => undefined,
    getVehicleMaintenance: () => [],
    getMaintenance: () => undefined,
    addVehicle: async () => ({} as Vehicle),
    updateVehicle: async () => undefined,
    deleteVehicle: async () => false,
    addMaintenance: async () => ({} as MaintenanceRecord),
    updateMaintenance: async () => undefined,
    deleteMaintenance: async () => false
});

interface VehiclesProviderProps {
    children: ReactNode;
}

export function VehiclesProvider({ children }: VehiclesProviderProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar todos los datos al inicio
    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Cargar vehículos
            const vehiclesData = await VehicleService.getAllVehicles();
            // Filtrar solo vehículos activos
            const activeVehicles = vehiclesData.filter(v => v.activo !== false);
            setVehicles(activeVehicles);

            // Cargar mantenimientos de todos los vehículos activos
            let allMaintenance: MaintenanceRecord[] = [];

            for (const vehicle of activeVehicles) {
                try {
                    const vehicleMaintenance = await MaintenanceService.getRecordsByVehicle(vehicle.id_vehiculo);
                    allMaintenance = [...allMaintenance, ...vehicleMaintenance];
                } catch (err) {
                    console.error(`Error al cargar mantenimientos del vehículo ${vehicle.id_vehiculo}:`, err);
                    // Continuar con el siguiente vehículo en lugar de fallar completamente
                }
            }

            setMaintenance(allMaintenance);
            return true;
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar los datos. Inténtalo de nuevo.');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar datos al montar el componente
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Función para actualizar los datos
    const refreshData = async (): Promise<boolean> => {
        return await loadData();
    };

    // Obtener un vehículo por ID
    const getVehicle = (id: number) => {
        return vehicles.find(vehicle => vehicle.id_vehiculo === id);
    };

    // Obtener los mantenimientos de un vehículo
    const getVehicleMaintenance = (vehicleId: number) => {
        return maintenance.filter(item => item.id_vehiculo === vehicleId);
    };

    // Obtener un mantenimiento por ID
    const getMaintenance = (id: number) => {
        return maintenance.find(item => item.id_registro === id);
    };

    // Añadir un nuevo vehículo
    const addVehicle = async (vehicleData: VehicleFormData) => {
        setIsLoading(true);
        try {
            const newVehicle = await VehicleService.createVehicle(vehicleData);

            // Asegurarse de que el nuevo vehículo tiene la propiedad activo
            const vehicleWithActive = {
                ...newVehicle,
                activo: true
            };

            setVehicles(prev => [...prev, vehicleWithActive]);
            return vehicleWithActive;
        } catch (err) {
            console.error('Error al añadir vehículo:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al añadir vehículo';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Actualizar un vehículo existente
    const updateVehicle = async (id: number, vehicleData: Partial<VehicleFormData>) => {
        const vehicle = getVehicle(id);
        if (!vehicle) return undefined;

        setIsLoading(true);
        try {
            const updatedVehicle = await VehicleService.updateVehicle(id, vehicleData);

            // Actualizar el vehículo en el estado local
            setVehicles(prevVehicles =>
                prevVehicles.map(v => v.id_vehiculo === id ? { ...v, ...updatedVehicle } : v)
            );

            return updatedVehicle;
        } catch (err) {
            console.error('Error al actualizar vehículo:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar vehículo';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar un vehículo (marcar como inactivo)
    const deleteVehicle = async (id: number) => {
        const vehicle = getVehicle(id);
        if (!vehicle) return false;

        setIsLoading(true);
        try {
            await VehicleService.deleteVehicle(id);

            // Eliminar de la lista local (o marcar como inactivo)
            setVehicles(prevVehicles =>
                prevVehicles.filter(v => v.id_vehiculo !== id)
            );

            // También eliminar los mantenimientos asociados del estado local
            setMaintenance(prevMaintenance =>
                prevMaintenance.filter(m => m.id_vehiculo !== id)
            );

            return true;
        } catch (err) {
            console.error('Error al eliminar vehículo:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar vehículo';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Método para añadir un nuevo mantenimiento
    const addMaintenance = async (maintenanceData: CreateMaintenanceRecordDto) => {
        setIsLoading(true);
        try {
            const newMaintenance = await MaintenanceService.createRecord(maintenanceData);

            // Actualizar estado local
            setMaintenance(prev => [...prev, newMaintenance]);

            // Actualizar información del vehículo si es necesario
            const vehicle = getVehicle(newMaintenance.id_vehiculo);
            if (vehicle) {
                // Actualizar el kilometraje si el del mantenimiento es mayor
                if (newMaintenance.kilometraje > vehicle.kilometraje_actual) {
                    await updateVehicle(vehicle.id_vehiculo, {
                        kilometraje_actual: newMaintenance.kilometraje
                    });
                }
            }

            return newMaintenance;
        } catch (err) {
            console.error('Error al añadir mantenimiento:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al añadir mantenimiento';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Método para actualizar un mantenimiento existente
    const updateMaintenance = async (id: number, maintenanceData: Partial<UpdateMaintenanceRecordDto>) => {
        const existingMaintenance = getMaintenance(id);
        if (!existingMaintenance) return undefined;

        setIsLoading(true);
        try {
            // Formatear fecha si viene en formato UI (DD/MM/YYYY)
            const formattedData = {
                ...maintenanceData,
                fecha: maintenanceData.fecha ? MaintenanceService.formatDateForApi(maintenanceData.fecha) : undefined
            };

            const updatedMaintenance = await MaintenanceService.updateRecord(id, formattedData);

            // Actualizar el mantenimiento en el estado local
            setMaintenance(prevMaintenance =>
                prevMaintenance.map(m => m.id_registro === id ? updatedMaintenance : m)
            );

            // Si se actualizó el kilometraje, actualizar también el vehículo
            if (maintenanceData.kilometraje) {
                const vehicle = getVehicle(existingMaintenance.id_vehiculo);
                if (vehicle && maintenanceData.kilometraje > vehicle.kilometraje_actual) {
                    // Actualizar el kilometraje del vehículo si el nuevo es mayor
                    await updateVehicle(vehicle.id_vehiculo, {
                        kilometraje_actual: maintenanceData.kilometraje
                    });
                }
            }

            return updatedMaintenance;
        } catch (err) {
            console.error('Error al actualizar mantenimiento:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar mantenimiento';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar un mantenimiento
    const deleteMaintenance = async (id: number) => {
        const existingMaintenance = getMaintenance(id);
        if (!existingMaintenance) return false;

        setIsLoading(true);
        try {
            await MaintenanceService.deleteRecord(id);

            // Eliminar del estado local
            setMaintenance(prevMaintenance =>
                prevMaintenance.filter(m => m.id_registro !== id)
            );

            return true;
        } catch (err) {
            console.error('Error al eliminar mantenimiento:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar mantenimiento';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        vehicles,
        maintenance,
        isLoading,
        error,
        refreshData,
        getVehicle,
        getVehicleMaintenance,
        getMaintenance,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addMaintenance,
        updateMaintenance,
        deleteMaintenance
    };

    return <VehiclesContext.Provider value={value}>{children}</VehiclesContext.Provider>;
}

// Hook personalizado para usar el contexto de vehículos
export function useVehicles() {
    const context = useContext(VehiclesContext);
    if (context === undefined) {
        throw new Error('useVehicles debe ser usado dentro de un VehiclesProvider');
    }
    return context;
}