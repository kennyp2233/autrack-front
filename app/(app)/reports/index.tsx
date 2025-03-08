import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Datos de ejemplo para vehículos
const vehicles = [
    { id: 1, name: 'Toyota Corolla (2019)' },
    { id: 2, name: 'Honda Civic (2020)' }
];

// Datos de ejemplo para tipos de mantenimiento
const maintenanceTypes = [
    { id: 'oil', name: 'Cambio de Aceite' },
    { id: 'brakes', name: 'Revisión de Frenos' },
    { id: 'tires', name: 'Neumáticos' },
    { id: 'alignment', name: 'Alineación y Balanceo' },
    { id: 'filter', name: 'Filtros' },
    { id: 'general', name: 'Revisión General' },
    { id: 'other', name: 'Otros' }
];

// Datos de ejemplo para el historial de mantenimiento
const maintenanceHistory = [
    { id: 1, vehicleId: 1, type: 'Cambio de Aceite', date: '2025-01-15', mileage: 32500, cost: 180 },
    { id: 2, vehicleId: 1, type: 'Revisión de Frenos', date: '2024-12-12', mileage: 30000, cost: 250 },
    { id: 3, vehicleId: 1, type: 'Alineación y Balanceo', date: '2024-11-05', mileage: 28000, cost: 120 },
    { id: 4, vehicleId: 1, type: 'Filtros', date: '2024-09-22', mileage: 25000, cost: 85 },
    { id: 5, vehicleId: 2, type: 'Cambio de Aceite', date: '2025-02-03', mileage: 15000, cost: 150 },
    { id: 6, vehicleId: 2, type: 'Revisión General', date: '2024-12-20', mileage: 12000, cost: 320 },
    { id: 7, vehicleId: 2, type: 'Neumáticos', date: '2024-10-18', mileage: 10000, cost: 450 },
    { id: 8, vehicleId: 1, type: 'Cambio de Aceite', date: '2024-08-15', mileage: 20000, cost: 175 },
    { id: 9, vehicleId: 2, type: 'Cambio de Aceite', date: '2024-11-10', mileage: 8000, cost: 145 }
];

export default function ReportsScreen() {
    const router = useRouter();

    // Estados para filtros
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState('all');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [maintenanceType, setMaintenanceType] = useState('all');
    const [mileageRange, setMileageRange] = useState({ min: '', max: '' });

    // Estado para tipo de gráfico
    const [chartType, setChartType] = useState('monthly'); // 'monthly', 'category'

    // Estado para formato de exportación
    const [exportModalVisible, setExportModalVisible] = useState(false);

    // Estado para mantenimientos filtrados
    const [filteredMaintenance, setFilteredMaintenance] = useState(maintenanceHistory);

    // Estado para estadísticas
    const [stats, setStats] = useState({
        totalCost: 0,
        averageCost: 0,
        maintenanceCount: 0,
        mostCommonService: '',
        highestCost: 0,
        highestCostService: ''
    });

    // Aplicar filtros
    useEffect(() => {
        let filtered = [...maintenanceHistory];

        // Filtrar por vehículo
        if (selectedVehicle !== 'all') {
            filtered = filtered.filter(item =>
                item.vehicleId === parseInt(selectedVehicle)
            );
        }

        // Filtrar por rango de fechas
        if (dateRange.from) {
            filtered = filtered.filter(item =>
                new Date(item.date) >= new Date(dateRange.from)
            );
        }

        if (dateRange.to) {
            filtered = filtered.filter(item =>
                new Date(item.date) <= new Date(dateRange.to)
            );
        }

        // Filtrar por tipo de mantenimiento
        if (maintenanceType !== 'all') {
            const selectedTypeName = maintenanceTypes.find(t => t.id === maintenanceType)?.name;
            filtered = filtered.filter(item =>
                item.type === selectedTypeName
            );
        }

        // Filtrar por rango de kilometraje
        if (mileageRange.min) {
            filtered = filtered.filter(item =>
                item.mileage >= parseInt(mileageRange.min)
            );
        }

        if (mileageRange.max) {
            filtered = filtered.filter(item =>
                item.mileage <= parseInt(mileageRange.max)
            );
        }

        // Ordenar por fecha más reciente
        filtered = filtered.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setFilteredMaintenance(filtered);

        // Calcular estadísticas
        if (filtered.length > 0) {
            const totalCost = filtered.reduce((sum, item) => sum + item.cost, 0);
            const averageCost = totalCost / filtered.length;

            // Servicio más común
            const serviceCount: Record<string, number> = {};
            filtered.forEach(item => {
                serviceCount[item.type] = (serviceCount[item.type] || 0) + 1;
            });

            let mostCommonService = '';
            let maxCount = 0;
            Object.entries(serviceCount).forEach(([service, count]) => {
                if (count > maxCount) {
                    mostCommonService = service;
                    maxCount = count as number;
                }
            });

            // Servicio de mayor costo
            let highestCost = 0;
            let highestCostService = '';

            const serviceTotalCost: Record<string, number> = {};
            filtered.forEach(item => {
                serviceTotalCost[item.type] = (serviceTotalCost[item.type] || 0) + item.cost;
            });

            Object.entries(serviceTotalCost).forEach(([service, cost]) => {
                if (cost > highestCost) {
                    highestCost = cost;
                    highestCostService = service;
                }
            });

            setStats({
                totalCost,
                averageCost,
                maintenanceCount: filtered.length,
                mostCommonService,
                highestCost,
                highestCostService
            });
        } else {
            // No hay datos después de aplicar filtros
            setStats({
                totalCost: 0,
                averageCost: 0,
                maintenanceCount: 0,
                mostCommonService: 'N/A',
                highestCost: 0,
                highestCostService: 'N/A'
            });
        }
    }, [selectedVehicle, dateRange.from, dateRange.to, maintenanceType, mileageRange.min, mileageRange.max]);

    // Manejar exportación
    const handleExport = (format: string) => {
        // Aquí iría la lógica para exportar datos en diferentes formatos
        alert(`Exportando datos en formato ${format}`);
        setExportModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Reportes y Estadísticas</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Filters Section */}
                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.filterHeader}
                        onPress={() => setFiltersVisible(!filtersVisible)}
                    >
                        <View style={styles.filterTitle}>
                            <Feather name="filter" size={20} color="#3B82F6" style={styles.filterIcon} />
                            <Text style={styles.filterTitleText}>Filtros</Text>
                        </View>
                        <Feather
                            name={filtersVisible ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>

                    {filtersVisible && (
                        <View style={styles.filtersContent}>
                            {/* Vehículo */}
                            <View style={styles.filterGroup}>
                                <Text style={styles.filterLabel}>Vehículo</Text>
                                <View style={styles.pickerContainer}>
                                    <Feather name="truck" size={16} color="#999" style={styles.pickerIcon} />
                                    <View style={styles.picker}>
                                        <TouchableOpacity
                                            style={[styles.pickerOption, selectedVehicle === 'all' && styles.pickerOptionSelected]}
                                            onPress={() => setSelectedVehicle('all')}
                                        >
                                            <Text>Todos los vehículos</Text>
                                        </TouchableOpacity>
                                        {vehicles.map(vehicle => (
                                            <TouchableOpacity
                                                key={vehicle.id}
                                                style={[styles.pickerOption, selectedVehicle === vehicle.id.toString() && styles.pickerOptionSelected]}
                                                onPress={() => setSelectedVehicle(vehicle.id.toString())}
                                            >
                                                <Text>{vehicle.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            {/* Tipo de Mantenimiento */}
                            <View style={styles.filterGroup}>
                                <Text style={styles.filterLabel}>Tipo de Mantenimiento</Text>
                                <View style={styles.pickerContainer}>
                                    <Feather name="tool" size={16} color="#999" style={styles.pickerIcon} />
                                    <View style={styles.picker}>
                                        <TouchableOpacity
                                            style={[styles.pickerOption, maintenanceType === 'all' && styles.pickerOptionSelected]}
                                            onPress={() => setMaintenanceType('all')}
                                        >
                                            <Text>Todos los tipos</Text>
                                        </TouchableOpacity>
                                        {maintenanceTypes.map(type => (
                                            <TouchableOpacity
                                                key={type.id}
                                                style={[styles.pickerOption, maintenanceType === type.id && styles.pickerOptionSelected]}
                                                onPress={() => setMaintenanceType(type.id)}
                                            >
                                                <Text>{type.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            {/* Rango de Fechas */}
                            <View style={styles.filterGroup}>
                                <Text style={styles.filterLabel}>Desde</Text>
                                <View style={styles.inputWithIcon}>
                                    <Feather name="calendar" size={16} color="#999" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="AAAA-MM-DD"
                                        value={dateRange.from}
                                        onChangeText={(text) => setDateRange({ ...dateRange, from: text })}
                                    />
                                </View>
                            </View>

                            <View style={styles.filterGroup}>
                                <Text style={styles.filterLabel}>Hasta</Text>
                                <View style={styles.inputWithIcon}>
                                    <Feather name="calendar" size={16} color="#999" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="AAAA-MM-DD"
                                        value={dateRange.to}
                                        onChangeText={(text) => setDateRange({ ...dateRange, to: text })}
                                    />
                                </View>
                            </View>

                            {/* Rango de Kilometraje */}
                            <View style={styles.filterGroup}>
                                <Text style={styles.filterLabel}>Kilometraje Mínimo</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. 10000"
                                    value={mileageRange.min}
                                    onChangeText={(text) => setMileageRange({ ...mileageRange, min: text })}
                                    keyboardType="number-pad"
                                />
                            </View>

                            <View style={styles.filterGroup}>
                                <Text style={styles.filterLabel}>Kilometraje Máximo</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. 50000"
                                    value={mileageRange.max}
                                    onChangeText={(text) => setMileageRange({ ...mileageRange, max: text })}
                                    keyboardType="number-pad"
                                />
                            </View>

                            <View style={styles.filterActions}>
                                <TouchableOpacity
                                    style={styles.clearButton}
                                    onPress={() => {
                                        setSelectedVehicle('all');
                                        setDateRange({ from: '', to: '' });
                                        setMaintenanceType('all');
                                        setMileageRange({ min: '', max: '' });
                                    }}
                                >
                                    <Text style={styles.clearButtonText}>Limpiar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={() => setFiltersVisible(false)}
                                >
                                    <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                {/* Statistics Summary */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Resumen</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Gasto Total</Text>
                            <Text style={styles.statValue}>${stats.totalCost.toFixed(2)}</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Promedio por Servicio</Text>
                            <Text style={styles.statValue}>${stats.averageCost.toFixed(2)}</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Servicio más Común</Text>
                            <Text style={styles.statValue}>{stats.mostCommonService}</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Mayor Gasto</Text>
                            <Text style={styles.statValue}>{stats.highestCostService}</Text>
                            <Text style={styles.statSubvalue}>${stats.highestCost.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Charts Section */}
                <View style={styles.card}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.sectionTitle}>Gráficos</Text>

                        <View style={styles.chartToggle}>
                            <TouchableOpacity
                                style={[styles.chartToggleButton, chartType === 'monthly' && styles.chartToggleActive]}
                                onPress={() => setChartType('monthly')}
                            >
                                <Text style={chartType === 'monthly' ? styles.chartToggleActiveText : styles.chartToggleText}>
                                    Mensual
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.chartToggleButton, chartType === 'category' && styles.chartToggleActive]}
                                onPress={() => setChartType('category')}
                            >
                                <Text style={chartType === 'category' ? styles.chartToggleActiveText : styles.chartToggleText}>
                                    Categoría
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        <Text style={styles.chartPlaceholder}>
                            Aquí se mostraría el gráfico {chartType === 'monthly' ? 'mensual' : 'por categoría'}
                        </Text>
                    </View>
                </View>

                {/* Maintenance List */}
                <View style={styles.card}>
                    <View style={styles.maintenanceHeader}>
                        <Text style={styles.sectionTitle}>
                            Mantenimientos ({filteredMaintenance.length})
                        </Text>

                        <TouchableOpacity
                            style={styles.exportButton}
                            onPress={() => setExportModalVisible(true)}
                        >
                            <Feather name="download" size={16} color="#3B82F6" />
                            <Text style={styles.exportButtonText}>Exportar</Text>
                        </TouchableOpacity>
                    </View>

                    {filteredMaintenance.length > 0 ? (
                        filteredMaintenance.map(item => {
                            const vehicleName = vehicles.find(v => v.id === item.vehicleId)?.name || '';

                            return (
                                <View key={item.id} style={styles.maintenanceItem}>
                                    <View style={styles.maintenanceItemHeader}>
                                        <Text style={styles.maintenanceType}>{item.type}</Text>
                                        <Text style={styles.maintenanceCost}>${item.cost}</Text>
                                    </View>

                                    <View style={styles.maintenanceItemDetails}>
                                        <View style={styles.maintenanceDetail}>
                                            <Feather name="calendar" size={14} color="#666" />
                                            <Text style={styles.maintenanceDetailText}>
                                                {new Date(item.date).toLocaleDateString('es-ES')}
                                            </Text>
                                        </View>
                                        <View style={styles.maintenanceDetail}>
                                            <Feather name="truck" size={14} color="#666" />
                                            <Text style={styles.maintenanceDetailText}>{vehicleName}</Text>
                                        </View>
                                        <View style={styles.maintenanceDetail}>
                                            <Feather name="clock" size={14} color="#666" />
                                            <Text style={styles.maintenanceDetailText}>{item.mileage} km</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <Text style={styles.emptyText}>
                            No se encontraron registros de mantenimiento con los filtros aplicados
                        </Text>
                    )}
                </View>
            </ScrollView>

            {/* Export Modal */}
            {exportModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Exportar datos</Text>

                        <TouchableOpacity
                            style={styles.exportOption}
                            onPress={() => handleExport('pdf')}
                        >
                            <Feather name="file-text" size={20} color="#EF4444" />
                            <Text style={styles.exportOptionText}>Exportar como PDF</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.exportOption}
                            onPress={() => handleExport('excel')}
                        >
                            <Feather name="file" size={20} color="#10B981" />
                            <Text style={styles.exportOptionText}>Exportar como Excel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.exportOption}
                            onPress={() => handleExport('csv')}
                        >
                            <Feather name="file" size={20} color="#3B82F6" />
                            <Text style={styles.exportOptionText}>Exportar como CSV</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelExportButton}
                            onPress={() => setExportModalVisible(false)}
                        >
                            <Text style={styles.cancelExportButtonText}>Cancelar</Text>
                        </TouchableOpacity>
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
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterIcon: {
        marginRight: 8,
    },
    filterTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    filtersContent: {
        marginTop: 16,
    },
    filterGroup: {
        marginBottom: 12,
    },
    filterLabel: {
        marginBottom: 4,
        fontWeight: '500',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerIcon: {
        marginRight: 8,
    },
    picker: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    pickerOption: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    pickerOptionSelected: {
        backgroundColor: '#e5edff',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    clearButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginRight: 8,
    },
    clearButtonText: {
        color: '#666',
    },
    applyButton: {
        padding: 8,
        backgroundColor: '#3B82F6',
        borderRadius: 4,
    },
    applyButtonText: {
        color: 'white',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: -4,
    },
    statBox: {
        width: '50%',
        padding: 4,
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statSubvalue: {
        color: '#666',
        fontSize: 12,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    chartToggle: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        overflow: 'hidden',
    },
    chartToggleButton: {
        padding: 4,
        paddingHorizontal: 8,
    },
    chartToggleActive: {
        backgroundColor: '#3B82F6',
    },
    chartToggleText: {
        color: '#666',
        fontSize: 12,
    },
    chartToggleActiveText: {
        color: 'white',
        fontSize: 12,
    },
    chartContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    chartPlaceholder: {
        color: '#999',
    },
    maintenanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    exportButtonText: {
        color: '#3B82F6',
        marginLeft: 4,
    },
    maintenanceItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    maintenanceItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    maintenanceType: {
        fontWeight: 'bold',
    },
    maintenanceCost: {
        fontWeight: 'bold',
    },
    maintenanceItemDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    maintenanceDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 4,
    },
    maintenanceDetailText: {
        color: '#666',
        fontSize: 12,
        marginLeft: 4,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        padding: 24,
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
        padding: 16,
        width: '100%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    exportOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 8,
    },
    exportOptionText: {
        marginLeft: 12,
        fontWeight: '500',
    },
    cancelExportButton: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    cancelExportButtonText: {
        color: '#666',
    },
});