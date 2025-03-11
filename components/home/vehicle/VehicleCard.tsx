import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Vehicle } from '@/types/Vehicle';

interface VehicleCardProps {
    vehicle: Vehicle;
    onPress: (id: number) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(vehicle.id)}
            activeOpacity={0.9}
        >
            <View>
                <Text style={styles.name}>
                    {vehicle.brand} {vehicle.model}
                </Text>
                <Text style={styles.year}>{vehicle.year}</Text>
            </View>

            {/* Car Image - using an icon for now */}
            <View style={styles.imageContainer}>
                <Feather name="truck" size={60} color="#000" style={styles.image} />
            </View>

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>Kilometraje</Text>
                    <Text style={styles.statValue}>{vehicle.mileage}km</Text>
                </View>

                <View style={styles.stat}>
                    <Text style={styles.statLabel}>Último servicio</Text>
                    <Text style={styles.statValue}>{vehicle.lastMaintenance || 'No registrado'}</Text>
                </View>
            </View>

            <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Estado general</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '85%' }]} />
                </View>
                <Text style={styles.statusPercent}>85%</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    year: {
        fontSize: 14,
        color: '#666',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
        marginVertical: 16,
    },
    image: {
        opacity: 0.7,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    stat: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    statusContainer: {
        marginTop: 4,
    },
    statusLabel: {
        fontSize: 12,
        color: '#666',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginVertical: 4,
    },
    progressFill: {
        height: 4,
        backgroundColor: '#4CAF50',
        borderRadius: 2,
    },
    statusPercent: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
});

export default VehicleCard;