// contexts/MaintenanceContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { MaintenanceService } from '@/api/maintenanceService';
import {
    MaintenanceCategory,
    MaintenanceType,
    MaintenanceRecord,
    MaintenanceReminder,
    CreateMaintenanceRecordDto,
    UpdateMaintenanceRecordDto
} from '@/types/Maintenance';
import { useAuth } from './AuthContext';

interface MaintenanceContextType {
    // Estados
    categories: MaintenanceCategory[];
    types: MaintenanceType[];
    records: Record<number, MaintenanceRecord[]>; // Indexed by vehicleId
    reminders: Record<number, MaintenanceReminder[]>; // Indexed by vehicleId
    isLoading: boolean;
    error: string | null;

    // Funciones para categorías
    loadCategories: () => Promise<void>;

    // Funciones para tipos
    loadTypes: () => Promise<void>;
    loadTypesByCategory: (categoryId: number) => Promise<MaintenanceType[]>;

    // Funciones para registros
    loadRecordsByVehicle: (vehicleId: number) => Promise<MaintenanceRecord[]>;
    getRecordById: (recordId: number) => MaintenanceRecord | undefined;
    createRecord: (data: CreateMaintenanceRecordDto) => Promise<MaintenanceRecord>;
    updateRecord: (recordId: number, data: UpdateMaintenanceRecordDto) => Promise<MaintenanceRecord>;
    deleteRecord: (recordId: number) => Promise<void>;

    // Funciones para recordatorios
    loadRemindersByVehicle: (vehicleId: number) => Promise<MaintenanceReminder[]>;
    createReminder: (data: any) => Promise<MaintenanceReminder>;
    deactivateReminder: (reminderId: number) => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    // Estados
    const [categories, setCategories] = useState<MaintenanceCategory[]>([]);
    const [types, setTypes] = useState<MaintenanceType[]>([]);
    const [records, setRecords] = useState<Record<number, MaintenanceRecord[]>>({});
    const [reminders, setReminders] = useState<Record<number, MaintenanceReminder[]>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar categorías una vez al iniciar
    useEffect(() => {
        if (user) {
            loadCategories();
            loadTypes();
        }
    }, [user]);

    // Funciones para categorías
    const loadCategories = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const data = await MaintenanceService.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error('Error cargando categorías:', err);
            setError('Error al cargar las categorías de mantenimiento');
        } finally {
            setIsLoading(false);
        }
    };

    // Funciones para tipos
    const loadTypes = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const data = await MaintenanceService.getAllTypes();
            setTypes(data);
        } catch (err) {
            console.error('Error cargando tipos:', err);
            setError('Error al cargar los tipos de mantenimiento');
        } finally {
            setIsLoading(false);
        }
    };

    const loadTypesByCategory = async (categoryId: number): Promise<MaintenanceType[]> => {
        try {
            setIsLoading(true);
            const data = await MaintenanceService.getTypesByCategory(categoryId);
            return data;
        } catch (err) {
            console.error(`Error cargando tipos de categoría ${categoryId}:`, err);
            setError('Error al cargar los tipos de mantenimiento');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Funciones para registros
    const loadRecordsByVehicle = async (vehicleId: number): Promise<MaintenanceRecord[]> => {
        try {
            setIsLoading(true);
            const data = await MaintenanceService.getRecordsByVehicle(vehicleId);

            // Actualizar estado
            setRecords(prev => ({
                ...prev,
                [vehicleId]: data
            }));

            return data;
        } catch (err) {
            console.error(`Error cargando registros del vehículo ${vehicleId}:`, err);
            setError('Error al cargar los registros de mantenimiento');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const getRecordById = (recordId: number): MaintenanceRecord | undefined => {
        // Buscar en todos los registros cargados
        for (const vehicleRecords of Object.values(records)) {
            const found = vehicleRecords.find(record => record.id_registro === recordId);
            if (found) return found;
        }
        return undefined;
    };

    const createRecord = async (data: CreateMaintenanceRecordDto): Promise<MaintenanceRecord> => {
        try {
            setIsLoading(true);

            // Formatear fecha si viene en formato UI (DD/MM/YYYY)
            const formattedData = {
                ...data,
                fecha: MaintenanceService.formatDateForApi(data.fecha)
            };

            const newRecord = await MaintenanceService.createRecord(formattedData);

            // Actualizar estado local
            setRecords(prev => {
                const vehicleRecords = prev[data.id_vehiculo] || [];
                return {
                    ...prev,
                    [data.id_vehiculo]: [...vehicleRecords, newRecord]
                };
            });

            return newRecord;
        } catch (err) {
            console.error('Error creando registro:', err);
            const errorMsg = err instanceof Error ? err.message : 'Error al crear el registro de mantenimiento';
            setError(errorMsg);
            Alert.alert('Error', errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateRecord = async (recordId: number, data: UpdateMaintenanceRecordDto): Promise<MaintenanceRecord> => {
        try {
            setIsLoading(true);

            // Formatear fecha si viene en formato UI (DD/MM/YYYY)
            const formattedData = {
                ...data,
                fecha: data.fecha ? MaintenanceService.formatDateForApi(data.fecha) : undefined
            };

            const updatedRecord = await MaintenanceService.updateRecord(recordId, formattedData);

            // Actualizar estado local
            setRecords(prev => {
                const newRecords = { ...prev };

                // Buscar y actualizar el registro en su vehículo correspondiente
                for (const vehicleId in newRecords) {
                    const index = newRecords[vehicleId].findIndex(r => r.id_registro === recordId);
                    if (index >= 0) {
                        newRecords[vehicleId] = [
                            ...newRecords[vehicleId].slice(0, index),
                            updatedRecord,
                            ...newRecords[vehicleId].slice(index + 1)
                        ];
                        break;
                    }
                }

                return newRecords;
            });

            return updatedRecord;
        } catch (err) {
            console.error(`Error actualizando registro ${recordId}:`, err);
            const errorMsg = err instanceof Error ? err.message : 'Error al actualizar el registro de mantenimiento';
            setError(errorMsg);
            Alert.alert('Error', errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteRecord = async (recordId: number): Promise<void> => {
        try {
            setIsLoading(true);

            // Encontrar el vehículo al que pertenece el registro para actualizar el estado después
            let vehicleId: number | null = null;
            const record = getRecordById(recordId);
            if (record) {
                vehicleId = record.id_vehiculo;
            }

            await MaintenanceService.deleteRecord(recordId);

            // Actualizar estado local solo si se encontró el vehículo
            if (vehicleId !== null) {
                setRecords(prev => {
                    const vehicleRecords = prev[vehicleId!] || [];
                    return {
                        ...prev,
                        [vehicleId!]: vehicleRecords.filter(r => r.id_registro !== recordId)
                    };
                });
            }
        } catch (err) {
            console.error(`Error eliminando registro ${recordId}:`, err);
            const errorMsg = err instanceof Error ? err.message : 'Error al eliminar el registro de mantenimiento';
            setError(errorMsg);
            Alert.alert('Error', errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Funciones para recordatorios
    const loadRemindersByVehicle = async (vehicleId: number): Promise<MaintenanceReminder[]> => {
        try {
            setIsLoading(true);
            const data = await MaintenanceService.getRemindersByVehicle(vehicleId);

            // Actualizar estado
            setReminders(prev => ({
                ...prev,
                [vehicleId]: data
            }));

            return data;
        } catch (err) {
            console.error(`Error cargando recordatorios del vehículo ${vehicleId}:`, err);
            setError('Error al cargar los recordatorios de mantenimiento');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const createReminder = async (data: any): Promise<MaintenanceReminder> => {
        try {
            setIsLoading(true);
            const newReminder = await MaintenanceService.createReminder(data);

            // Actualizar estado local
            setReminders(prev => {
                const vehicleReminders = prev[data.id_vehiculo] || [];
                return {
                    ...prev,
                    [data.id_vehiculo]: [...vehicleReminders, newReminder]
                };
            });

            return newReminder;
        } catch (err) {
            console.error('Error creando recordatorio:', err);
            const errorMsg = err instanceof Error ? err.message : 'Error al crear el recordatorio de mantenimiento';
            setError(errorMsg);
            Alert.alert('Error', errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deactivateReminder = async (reminderId: number): Promise<void> => {
        try {
            setIsLoading(true);
            await MaintenanceService.deactivateReminder(reminderId);

            // Actualizar estado local
            setReminders(prev => {
                const newReminders = { ...prev };

                // Buscar y actualizar el recordatorio en su vehículo correspondiente
                for (const vehicleId in newReminders) {
                    const index = newReminders[vehicleId].findIndex(r => r.id_recordatorio === reminderId);
                    if (index >= 0) {
                        newReminders[vehicleId][index] = {
                            ...newReminders[vehicleId][index],
                            activo: false
                        };
                        break;
                    }
                }

                return newReminders;
            });
        } catch (err) {
            console.error(`Error desactivando recordatorio ${reminderId}:`, err);
            const errorMsg = err instanceof Error ? err.message : 'Error al desactivar el recordatorio';
            setError(errorMsg);
            Alert.alert('Error', errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        // Estados
        categories,
        types,
        records,
        reminders,
        isLoading,
        error,

        // Funciones
        loadCategories,
        loadTypes,
        loadTypesByCategory,
        loadRecordsByVehicle,
        getRecordById,
        createRecord,
        updateRecord,
        deleteRecord,
        loadRemindersByVehicle,
        createReminder,
        deactivateReminder
    };

    return (
        <MaintenanceContext.Provider value={value}>
            {children}
        </MaintenanceContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useMaintenance = () => {
    const context = useContext(MaintenanceContext);
    if (context === undefined) {
        throw new Error('useMaintenance debe ser usado dentro de un MaintenanceProvider');
    }
    return context;
};