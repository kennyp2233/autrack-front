import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Datos de ejemplo
const initialVehicles = [
    { id: 1, brand: 'Toyota', model: 'Corolla', year: 2019, plate: 'ABC-123', mileage: 35000, lastMaintenance: '15/01/2025' },
    { id: 2, brand: 'Honda', model: 'Civic', year: 2020, plate: 'XYZ-789', mileage: 28000, lastMaintenance: '02/02/2025' },
    { id: 3, brand: 'Volkswagen', model: 'Golf', year: 2018, plate: 'DEF-456', mileage: 42000, lastMaintenance: '10/12/2024' },
    { id: 4, brand: 'Ford', model: 'Focus', year: 2021, plate: 'GHI-789', mileage: 15000, lastMaintenance: '05/02/2025' },
];

export default function VehiclesListScreen() {
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    // Filtrar vehículos según búsqueda
    const filteredVehicles = vehicles.filter(vehicle =>
        `${vehicle.brand} ${vehicle.model} ${vehicle.plate}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Mis Vehículos</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar vehículo..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => setSearchQuery('')}
                    >
                        <Feather name="x" size={18} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Vehicles List */}
            <FlatList
                data={filteredVehicles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.vehicleItem}
                        onPress={() => router.push(`/vehicles/${item.id}`)}
                    >
                        <View style={styles.vehicleIconContainer}>
                            <Feather name="truck" size={24} color="#3B82F6" />
                        </View>
                        <View style={styles.vehicleInfo}>
                            <Text style={styles.vehicleName}>{item.brand} {item.model}</Text>
                            <Text style={styles.vehicleDetails}>{item.year} • {item.plate}</Text>
                        </View>
                        <View style={styles.vehicleStats}>
                            <Text style={styles.vehicleMileage}>{item.mileage} km</Text>
                            <Text style={styles.vehicleLastMaintenance}>Últ: {item.lastMaintenance}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No se encontraron vehículos</Text>
                    </View>
                }
            />

            {/* Add Vehicle Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/vehicles/add')}
            >
                <Feather name="plus" size={24} color="#fff" />
            </TouchableOpacity>
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    clearButton: {
        padding: 4,
    },
    listContent: {
        padding: 16,
    },
    vehicleItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    vehicleIconContainer: {
        backgroundColor: '#EBF5FF',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    vehicleDetails: {
        color: '#666',
        marginTop: 4,
    },
    vehicleStats: {
        alignItems: 'flex-end',
    },
    vehicleMileage: {
        fontWeight: '500',
    },
    vehicleLastMaintenance: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyText: {
        color: '#666',
    },
    addButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#3B82F6',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
});