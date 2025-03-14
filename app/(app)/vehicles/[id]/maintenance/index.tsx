// app/(app)/vehicles/[id]/maintenance/index.tsx
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useTheme } from '@/contexts/ThemeContext';

// Importar componentes personalizados - CORREGIDO: usar el componente correcto de la carpeta maintenance-home-page
import MaintenanceHeader from '@/components/maintenance/maintenance-home-page/MaintenanceHeader';
import MaintenanceFilters from '@/components/maintenance/maintenance-home-page/MaintenanceFilters';
import MaintenanceList from '@/components/maintenance/maintenance-home-page/MaintenanceList'; // CORREGIDO: importación del componente adecuado
import AddMaintenanceButton from '@/components/maintenance/maintenance-home-page/AddMaintenanceButton';
import ErrorScreen from '@/components/common/ErrorScreen';

export default function MaintenanceIndexScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { getVehicle, getVehicleMaintenance } = useVehicles();
    const { theme } = useTheme();

    // Obtener ID del vehículo de los parámetros
    const vehicleId = Number(params.id);

    // Obtener datos del vehículo y sus mantenimientos
    const vehicle = getVehicle(vehicleId);
    const allMaintenance = vehicle ? getVehicleMaintenance(vehicleId) : [];

    // Estado para filtros
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all',
        dateFrom: '',
        dateTo: '',
    });

    // Función para filtrar los mantenimientos según los criterios
    const getFilteredMaintenance = useCallback(() => {
        if (!vehicle || !allMaintenance) return [];

        let filtered = [...allMaintenance];

        // Filtrar por tipo
        if (filters.type !== 'all') {
            // Mapeo de IDs a nombres de tipos
            const typeMapping: { [key: string]: string } = {
                'oil': 'Cambio de Aceite',
                'brakes': 'Revisión de Frenos',
                'tires': 'Neumáticos',
            };

            const typeToFilter = typeMapping[filters.type] || filters.type;

            filtered = filtered.filter(item =>
                item.type.toLowerCase().includes(typeToFilter.toLowerCase())
            );
        }

        // Filtrar por fecha desde
        if (filters.dateFrom) {
            try {
                const fromDate = new Date(filters.dateFrom);
                if (!isNaN(fromDate.getTime())) {
                    filtered = filtered.filter(item => {
                        try {
                            const itemDate = new Date(item.date);
                            return !isNaN(itemDate.getTime()) && itemDate >= fromDate;
                        } catch (e) {
                            return true; // Si hay un error en la conversión, mantener el ítem
                        }
                    });
                }
            } catch (e) {
                console.log("Error en fecha desde:", e);
            }
        }

        // Filtrar por fecha hasta
        if (filters.dateTo) {
            try {
                const toDate = new Date(filters.dateTo);
                if (!isNaN(toDate.getTime())) {
                    filtered = filtered.filter(item => {
                        try {
                            const itemDate = new Date(item.date);
                            return !isNaN(itemDate.getTime()) && itemDate <= toDate;
                        } catch (e) {
                            return true; // Si hay un error en la conversión, mantener el ítem
                        }
                    });
                }
            } catch (e) {
                console.log("Error en fecha hasta:", e);
            }
        }

        // Ordenar por fecha más reciente
        return filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        });
    }, [vehicle, allMaintenance, filters.type, filters.dateFrom, filters.dateTo]);

    // Obtener los mantenimientos filtrados cada vez que se renderiza
    const filteredMaintenance = getFilteredMaintenance();

    // Manejar cambios en los filtros
    const handleChangeFilter = (name: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar navegación a la pantalla de detalles de mantenimiento
    const handleMaintenancePress = (maintenanceId: number) => {
        router.push(`/vehicles/${vehicleId}/maintenance/${maintenanceId}`);
    };

    // Manejar navegación a la pantalla de añadir mantenimiento
    const handleAddMaintenance = () => {
        router.push(`/vehicles/${vehicleId}/maintenance/add`);
    };

    // Si no se encuentra el vehículo
    if (!vehicle) {
        return (
            <ErrorScreen
                title="Vehículo no encontrado"
                message="No pudimos encontrar la información de este vehículo"
                buttonText="Volver"
                onButtonPress={() => router.back()}
                theme={theme}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

            {/* Header */}
            <MaintenanceHeader
                vehicle={vehicle}
                onBack={() => router.back()}
                onFilter={() => setShowFilters(!showFilters)}
                theme={theme}
            />

            {/* Filtros */}
            <MaintenanceFilters
                visible={showFilters}
                filters={filters}
                onChangeFilter={handleChangeFilter}
                onApply={() => setShowFilters(false)}
                onClear={() => setFilters({
                    type: 'all',
                    dateFrom: '',
                    dateTo: '',
                })}
                onClose={() => setShowFilters(false)}
                theme={theme}
            />

            {/* Lista de mantenimientos - CORREGIDO: actualizado para usar la estructura correcta */}
            <MaintenanceList
                maintenanceItems={filteredMaintenance}
                onItemPress={handleMaintenancePress}
                theme={theme}
            />

            {/* Botón para agregar mantenimiento */}
            <AddMaintenanceButton
                onPress={handleAddMaintenance}
                theme={theme}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});