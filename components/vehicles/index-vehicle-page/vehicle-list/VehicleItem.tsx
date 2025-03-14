import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Vehicle } from '@/types/Vehicle';

interface VehicleItemProps {
    vehicle: Vehicle;
    onPress: () => void;
    theme: any;
}

const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle, onPress, theme }) => {
    // Colores basados en el tema
    const cardColor = theme.card;
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const borderColor = theme.border;

    return (
        <TouchableOpacity
            style={[styles.vehicleItem, { backgroundColor: cardColor, borderColor }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.vehicleIconContainer, { backgroundColor: `${primaryColor}15` }]}>
                <Feather name="truck" size={24} color={primaryColor} />
            </View>

            <View style={styles.vehicleInfo}>
                <Text style={[styles.vehicleName, { color: textColor }]}>
                    {vehicle.brand} {vehicle.model}
                </Text>
                <Text style={[styles.vehicleDetails, { color: secondaryTextColor }]}>
                    {vehicle.year} • {vehicle.plate || 'Sin placa'}
                </Text>
            </View>

            <View style={styles.vehicleStats}>
                <Text style={[styles.vehicleMileage, { color: primaryColor }]}>
                    {vehicle.mileage} km
                </Text>
                <Text style={[styles.vehicleLastMaintenance, { color: secondaryTextColor }]}>
                    Últ: {vehicle.lastMaintenance || 'N/A'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    vehicleItem: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 0.5,
        // Añadir sombra sutil
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    vehicleIconContainer: {
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
        marginBottom: 4,
    },
    vehicleDetails: {
        fontSize: 14,
    },
    vehicleStats: {
        alignItems: 'flex-end',
    },
    vehicleMileage: {
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 4,
    },
    vehicleLastMaintenance: {
        fontSize: 12,
    },
});

export default VehicleItem;