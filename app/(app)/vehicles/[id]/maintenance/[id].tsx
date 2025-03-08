import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Datos de ejemplo
const maintenanceData = {
    '1': {
        id: 1,
        vehicleId: 1,
        type: 'Cambio de Aceite',
        date: '15/01/2025',
        mileage: 32500,
        cost: 180,
        workshop: 'Servicio Oficial Toyota',
        notes: 'Aceite sintético 5W-30, filtro de aceite nuevo. Técnico recomendó revisar los frenos en el próximo mantenimiento.',
        photos: ['photo1.jpg', 'photo2.jpg'],
        status: 'completed'
    },
    '2': {
        id: 2,
        vehicleId: 1,
        type: 'Revisión de Frenos',
        date: '12/12/2024',
        mileage: 30000,
        cost: 250,
        workshop: 'Frenos Express',
        notes: 'Cambio de pastillas delanteras y revisión de discos. Los discos traseros están en buen estado.',
        photos: ['photo3.jpg'],
        status: 'completed'
    }
};

// Datos de ejemplo de vehículos
const vehiclesData = {
    '1': {
        id: 1,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2019,
        plate: 'ABC-123',
    },
    '2': {
        id: 2,
        brand: 'Honda',
        model: 'Civic',
        year: 2020,
        plate: 'XYZ-789',
    }
};

export default function MaintenanceDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();

    // Obtener IDs de parámetros de ruta
    const vehicleId = params.id as string;
    const maintenanceId = params.id2 || params[0] as string;

    // Obtener datos
    const maintenance = maintenanceData[maintenanceId.toString() as keyof typeof maintenanceData];
    const vehicle = vehiclesData[vehicleId.toString() as keyof typeof vehiclesData];

    // Estado para modal de confirmación
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Manejar editar mantenimiento
    const handleEdit = () => {
        // Aquí iría la navegación a la pantalla de edición
        Alert.alert('Función no implementada', 'La edición de mantenimiento aún no está implementada');
    };

    // Manejar eliminar mantenimiento
    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    // Confirmar eliminación
    const confirmDelete = () => {
        // Aquí iría la lógica para eliminar
        Alert.alert('Registro eliminado', 'El registro de mantenimiento ha sido eliminado');
        setShowDeleteConfirm(false);
        router.back();
    };

    if (!maintenance || !vehicle) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Detalle no encontrado</Text>
                </View>
                <View style={styles.content}>
                    <Text>El registro de mantenimiento o vehículo no existe.</Text>
                </View>
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
                <Text style={styles.title}>Detalle de Mantenimiento</Text>
                <TouchableOpacity>
                    <Feather name="more-vertical" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Maintenance Header */}
                <View style={styles.card}>
                    <Text style={styles.maintenanceType}>{maintenance.type}</Text>
                    <Text style={styles.vehicleInfo}>{vehicle.brand} {vehicle.model} ({vehicle.year})</Text>

                    <View style={styles.costContainer}>
                        <Text style={styles.costLabel}>Costo:</Text>
                        <Text style={styles.costValue}>${maintenance.cost.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Maintenance Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Detalles</Text>

                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Feather name="calendar" size={16} color="#666" />
                            <Text style={styles.detailLabel}>Fecha</Text>
                            <Text style={styles.detailValue}>{maintenance.date}</Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Feather name="map-pin" size={16} color="#666" />
                            <Text style={styles.detailLabel}>Kilometraje</Text>
                            <Text style={styles.detailValue}>{maintenance.mileage} km</Text>
                        </View>
                    </View>

                    {maintenance.workshop && (
                        <View style={styles.fullDetailItem}>
                            <Feather name="home" size={16} color="#666" />
                            <Text style={styles.detailLabel}>Taller</Text>
                            <Text style={styles.detailValue}>{maintenance.workshop}</Text>
                        </View>
                    )}
                </View>

                {/* Notes */}
                {maintenance.notes && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Notas</Text>
                        <Text style={styles.notes}>{maintenance.notes}</Text>
                    </View>
                )}

                {/* Photos */}
                {maintenance.photos && maintenance.photos.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Fotos y Documentos</Text>
                        <View style={styles.photosContainer}>
                            {maintenance.photos.map((photo, index) => (
                                <View key={index} style={styles.photoItem}>
                                    <View style={styles.photoPlaceholder}>
                                        <Text style={styles.photoPlaceholderText}>Foto {index + 1}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEdit}
                    >
                        <Feather name="edit" size={16} color="#3B82F6" />
                        <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Feather name="trash-2" size={16} color="#EF4444" />
                        <Text style={styles.deleteButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Eliminar registro</Text>
                        <Text style={styles.modalMessage}>
                            ¿Estás seguro de que deseas eliminar este registro de mantenimiento? Esta acción no se puede deshacer.
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowDeleteConfirm(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={confirmDelete}
                            >
                                <Text style={styles.confirmButtonText}>Eliminar</Text>
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
    maintenanceType: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    vehicleInfo: {
        color: '#666',
        marginBottom: 16,
    },
    costContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
    },
    costLabel: {
        fontWeight: 'bold',
    },
    costValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        marginLeft: -8,
        marginRight: -8,
    },
    detailItem: {
        flex: 1,
        alignItems: 'flex-start',
        padding: 8,
    },
    fullDetailItem: {
        alignItems: 'flex-start',
        padding: 8,
        marginTop: 8,
    },
    detailLabel: {
        color: '#666',
        marginTop: 4,
        marginBottom: 4,
    },
    detailValue: {
        fontWeight: 'bold',
    },
    notes: {
        lineHeight: 20,
    },
    photosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: -4,
    },
    photoItem: {
        width: 100,
        height: 100,
        margin: 4,
    },
    photoPlaceholder: {
        backgroundColor: '#eee',
        width: '100%',
        height: '100%',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoPlaceholderText: {
        color: '#999',
    },
    actionsContainer: {
        marginBottom: 24,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    editButtonText: {
        color: '#3B82F6',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    deleteButtonText: {
        color: '#EF4444',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        width: '100%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalMessage: {
        color: '#666',
        marginBottom: 16,
    },
    modalActions: {
        flexDirection: 'row',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#666',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#EF4444',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginLeft: 8,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});