import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Vehicle, VehicleFormData } from '../types/Vehicle';
import { Maintenance, MaintenanceFormData } from '../types/Maintenance';

interface VehiclesContextType {
    vehicles: Vehicle[];
    maintenance: Maintenance[];
    getVehicle: (id: number) => Vehicle | undefined;
    getVehicleMaintenance: (vehicleId: number) => Maintenance[];
    getMaintenance: (id: number) => Maintenance | undefined;
    addVehicle: (vehicleData: VehicleFormData) => Vehicle;
    updateVehicle: (id: number, vehicleData: Partial<VehicleFormData>) => Vehicle | undefined;
    deleteVehicle: (id: number) => boolean;
    addMaintenance: (maintenanceData: MaintenanceFormData) => Maintenance;
    updateMaintenance: (id: number, maintenanceData: Partial<MaintenanceFormData>) => Maintenance | undefined;
    deleteMaintenance: (id: number) => boolean;
}

// Datos iniciales para desarrollo
const initialVehicles: Vehicle[] = [
    {
        id: 1,
        userId: 1,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2019,
        plate: 'ABC-123',
        mileage: 35000,
        lastMaintenance: '15/01/2025',
        nextMaintenance: '15/03/2025',
        fuelType: 'Gasolina',
        color: '#3B82F6',
        vinNumber: 'JT2AE09W3P0031365',
        purchaseDate: '10/05/2019',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        isActive: true
    },
    {
        id: 2,
        userId: 1,
        brand: 'Honda',
        model: 'Civic',
        year: 2020,
        plate: 'XYZ-789',
        mileage: 28000,
        lastMaintenance: '02/02/2025',
        nextMaintenance: '02/04/2025',
        fuelType: 'Gasolina',
        color: '#10B981',
        vinNumber: 'JHMEH9694PS000494',
        purchaseDate: '20/07/2020',
        createdAt: '2023-02-01T00:00:00Z',
        updatedAt: '2023-02-01T00:00:00Z',
        isActive: true
    }
];

const initialMaintenance: Maintenance[] = [
    {
        id: 1,
        vehicleId: 1,
        type: 'Cambio de Aceite',
        date: '2025-01-15',
        mileage: 32500,
        cost: 180,
        location: 'Servicio Oficial Toyota',
        notes: 'Aceite sintético 5W-30, filtro de aceite nuevo',
        photos: ['photo1.jpg', 'photo2.jpg'],
        status: 'completed',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z'
    },
    {
        id: 2,
        vehicleId: 1,
        type: 'Revisión de Frenos',
        date: '2024-12-12',
        mileage: 30000,
        cost: 250,
        location: 'Frenos Express',
        notes: 'Cambio de pastillas delanteras y revisión de discos',
        photos: ['photo3.jpg'],
        status: 'completed',
        createdAt: '2022-12-12T00:00:00Z',
        updatedAt: '2022-12-12T00:00:00Z'
    },
    {
        id: 3,
        vehicleId: 1,
        type: 'Alineación y Balanceo',
        date: '2024-11-05',
        mileage: 28000,
        cost: 120,
        location: 'Neumáticos del Sur',
        notes: 'Rotación de neumáticos incluida',
        status: 'completed',
        createdAt: '2022-11-05T00:00:00Z',
        updatedAt: '2022-11-05T00:00:00Z'
    },
    {
        id: 4,
        vehicleId: 2,
        type: 'Cambio de Aceite',
        date: '2025-02-03',
        mileage: 15000,
        cost: 150,
        location: 'Servicio Rápido',
        status: 'completed',
        createdAt: '2023-02-03T00:00:00Z',
        updatedAt: '2023-02-03T00:00:00Z'
    },
    {
        id: 5,
        vehicleId: 2,
        type: 'Revisión General',
        date: '2024-12-20',
        mileage: 12000,
        cost: 320,
        location: 'Taller Multimarca',
        status: 'completed',
        createdAt: '2022-12-20T00:00:00Z',
        updatedAt: '2022-12-20T00:00:00Z'
    }
];

export const VehiclesContext = createContext<VehiclesContextType>({
    vehicles: [],
    maintenance: [],
    getVehicle: () => undefined,
    getVehicleMaintenance: () => [],
    getMaintenance: () => undefined,
    addVehicle: () => ({} as Vehicle),
    updateVehicle: () => undefined,
    deleteVehicle: () => false,
    addMaintenance: () => ({} as Maintenance),
    updateMaintenance: () => undefined,
    deleteMaintenance: () => false
});

interface VehiclesProviderProps {
    children: ReactNode;
}

export function VehiclesProvider({ children }: VehiclesProviderProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [maintenance, setMaintenance] = useState<Maintenance[]>(initialMaintenance);

    // Obtener un vehículo por ID
    const getVehicle = (id: number) => {
        return vehicles.find(vehicle => vehicle.id === id);
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
    const addVehicle = (vehicleData: VehicleFormData) => {
        const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
        const now = new Date().toISOString();

        const newVehicle: Vehicle = {
            id: newId,
            userId: 1, // Usuario de ejemplo
            ...vehicleData,
            mileage: Number(vehicleData.mileage),
            year: Number(vehicleData.year),
            createdAt: now,
            updatedAt: now,
            isActive: true
        };

        setVehicles([...vehicles, newVehicle]);
        return newVehicle;
    };

    // Actualizar un vehículo existente
    const updateVehicle = (id: number, vehicleData: Partial<VehicleFormData>) => {
        const vehicle = getVehicle(id);
        if (!vehicle) return undefined;

        const updatedVehicle: Vehicle = {
            ...vehicle,
            ...vehicleData,
            mileage: vehicleData.mileage ? Number(vehicleData.mileage) : vehicle.mileage,
            year: vehicleData.year ? Number(vehicleData.year) : vehicle.year,
            updatedAt: new Date().toISOString()
        };

        setVehicles(vehicles.map(v => v.id === id ? updatedVehicle : v));
        return updatedVehicle;
    };

    // Eliminar un vehículo
    const deleteVehicle = (id: number) => {
        const vehicle = getVehicle(id);
        if (!vehicle) return false;

        // Marcar como inactivo en lugar de eliminar físicamente
        const updatedVehicle: Vehicle = {
            ...vehicle,
            isActive: false,
            updatedAt: new Date().toISOString()
        };

        setVehicles(vehicles.map(v => v.id === id ? updatedVehicle : v));
        return true;
    };

    // Añadir un nuevo mantenimiento
    const addMaintenance = (maintenanceData: MaintenanceFormData) => {
        const newId = maintenance.length > 0 ? Math.max(...maintenance.map(m => m.id)) + 1 : 1;
        const now = new Date().toISOString();

        const newMaintenance: Maintenance = {
            id: newId,
            ...maintenanceData,
            mileage: Number(maintenanceData.mileage),
            cost: maintenanceData.cost ? Number(maintenanceData.cost) : undefined,
            status: 'completed',
            createdAt: now,
            updatedAt: now
        };

        setMaintenance([...maintenance, newMaintenance]);

        // Actualizar el último mantenimiento y el próximo en el vehículo
        const vehicle = getVehicle(newMaintenance.vehicleId);
        if (vehicle) {
            // Calcular la fecha del próximo mantenimiento (ejemplo: 3 meses después)
            const nextDate = new Date(newMaintenance.date);
            nextDate.setMonth(nextDate.getMonth() + 3);

            updateVehicle(vehicle.id, {
                lastMaintenance: newMaintenance.date,
                nextMaintenance: nextDate.toISOString().split('T')[0],
                mileage: newMaintenance.mileage
            });
        }

        return newMaintenance;
    };

    // Actualizar un mantenimiento existente
    const updateMaintenance = (id: number, maintenanceData: Partial<MaintenanceFormData>) => {
        const existingMaintenance = getMaintenance(id);
        if (!existingMaintenance) return undefined;

        const updatedMaintenance: Maintenance = {
            ...existingMaintenance,
            ...maintenanceData,
            mileage: maintenanceData.mileage ? Number(maintenanceData.mileage) : existingMaintenance.mileage,
            cost: maintenanceData.cost ? Number(maintenanceData.cost) : existingMaintenance.cost,
            updatedAt: new Date().toISOString()
        };

        setMaintenance(maintenance.map(m => m.id === id ? updatedMaintenance : m));
        return updatedMaintenance;
    };

    // Eliminar un mantenimiento
    const deleteMaintenance = (id: number) => {
        const exists = getMaintenance(id);
        if (!exists) return false;

        setMaintenance(maintenance.filter(m => m.id !== id));
        return true;
    };

    const value = {
        vehicles,
        maintenance,
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