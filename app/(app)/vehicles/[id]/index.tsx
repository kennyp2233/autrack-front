import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Datos de ejemplo
const vehiclesData = {
    '1': {
        id: 1,
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
    },
    '2': {
        id: 2,
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
    }
};

// Datos de ejemplo de mantenimientos
const maintenanceHistory = [
    {
        id: 1,
        vehicleId: 1,
        type: 'Cambio de Aceite',
        date: '15/01/2025',
        mileage: 32500,
        cost: 180,
        workshop: 'Servicio Oficial Toyota',
        notes: 'Aceite sintético 5W-30, filtro de aceite nuevo',
        status: 'completed'
    },
    {
        id: 2,
        vehicleId: 1,
        type: 'Revisión de Frenos',
        date: '12/12/2024',
        mileage: 30000,
        cost: 250,
        workshop: 'Frenos Express',
        notes: 'Cambio de pastillas delanteras y revisión de discos',
        status: 'completed'
    },
    {
        id: 3,
        vehicleId: 1,
        type: 'Alineación y Balanceo',
        date: '05/11/2024',
        mileage: 28000,
        cost: 120,
        workshop: 'Neumáticos del Sur',
        notes: 'Rotación de neumáticos incluida',
        status: 'completed'
    },
];

export default function VehicleDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const vehicleId = params.id as string;

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Obtener datos del vehículo
    const vehicle = vehiclesData[vehicleId as keyof typeof vehiclesData];

    // Filtrar los mantenimientos de este vehículo
    const vehicleMaintenance = maintenanceHistory.filter(item =>
        item.vehicleId === Number(vehicleId)
    );

    // Manejar editar vehículo
    const handleEditVehicle = () => {
        router.push(`/vehicles/${vehicleId}/edit`);
    };

    // Manejar añadir mantenimiento
    const handleAddMaintenance = () => {
        router.push(`/vehicles/${vehicleId}/maintenance/add`);
    };

    // Manejar eliminar vehículo
    const handleDeleteVehicle = () => {
        setShowDeleteConfirm(true);
    };

    // Confirmar eliminación
    const confirmDelete = () => {
        // Aquí iría la lógica para eliminar el vehículo
        Alert.alert('Vehículo eliminado', 'El vehículo ha sido eliminado correctamente');
        setShowDeleteConfirm(false);
        router.back();
    };

    if (!vehicle) {
        return (
            <View style={styles.container}>
                <Text>Vehículo no encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Detalle del Vehículo</Text>
                <TouchableOpacity>
                    <Feather name="more-vertical" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Vehicle Overview */}
                <View style={styles.card}>
                    <View style={styles.vehicleHeader}>
                        <View style={styles.vehicleIcon}>
                            <Feather name="truck" size={32} color="#3B82F6" />
                        </View>
                        <View>
                            <Text style={styles.vehicleName}>{vehicle.brand} {vehicle.model}</Text>
                            <Text style={styles.vehicleSubtitle}>{vehicle.year} • {vehicle.plate}</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Feather name="map" size={16} color="#666" />
                            <Text style={styles.statLabel}>Kilometraje</Text>
                            <Text style={styles.statValue}>{vehicle.mileage} km</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Feather name="calendar" size={16} color="#666" />
                            <Text style={styles.statLabel}>Último mantenimiento</Text>
                            <Text style={styles.statValue}>{vehicle.lastMaintenance}</Text>
                        </View>
                    </View>

                    <View style={styles.nextMaintenance}>
                        <View>
                            <View style={styles.nextMaintenanceHeader}>
                                <Feather name="alert-circle" size={16} color="#3B82F6" />
                                <Text style={styles.nextMaintenanceLabel}>Próximo mantenimiento</Text>
                            </View>
                            <Text style={styles.nextMaintenanceDate}>{vehicle.nextMaintenance}</Text>
                        </View>
                        <TouchableOpacity style={styles.scheduleButton}>
                            <Text style={styles.scheduleButtonText}>Programar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Vehicle Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Información del Vehículo</Text>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Marca</Text>
                        <Text style={styles.detailValue}>{vehicle.brand}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Modelo</Text>
                        <Text style={styles.detailValue}>{vehicle.model}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Año</Text>
                        <Text style={styles.detailValue}>{vehicle.year}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Placa</Text>
                        <Text style={styles.detailValue}>{vehicle.plate}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Tipo de combustible</Text>
                        <Text style={styles.detailValue}>{vehicle.fuelType}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Color</Text>
                        <View style={styles.colorDetail}>
                            <View style={[styles.colorSwatch, { backgroundColor: vehicle.color }]} />
                            <Text style={styles.detailValue}>Azul</Text>
                        </View>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Número VIN</Text>
                        <Text style={styles.detailValue}>{vehicle.vinNumber}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Fecha de adquisición</Text>
                        <Text style={styles.detailValue}>{vehicle.purchaseDate}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditVehicle}
                    >
                        <Feather name="edit-2" size={16} color="#666" />
                        <Text style={styles.editButtonText}>Editar información</Text>
                    </TouchableOpacity>
                </View>

                {/* Maintenance History */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Historial de Mantenimientos</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Ver todo</Text>
                        </TouchableOpacity>
                    </View>

                    {vehicleMaintenance.length > 0 ? (
                        vehicleMaintenance.map(maintenance => (
                            <View key={maintenance.id} style={styles.maintenanceItem}>
                                <View style={styles.maintenanceHeader}>
                                    <Text style={styles.maintenanceType}>{maintenance.type}</Text>
                                    <Text style={styles.maintenanceCost}>${maintenance.cost}</Text>
                                </View>

                                <View style={styles.maintenanceDetails}>
                                    <View style={styles.maintenanceDetail}>
                                        <Feather name="calendar" size={14} color="#999" />
                                        <Text style={styles.maintenanceDetailText}>{maintenance.date}</Text>
                                    </View>
                                    <View style={styles.maintenanceDetail}>
                                        <Feather name="map" size={14} color="#999" />
                                        <Text style={styles.maintenanceDetailText}>{maintenance.mileage} km</Text>
                                    </View>
                                </View>

                                {maintenance.notes && (
                                    <Text style={styles.maintenanceNotes}>{maintenance.notes}</Text>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noMaintenanceText}>No hay registros de mantenimiento</Text>
                    )}

                    <TouchableOpacity
                        style={styles.addMaintenanceButton}
                        onPress={handleAddMaintenance}
                    >
                        <Feather name="plus" size={16} color="#fff" />
                        <Text style={styles.addMaintenanceButtonText}>Agregar mantenimiento</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteVehicle}
                    >
                        <Feather name="trash-2" size={16} color="#EF4444" />
                        <Text style={styles.deleteButtonText}>Eliminar vehículo</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Eliminar vehículo</Text>
                        <Text style={styles.modalMessage}>
                            ¿Estás seguro de que deseas eliminar el {vehicle.brand} {vehicle.model}? Esta acción no se puede deshacer.
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setShowDeleteConfirm(false)}
                            >
                                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalDeleteButton}
                                onPress={confirmDelete}
                            >
                                <Text style={styles.modalDeleteButtonText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    vehicleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    vehicleIcon: {
        backgroundColor: '#EBF5FF',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    vehicleName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    vehicleSubtitle: {
        color: '#666',
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'flex-start',
    },
    statLabel: {
        color: '#666',
        marginVertical: 4,
    },
    statValue: {
        fontWeight: 'bold',
    },
    nextMaintenance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EBF5FF',
        padding: 12,
        borderRadius: 8,
    },
    nextMaintenanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nextMaintenanceLabel: {
        color: '#3B82F6',
        fontWeight: '500',
        marginLeft: 6,
    },
    nextMaintenanceDate: {
        fontWeight: 'bold',
        marginTop: 4,
    },
    scheduleButton: {
        backgroundColor: '#e6f0ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    scheduleButtonText: {
        color: '#3B82F6',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    detailLabel: {
        color: '#666',
    },
    detailValue: {
        fontWeight: '500',
    },
    colorDetail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorSwatch: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    editButtonText: {
        color: '#666',
        marginLeft: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    seeAllText: {
        color: '#3B82F6',
    },
    maintenanceItem: {
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    maintenanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    maintenanceType: {
        fontWeight: 'bold',
    },
    maintenanceCost: {
        fontWeight: 'bold',
    },
    maintenanceDetails: {
        flexDirection: 'row',
    },
    maintenanceDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    maintenanceDetailText: {
        color: '#666',
        marginLeft: 4,
    },
    maintenanceNotes: {
        marginTop: 8,
        color: '#666',
        fontSize: 13,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    noMaintenanceText: {
        color: '#666',
        textAlign: 'center',
        padding: 16,
    },
    addMaintenanceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3B82F6',
        padding: 12,
        borderRadius: 8,
        marginVertical: 16,
    },
    addMaintenanceButtonText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 8,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#EF4444',
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#EF4444',
        fontWeight: '500',
        marginLeft: 8,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        width: '100%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalMessage: {
        marginBottom: 20,
        color: '#666',
    },
    modalActions: {
        flexDirection: 'row',
    },
    modalCancelButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    modalCancelButtonText: {
        color: '#666',
    },
    modalDeleteButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#EF4444',
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 8,
    },
    modalDeleteButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});