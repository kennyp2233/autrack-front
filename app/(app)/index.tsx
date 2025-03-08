import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

// Datos de ejemplo
const vehicles = [
    { id: 1, brand: 'Toyota', model: 'Corolla', year: 2019, plate: 'ABC-123', mileage: 35000, lastMaintenance: '15/01/2025' },
    { id: 2, brand: 'Honda', model: 'Civic', year: 2020, plate: 'XYZ-789', mileage: 28000, lastMaintenance: '02/02/2025' }
];

const upcomingMaintenance = [
    { id: 1, vehicleId: 1, type: 'Cambio de Aceite', date: '01/03/2025', daysLeft: 3 },
    { id: 2, vehicleId: 2, type: 'Revisión de Frenos', date: '15/03/2025', daysLeft: 15 },
    { id: 3, vehicleId: 1, type: 'Rotación de Neumáticos', date: '20/03/2025', daysLeft: 20 }
];

export default function DashboardScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    // Función para obtener el nombre del vehículo por ID
    const getVehicleName = (id: number) => {
        const vehicle = vehicles.find(v => v.id === id);
        return vehicle ? `${vehicle.brand} ${vehicle.model}` : '';
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Mi Garaje</Text>
                <TouchableOpacity onPress={logout}>
                    <Feather name="bell" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Upcoming Maintenance Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Próximos Mantenimientos</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>Ver todos</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={upcomingMaintenance}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.maintenanceItem}
                            onPress={() => router.push(`/vehicles/${item.vehicleId}`)}
                        >
                            <View>
                                <Text style={styles.maintenanceType}>{item.type}</Text>
                                <Text style={styles.maintenanceVehicle}>{getVehicleName(item.vehicleId)}</Text>
                            </View>
                            <View>
                                <Text style={styles.maintenanceDate}>{item.date}</Text>
                                <Text style={styles.maintenanceDays}>En {item.daysLeft} días</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={styles.list}
                />
            </View>

            {/* Vehicles Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Mis Vehículos</Text>
                    <TouchableOpacity onPress={() => router.push('/vehicles')}>
                        <Text style={styles.seeAllText}>Ver todos</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.vehicleItem}
                            onPress={() => router.push(`/vehicles/${item.id}`)}
                        >
                            <View>
                                <Text style={styles.vehicleName}>{item.brand} {item.model}</Text>
                                <Text style={styles.vehicleDetails}>{item.year} • {item.plate}</Text>
                            </View>
                            <View>
                                <Text style={styles.vehicleMileage}>{item.mileage} km</Text>
                                <Text style={styles.vehicleLastMaintenance}>Últ. mant: {item.lastMaintenance}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={styles.list}
                />

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/vehicles/add')}
                >
                    <Feather name="plus" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Agregar Vehículo</Text>
                </TouchableOpacity>
            </View>

            {/* Maintenance Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>5</Text>
                    <Text style={styles.statLabel}>Mantenimientos Totales</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>$350</Text>
                    <Text style={styles.statLabel}>Promedio de Gastos</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    seeAllText: {
        color: '#3B82F6',
    },
    list: {
        marginBottom: 10,
    },
    maintenanceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    maintenanceType: {
        fontWeight: 'bold',
    },
    maintenanceVehicle: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
    },
    maintenanceDate: {
        textAlign: 'right',
    },
    maintenanceDays: {
        color: '#666',
        fontSize: 12,
        textAlign: 'right',
        marginTop: 4,
    },
    vehicleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    vehicleName: {
        fontWeight: 'bold',
    },
    vehicleDetails: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
    },
    vehicleMileage: {
        textAlign: 'right',
    },
    vehicleLastMaintenance: {
        color: '#666',
        fontSize: 12,
        textAlign: 'right',
        marginTop: 4,
    },
    addButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 10,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
    },
});