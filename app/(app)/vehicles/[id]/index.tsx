import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useTheme } from '@/contexts/ThemeContext';

// Componentes modulares
import VehicleDetailHeader from '@/components/vehicles/vehicle-detail-page/VehicleDetailHeader';
import VehicleOverview from '@/components/vehicles/vehicle-detail-page/VehicleOverview';
import VehicleInfo from '@/components/vehicles/vehicle-detail-page/VehicleInfo';
import MaintenanceHistory from '@/components/vehicles/vehicle-detail-page/MaintenanceHistory';
import OptionsMenu from '@/components/vehicles/vehicle-detail-page/OptionsMenu';
import DeleteConfirmationModal from '@/components/vehicles/vehicle-detail-page/DeleteConfirmationModal';
import ErrorScreen from '@/components/common/ErrorScreen';

export default function VehicleDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const vehicleId = Number(params.id as string);

    const { getVehicle, getVehicleMaintenance, deleteVehicle } = useVehicles();
    const { theme } = useTheme();

    // Obtener datos del vehículo y su mantenimiento
    const vehicle = getVehicle(vehicleId);
    const vehicleMaintenance = getVehicleMaintenance(vehicleId);

    // Estado para modales y menús
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

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

    // Construir títulos a partir de marca y modelo
    const brandName = vehicle.marca?.nombre || '';
    const modelName = vehicle.modelo?.nombre || '';
    const vehicleTitle = `${brandName} ${modelName}`;

    // Manejadores de acciones
    const handleEditVehicle = () => {
        router.push(`/vehicles/${vehicleId}/edit`);
        setShowOptionsMenu(false);
    };

    const handleAddMaintenance = () => {
        router.push(`/vehicles/${vehicleId}/maintenance/add`);
    };

    const handleViewAllMaintenance = () => {
        router.push(`/vehicles/${vehicleId}/maintenance`);
    };

    const handleDeleteVehicle = () => {
        setShowOptionsMenu(false);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const success = await deleteVehicle(vehicleId);
            if (success) {
                router.replace('/vehicles');
            }
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header con título y opciones */}
            <VehicleDetailHeader
                title={vehicleTitle}
                onBack={() => router.back()}
                onOptionsPress={() => setShowOptionsMenu(true)}
                theme={theme}
            />

            {/* Contenido principal con ScrollView */}
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Resumen del vehículo */}
                <VehicleOverview
                    vehicle={vehicle}
                    onSchedulePress={handleAddMaintenance}
                    theme={theme}
                />

                {/* Información detallada */}
                <VehicleInfo
                    vehicle={vehicle}
                    onEditPress={handleEditVehicle}
                    theme={theme}
                />

                {/* Historial de mantenimiento */}
                <MaintenanceHistory
                    maintenanceItems={vehicleMaintenance}
                    vehicleId={vehicleId}
                    onViewAllPress={handleViewAllMaintenance}
                    onAddPress={handleAddMaintenance}
                    onDeleteVehiclePress={handleDeleteVehicle}
                    theme={theme}
                />

                {/* Espacio adicional al final para evitar que el último elemento quede
                   oculto por modales o elementos flotantes */}
                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* Menú de opciones */}
            {showOptionsMenu && (
                <OptionsMenu
                    onClose={() => setShowOptionsMenu(false)}
                    onEdit={handleEditVehicle}
                    onViewMaintenance={handleViewAllMaintenance}
                    onAddMaintenance={handleAddMaintenance}
                    onDelete={handleDeleteVehicle}
                    theme={theme}
                />
            )}

            {/* Modal de confirmación para eliminar */}
            {showDeleteConfirm && (
                <DeleteConfirmationModal
                    vehicle={vehicle}
                    onCancel={() => setShowDeleteConfirm(false)}
                    onConfirm={confirmDelete}
                    theme={theme}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    bottomPadding: {
        height: 20, // Añadir espacio al final del scroll
    }
});