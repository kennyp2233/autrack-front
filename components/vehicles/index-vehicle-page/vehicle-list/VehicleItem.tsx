// components/vehicles/index-vehicle-page/vehicle-list/VehicleItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Vehicle } from '@/types/Vehicle';
import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/components/ui/Card';

interface VehicleItemProps {
    vehicle: Vehicle;
    onPress: () => void;
}

const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle, onPress }) => {
    const { theme } = useTheme();

    // Obtener datos del vehículo
    const brandName = vehicle.marca?.nombre || 'Sin marca';
    const modelName = vehicle.modelo?.nombre || 'Sin modelo';
    const year = vehicle.anio || '';
    const plate = vehicle.placa || 'Sin placa';
    const mileage = vehicle.kilometraje_actual?.toLocaleString() || '0';

    return (
        <Card style={styles.card}>
            <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
                {/* Icono */}
                <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
                    <Feather name="truck" size={24} color={theme.primary} />
                </View>

                {/* Información */}
                <View style={styles.infoContainer}>
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                        {brandName} {modelName}
                    </Text>

                    <View style={styles.detailsRow}>
                        <Text style={[styles.details, { color: theme.secondaryText }]}>
                            {year} • {plate}
                        </Text>

                        <Text style={[styles.mileage, { color: theme.primary }]}>
                            {mileage} km
                        </Text>
                    </View>
                </View>

                {/* Flecha */}
                <Feather name="chevron-right" size={20} color={theme.secondaryText} />
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        padding: 0,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    details: {
        fontSize: 14,
    },
    mileage: {
        fontWeight: '500',
        fontSize: 14,
    }
});

export default VehicleItem;