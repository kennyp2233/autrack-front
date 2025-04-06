// app/(app)/vehicles/[id]/maintenance/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { useVehicles } from '@/contexts/VehiclesContext';
import { MaintenanceRecord, MaintenanceFilters } from '@/types/Maintenance';

// Componentes
import StaticHeader from '@/components/common/StaticHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import LoadingErrorIndicator from '@/components/common/LoadingErrorIndicator';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

export default function MaintenanceListScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const vehicleId = Number(params.id);

    const { theme, isDark } = useTheme();
    const { getVehicle } = useVehicles();
    const {
        loadRecordsByVehicle,
        isLoading,
        error
    } = useMaintenance();

    // Estados
    const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>([]);
    const [searchText, setSearchText] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<MaintenanceFilters>({
        tipo: 'all',
        fechaDesde: '',
        fechaHasta: ''
    });

    // Obtener el vehículo
    const vehicle = getVehicle(vehicleId);

    // Cargar datos
    useEffect(() => {
        const loadData = async () => {
            const records = await loadRecordsByVehicle(vehicleId);
            setMaintenanceRecords(records);
            setFilteredRecords(records);
        };

        loadData();
    }, [vehicleId]);

    // Aplicar filtros y búsqueda
    useEffect(() => {
        if (!maintenanceRecords.length) return;

        let result = [...maintenanceRecords];

        // Aplicar búsqueda
        if (searchText) {
            const searchLower = searchText.toLowerCase();
            result = result.filter(record => {
                // Buscar en tipo, fecha, kilometraje, costo, notas
                return (
                    String(record.id_tipo).includes(searchLower) ||
                    (record.fecha && String(record.fecha).toLowerCase().includes(searchLower)) ||
                    String(record.kilometraje).includes(searchLower) ||
                    (record.costo && String(record.costo).includes(searchLower)) ||
                    (record.notas && record.notas.toLowerCase().includes(searchLower))
                );
            });
        }

        // Aplicar filtros
        if (filters.tipo !== 'all') {
            // Convertir a número para comparar con id_tipo
            const tipoId = Number(filters.tipo);
            if (!isNaN(tipoId)) {
                result = result.filter(record => record.id_tipo === tipoId);
            }
        }

        if (filters.fechaDesde) {
            const fechaDesde = new Date(convertDateStringToISO(filters.fechaDesde));
            result = result.filter(record => {
                const recordDate = new Date(record.fecha);
                return recordDate >= fechaDesde;
            });
        }

        if (filters.fechaHasta) {
            const fechaHasta = new Date(convertDateStringToISO(filters.fechaHasta));
            result = result.filter(record => {
                const recordDate = new Date(record.fecha);
                return recordDate <= fechaHasta;
            });
        }

        // Ordenar por fecha (más reciente primero)
        result.sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);
            return dateB.getTime() - dateA.getTime();
        });

        setFilteredRecords(result);
    }, [maintenanceRecords, searchText, filters]);

    // Funciones auxiliares
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

    const convertDateStringToISO = (dateString: string): string => {
        // Convertir de DD/MM/YYYY a YYYY-MM-DD
        const parts = dateString.split('/');
        if (parts.length !== 3) return dateString;

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    const getMaintenanceTypeName = (typeId: number): string => {
        // Esta función debería buscar el nombre del tipo en el contexto
        // Por simplicidad, retornamos un texto genérico
        return `Mantenimiento ${typeId}`;
    };

    // Funciones para manejar navegación y acciones
    const handleMaintenancePress = (record: MaintenanceRecord) => {
        router.push(`/vehicles/${vehicleId}/maintenance/${record.id_registro}`);
    };

    const handleAddMaintenance = () => {
        router.push(`/vehicles/${vehicleId}/maintenance/add`);
    };

    const handleToggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            tipo: 'all',
            fechaDesde: '',
            fechaHasta: ''
        });
    };

    // Renderizar item de mantenimiento
    const renderMaintenanceItem = ({ item }: { item: MaintenanceRecord }) => (
        <TouchableOpacity
            style={[styles.maintenanceItem, { backgroundColor: theme.card }]}
            onPress={() => handleMaintenancePress(item)}
        >
            <View style={styles.maintenanceHeader}>
                <Text style={[styles.maintenanceType, { color: theme.text }]}>
                    {getMaintenanceTypeName(item.id_tipo)}
                </Text>
                <Badge
                    label="Completado"
                    variant="success"
                    size="small"
                />
            </View>

            <View style={styles.maintenanceDetails}>
                <View style={styles.maintenanceDetailItem}>
                    <Feather name="calendar" size={14} color={theme.secondaryText} />
                    <Text style={[styles.maintenanceDetailText, { color: theme.secondaryText }]}>
                        {formatDate(item.fecha)}
                    </Text>
                </View>

                <View style={styles.maintenanceDetailItem}>
                    <Feather name="map-pin" size={14} color={theme.secondaryText} />
                    <Text style={[styles.maintenanceDetailText, { color: theme.secondaryText }]}>
                        {item.kilometraje.toLocaleString()} km
                    </Text>
                </View>
            </View>

            <View style={[styles.maintenanceFooter, { borderTopColor: theme.border }]}>
                <Text style={[styles.maintenanceCost, { color: theme.primary }]}>
                    {formatCost(item.costo)}
                </Text>
                <Feather name="chevron-right" size={18} color={theme.secondaryText} />
            </View>
        </TouchableOpacity>
    );

    if (!vehicle) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <StaticHeader title="Mantenimientos" theme={theme} />
                <View style={styles.contentCenter}>
                    <Text style={{ color: theme.text }}>
                        Vehículo no encontrado
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StaticHeader
                title="Historial de Mantenimiento"
                theme={theme}
                rightIcon="filter"
                onRightIconPress={handleToggleFilters}
            />

            {/* Barra de búsqueda */}
            <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
                <View style={[styles.searchBar, { backgroundColor: isDark ? '#333' : '#f5f5f5', borderColor: theme.border }]}>
                    <Feather name="search" size={18} color={theme.secondaryText} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Buscar mantenimiento..."
                        placeholderTextColor={theme.secondaryText}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Feather name="x" size={18} color={theme.secondaryText} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Panel de filtros (visible/oculto) */}
                {showFilters && (
                    <View style={[styles.filtersPanel, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.filterTitle, { color: theme.text }]}>Filtros</Text>

                        {/* Aquí irían los controles de filtro */}
                        <View style={styles.filterActions}>
                            <TouchableOpacity
                                style={[styles.clearFiltersBtn, { borderColor: theme.border }]}
                                onPress={handleClearFilters}
                            >
                                <Text style={{ color: theme.secondaryText }}>Limpiar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.applyFiltersBtn, { backgroundColor: theme.primary }]}
                                onPress={() => setShowFilters(false)}
                            >
                                <Text style={{ color: 'white' }}>Aplicar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* Indicador de carga o error */}
            <LoadingErrorIndicator
                isLoading={isLoading && !maintenanceRecords.length}
                error={error}
                loadingMessage="Cargando registros de mantenimiento..."
                theme={theme}
            />

            {/* Lista de mantenimientos */}
            {filteredRecords.length > 0 ? (
                <FlatList
                    data={filteredRecords}
                    renderItem={renderMaintenanceItem}
                    keyExtractor={(item) => item.id_registro.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.listHeader}>
                            <Text style={[styles.listHeaderText, { color: theme.text }]}>
                                {filteredRecords.length} registro{filteredRecords.length !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    }
                />
            ) : !isLoading && (
                <EmptyState
                    icon="clipboard"
                    title={searchText.length > 0 ? "No se encontraron resultados" : "No hay registros de mantenimiento"}
                    message={searchText.length > 0
                        ? `No hay registros que coincidan con "${searchText}"`
                        : "Agrega tu primer mantenimiento para este vehículo"
                    }
                    buttonText={searchText.length > 0 ? "Limpiar búsqueda" : "Agregar mantenimiento"}
                    onButtonPress={searchText.length > 0 ? () => setSearchText('') : handleAddMaintenance}
                />
            )}

            {/* Botón flotante para agregar */}
            <FloatingActionButton
                icon="plus"
                onPress={handleAddMaintenance}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        padding: 16,
        zIndex: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        height: '100%',
    },
    filtersPanel: {
        marginTop: 8,
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
    },
    filterTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    clearFiltersBtn: {
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    applyFiltersBtn: {
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80, // Espacio para el FAB
    },
    listHeader: {
        marginBottom: 8,
    },
    listHeaderText: {
        fontWeight: 'bold',
    },
    contentCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    maintenanceItem: {
        borderRadius: 10,
        marginBottom: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    maintenanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    maintenanceType: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    maintenanceDetails: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    maintenanceDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    maintenanceDetailText: {
        marginLeft: 6,
        fontSize: 13,
    },
    maintenanceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 0.5,
    },
    maintenanceCost: {
        fontWeight: 'bold',
    },
});