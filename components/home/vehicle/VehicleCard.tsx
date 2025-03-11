import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Vehicle } from '@/types/Vehicle';

interface VehicleCardProps {
    vehicle: Vehicle;
    onPress: (id: number) => void;
    theme?: any; // Tipo del tema
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress, theme }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(vehicle.id)}
            activeOpacity={0.9}
        >
            <View>
                <Text style={[styles.name, { color: theme?.text || '#333' }]}>
                    {vehicle.brand} {vehicle.model}
                </Text>
                <Text style={[styles.year, { color: theme?.secondaryText || '#666' }]}>
                    {vehicle.year}
                </Text>
            </View>

            {/* Car Image - using an icon for now */}
            <View style={styles.imageContainer}>
                <Feather
                    name="truck"
                    size={60}
                    color={theme?.text || "#000"}
                    style={[styles.image, { opacity: theme?.isDark ? 0.6 : 0.7 }]}
                />
            </View>

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme?.secondaryText || '#666' }]}>
                        Kilometraje
                    </Text>
                    <Text style={[styles.statValue, { color: theme?.text || '#333' }]}>
                        {vehicle.mileage}km
                    </Text>
                </View>

                <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme?.secondaryText || '#666' }]}>
                        Último servicio
                    </Text>
                    <Text style={[styles.statValue, { color: theme?.text || '#333' }]}>
                        {vehicle.lastMaintenance || 'No registrado'}
                    </Text>
                </View>
            </View>

            <View style={styles.statusContainer}>
                <Text style={[styles.statusLabel, { color: theme?.secondaryText || '#666' }]}>
                    Estado general
                </Text>
                <View style={[styles.progressBar, { backgroundColor: theme?.progressBarBackground || '#E5E7EB' }]}>
                    <View style={[
                        styles.progressFill,
                        {
                            width: '85%',
                            backgroundColor: theme?.success || '#4CAF50'
                        }
                    ]} />
                </View>
                <Text style={[styles.statusPercent, { color: theme?.secondaryText || '#666' }]}>
                    85%
                </Text>
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
    },
    year: {
        fontSize: 14,
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
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusContainer: {
        marginTop: 4,
    },
    statusLabel: {
        fontSize: 12,
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        marginVertical: 4,
    },
    progressFill: {
        height: 4,
        borderRadius: 2,
    },
    statusPercent: {
        fontSize: 12,
        textAlign: 'right',
    },
});

export default VehicleCard;