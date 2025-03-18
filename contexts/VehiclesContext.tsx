// contexts/VehiclesContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Vehicle, VehicleFormData } from '../types/Vehicle';
import { Maintenance, MaintenanceFormData } from '../types/Maintenance';
import { VehicleService, MaintenanceService } from '@/api';

interface VehiclesContextType {
    vehicles: Vehicle[];
    maintenance: Maintenance[];
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<boolean>;
    getVehicle: (id: number) => Vehicle | undefined;
    getVehicleMaintenance: (vehicleId: number) => Maintenance[];
    getMaintenance: (id: number) => Maintenance | undefined;
    addVehicle: (vehicleData: VehicleFormData) => Promise<Vehicle>;
    updateVehicle: (id: number, vehicleData: Partial<VehicleFormData>) => Promise<Vehicle | undefined>;
    deleteVehicle: (id: number) => Promise<boolean>;
    addMaintenance: (maintenanceData: MaintenanceFormData) => Promise<Maintenance>;
    updateMaintenance: (id: number, maintenanceData: Partial<MaintenanceFormData>) => Promise<Maintenance | undefined>;
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
    addMaintenance: async () => ({} as Maintenance),
    updateMaintenance: async () => undefined,
    deleteMaintenance: async () => false
});

interface VehiclesProviderProps {
    children: ReactNode;
}

export function VehiclesProvider({ children }: VehiclesProviderProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
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
            let allMaintenance: Maintenance[] = [];

            for (const vehicle of activeVehicles) {
                try {
                    const vehicleMaintenance = await MaintenanceService.getMaintenanceByVehicle(vehicle.id_vehiculo);
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
        return maintenance.filter(item => item.vehicleId === vehicleId);
    };

    // Obtener un mantenimiento por ID
    const getMaintenance = (id: number) => {
        return maintenance.find(item => item.id === id);
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
                prevMaintenance.filter(m => m.vehicleId !== id)
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

    // Añadir un nuevo mantenimiento
    const addMaintenance = async (maintenanceData: MaintenanceFormData) => {
        setIsLoading(true);
        try {
            const newMaintenance = await MaintenanceService.createMaintenance(maintenanceData);
            setMaintenance(prev => [...prev, newMaintenance]);

            // Actualizar información del vehículo si es necesario
            const vehicle = getVehicle(newMaintenance.vehicleId);
            if (vehicle) {
                // Calculamos la fecha del próximo mantenimiento (ejemplo: 3 meses después)
                const nextDate = new Date(newMaintenance.date);
                nextDate.setMonth(nextDate.getMonth() + 3);
                const nextDateStr = nextDate.toISOString().split('T')[0];

                // Actualizar el kilometraje y fechas de mantenimiento
                const updatedVehicle = await updateVehicle(vehicle.id_vehiculo, {
                    kilometraje_actual: newMaintenance.mileage
                });

                // Si no pudimos actualizar el vehículo, al menos actualizar el estado local
                if (!updatedVehicle) {
                    setVehicles(prevVehicles =>
                        prevVehicles.map(v => v.id_vehiculo === vehicle.id_vehiculo ?
                            { ...v, kilometraje_actual: newMaintenance.mileage } : v)
                    );
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

    // Actualizar un mantenimiento existente
    const updateMaintenance = async (id: number, maintenanceData: Partial<MaintenanceFormData>) => {
        const existingMaintenance = getMaintenance(id);
        if (!existingMaintenance) return undefined;

        setIsLoading(true);
        try {
            const updatedMaintenance = await MaintenanceService.updateMaintenance(id, maintenanceData);

            // Actualizar el mantenimiento en el estado local
            setMaintenance(prevMaintenance =>
                prevMaintenance.map(m => m.id === id ? updatedMaintenance : m)
            );

            // Si se actualizó el kilometraje, actualizar también el vehículo
            if (maintenanceData.mileage && Number(maintenanceData.mileage) > 0) {
                const vehicle = getVehicle(existingMaintenance.vehicleId);
                if (vehicle && Number(maintenanceData.mileage) > vehicle.kilometraje_actual) {
                    // Actualizar el kilometraje del vehículo si el nuevo es mayor
                    await updateVehicle(vehicle.id_vehiculo, {
                        kilometraje_actual: Number(maintenanceData.mileage)
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
            await MaintenanceService.deleteMaintenance(id);

            // Eliminar del estado local
            setMaintenance(prevMaintenance =>
                prevMaintenance.filter(m => m.id !== id)
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