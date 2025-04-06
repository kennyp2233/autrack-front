// app/(app)/vehicles/[id]/maintenance/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { MaintenanceRecord, MaintenanceType } from '@/types/Maintenance';

// Componentes
import StaticHeader from '@/components/common/StaticHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingErrorIndicator from '@/components/common/LoadingErrorIndicator';

export default function MaintenanceDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { theme, isDark } = useTheme();

    // Obtener IDs
    const vehicleId = Number(params.id);
    // El segundo id puede venir en diferentes formatos según la navegación
    const maintenanceId = params.id2
        ? Number(params.id2)
        : Number(Array.isArray(params[0]) ? params[0][0] : params[0]);

    // Contextos
    const { getVehicle } = useVehicles();
    const {
        getRecordById,
        loadRecordsByVehicle,
        deleteRecord,
        types,
        loadTypes,
        isLoading,
        error
    } = useMaintenance();

    // Estados
    const [maintenance, setMaintenance] = useState<MaintenanceRecord | null>(null);
    const [maintenanceType, setMaintenanceType] = useState<MaintenanceType | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Obtener el vehículo
    const vehicle = getVehicle(vehicleId);

    // Cargar datos
    useEffect(() => {
        const loadData = async () => {
            // Cargar registros del vehículo si no están cargados
            await loadRecordsByVehicle(vehicleId);

            // Cargar tipos si no están cargados
            if (types.length === 0) {
                await loadTypes();
            }

            // Obtener el registro específico
            const record = getRecordById(maintenanceId);
            if (record) {
                setMaintenance(record);

                // Buscar el tipo de mantenimiento asociado
                const type = types.find(t => t.id_tipo === record.id_tipo);
                if (type) {
                    setMaintenanceType(type);
                }
            }
        };

        loadData();
    }, [vehicleId, maintenanceId]);

    // Manejar edición
    const handleEdit = () => {
        router.push(`/vehicles/${vehicleId}/maintenance/edit/${maintenanceId}`);
    };

    // Manejar eliminación
    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    // Confirmar eliminación
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteRecord(maintenanceId);
            Alert.alert(
                "Registro eliminado",
                "El registro de mantenimiento ha sido eliminado exitosamente",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error al eliminar mantenimiento:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    // Funciones de formateo
    const formatDate = (dateString?: string | Date): string => {
        if (!dateString) return 'N/A';

        try {
            const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return String(dateString);
        }
    };

    const formatCost = (cost?: number): string => {
        if (cost === undefined || cost === null) return 'No registrado';
        return `$${cost.toFixed(2)}`;
    };

    if (!vehicle) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <StaticHeader title="Detalle de Mantenimiento" theme={theme} />
                <View style={styles.contentCenter}>
                    <Text style={{ color: theme.text }}>Vehículo no encontrado</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StaticHeader title="Detalle de Mantenimiento" theme={theme} />

            {/* Indicador de carga o error */}
            <LoadingErrorIndicator
                isLoading={isLoading && !maintenance}
                error={error}
                loadingMessage="Cargando detalles del mantenimiento..."
                theme={theme}
            />

            {maintenance ? (
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Encabezado */}
                    <Card>
                        <View style={styles.header}>
                            <View>
                                <Text style={[styles.maintenanceType, { color: theme.text }]}>
                                    {maintenanceType?.nombre || 'Mantenimiento'}
                                </Text>
                                <Text style={[styles.vehicleInfo, { color: theme.secondaryText }]}>
                                    {vehicle.marca?.nombre} {vehicle.modelo?.nombre} ({vehicle.anio})
                                </Text>
                            </View>

                            <Badge
                                label="Completado"
                                variant="success"
                                size="small"
                                icon="check"
                            />
                        </View>

                        <View style={[
                            styles.costContainer,
                            { backgroundColor: isDark ? `${theme.primary}15` : '#f0f9ff' }
                        ]}>
                            <Text style={[styles.costLabel, { color: theme.text }]}>Costo:</Text>
                            <Text style={[styles.costValue, { color: theme.primary }]}>
                                {formatCost(maintenance.costo)}
                            </Text>
                        </View>
                    </Card>

                    {/* Detalles */}
                    <Card>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Detalles</Text>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Feather name="calendar" size={16} color={theme.secondaryText} />
                                <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>Fecha</Text>
                                <Text style={[styles.detailValue, { color: theme.text }]}>
                                    {formatDate(maintenance.fecha)}
                                </Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Feather name="map-pin" size={16} color={theme.secondaryText} />
                                <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>Kilometraje</Text>
                                <Text style={[styles.detailValue, { color: theme.text }]}>
                                    {maintenance.kilometraje.toLocaleString()} km
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                                <Feather name="clock" size={16} color={theme.secondaryText} />
                                <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>Registrado</Text>
                                <Text style={[styles.detailValue, { color: theme.text }]}>
                                    {formatDate(maintenance.fecha_creacion)}
                                </Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Feather name="refresh-cw" size={16} color={theme.secondaryText} />
                                <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>Actualizado</Text>
                                <Text style={[styles.detailValue, { color: theme.text }]}>
                                    {formatDate(maintenance.fecha_actualizacion)}
                                </Text>
                            </View>
                        </View>
                    </Card>

                    {/* Notas */}
                    {maintenance.notas && (
                        <Card>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Notas</Text>
                            <Text style={[styles.notes, { color: theme.text }]}>
                                {maintenance.notas}
                            </Text>
                        </Card>
                    )}

                    {/* Archivos Adjuntos */}
                    {maintenance.archivos_adjuntos && maintenance.archivos_adjuntos.length > 0 && (
                        <Card>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Archivos Adjuntos</Text>
                            {maintenance.archivos_adjuntos.map((archivo, index) => (
                                <TouchableOpacity
                                    key={archivo.id_archivo}
                                    style={[styles.attachmentItem, { borderBottomColor: theme.border }]}
                                >
                                    <Feather name="file" size={20} color={theme.primary} />
                                    <Text style={[styles.attachmentName, { color: theme.text }]}>
                                        {archivo.nombre_archivo}
                                    </Text>
                                    <Text style={[styles.attachmentSize, { color: theme.secondaryText }]}>
                                        {(archivo.tamano_archivo / 1024).toFixed(0)} KB
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </Card>
                    )}

                    {/* Acciones */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.editButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                            onPress={handleEdit}
                        >
                            <Feather name="edit-2" size={16} color={theme.primary} />
                            <Text style={[styles.editButtonText, { color: theme.primary }]}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.deleteButton, { backgroundColor: theme.card, borderColor: theme.danger }]}
                            onPress={handleDelete}
                        >
                            <Feather name="trash-2" size={16} color={theme.danger} />
                            <Text style={[styles.deleteButtonText, { color: theme.danger }]}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            ) : !isLoading && (
                <View style={styles.contentCenter}>
                    <Text style={{ color: theme.text }}>
                        Registro de mantenimiento no encontrado
                    </Text>
                </View>
            )}

            {/* Modal de confirmación para eliminar */}
            {showDeleteConfirm && (
                <View style={[
                    styles.modalOverlay,
                    { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
                ]}>
                    <View style={[
                        styles.modal,
                        { backgroundColor: theme.card }
                    ]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            Eliminar registro
                        </Text>
                        <Text style={[styles.modalMessage, { color: theme.secondaryText }]}>
                            ¿Estás seguro de que deseas eliminar este registro de mantenimiento? Esta acción no se puede deshacer.
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[
                                    styles.cancelButton,
                                    { backgroundColor: isDark ? '#333' : '#f5f5f5' }
                                ]}
                                onPress={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                            >
                                <Text style={[styles.cancelButtonText, { color: theme.secondaryText }]}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.confirmButton,
                                    { backgroundColor: theme.danger },
                                    isDeleting && { opacity: 0.7 }
                                ]}
                                onPress={confirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.confirmButtonText}>Eliminar</Text>
                                )}
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
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    contentCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    maintenanceType: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    vehicleInfo: {
        marginBottom: 4,
    },
    costContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        padding: 12,
    },
    costLabel: {
        fontWeight: 'bold',
    },
    costValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailItem: {
        flex: 1,
        alignItems: 'flex-start',
    },
    detailLabel: {
        marginTop: 4,
        marginBottom: 4,
    },
    detailValue: {
        fontWeight: 'bold',
    },
    notes: {
        lineHeight: 20,
    },
    attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    attachmentName: {
        flex: 1,
        marginLeft: 10,
        fontWeight: '500',
    },
    attachmentSize: {
        marginLeft: 8,
        fontSize: 12,
    },
    actionsContainer: {
        marginBottom: 24,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    editButtonText: {
        fontWeight: 'bold',
        marginLeft: 8,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
    },
    deleteButtonText: {
        fontWeight: 'bold',
        marginLeft: 8,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modal: {
        width: '100%',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalMessage: {
        marginBottom: 20,
        lineHeight: 20,
    },
    modalActions: {
        flexDirection: 'row',
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        fontWeight: '500',
    },
    confirmButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 8,
        justifyContent: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});