import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Vehicle } from '@/types/Vehicle';
import { LinearGradient } from 'expo-linear-gradient';

interface VehicleCardProps {
    vehicle: Vehicle;
    onPress: (id: number) => void;
    theme?: any;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress, theme }) => {
    // Definir colores con valores por defecto que garantizan buen contraste
    const textColor = theme?.text || '#333333';
    const secondaryTextColor = theme?.secondaryText || '#555555';
    const progressBgColor = theme?.progressBarBackground || '#E5E7EB';
    const progressFillColor = theme?.success || '#4CAF50';
    const cardBgColor = theme?.card || '#FFFFFF';
    const borderColor = theme?.border || '#DDDDDD';

    // Calcular color del vehículo
    const vehicleColor = vehicle.color || '#3B82F6';

    // Calcular porcentaje de estado (simulado)
    const statusPercent = 85; // En una implementación real, calcularía basado en mantenimientos

    // Determinar texto de último mantenimiento
    const lastMaintenanceText = vehicle.lastMaintenance || 'No registrado';

    // Formatear kilometraje
    const formattedMileage = vehicle.mileage.toLocaleString();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: cardBgColor, borderColor }]}
            onPress={() => onPress(vehicle.id)}
            activeOpacity={0.9}
        >
            {/* Header with vehicle info */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.name, { color: textColor }]}>
                        {vehicle.brand} {vehicle.model}
                    </Text>
                    <Text style={[styles.year, { color: secondaryTextColor }]}>
                        {vehicle.year} • {vehicle.plate || 'Sin placa'}
                    </Text>
                </View>

                {/* Color indicator */}
                <View style={[styles.colorIndicator, { backgroundColor: vehicleColor }]} />
            </View>

            {/* Image container with gradient overlay */}
            <View style={styles.imageContainer}>
                {/* Placeholder for actual vehicle image */}
                {/* En una implementación real, usaría Image en lugar del icono */}
                <View style={[styles.imagePlaceholder, { backgroundColor: `${vehicleColor}20` }]}>
                    <Image
                        source={require('@/assets/image.png')}
                        resizeMode="center"
                    />

                </View>

                {/* Gradient overlay at bottom of image for better text contrast */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.05)']}
                    style={styles.imageGradient}
                />
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <View style={styles.statIconContainer}>
                        <Feather name="map-pin" size={14} color={secondaryTextColor} />
                    </View>
                    <View>
                        <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                            Kilometraje
                        </Text>
                        <Text style={[styles.statValue, { color: textColor }]}>
                            {formattedMileage} km
                        </Text>
                    </View>
                </View>

                <View style={styles.stat}>
                    <View style={styles.statIconContainer}>
                        <Feather name="calendar" size={14} color={secondaryTextColor} />
                    </View>
                    <View>
                        <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                            Último servicio
                        </Text>
                        <Text style={[styles.statValue, { color: textColor }]}>
                            {lastMaintenanceText}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Status bar */}
            <View style={styles.statusContainer}>
                <View style={styles.statusHeader}>
                    <Text style={[styles.statusLabel, { color: secondaryTextColor }]}>
                        Estado general
                    </Text>
                    <Text style={[styles.statusPercent, { color: statusPercent > 60 ? progressFillColor : theme?.warning || '#E6A700' }]}>
                        {statusPercent}%
                    </Text>
                </View>

                <View style={[styles.progressBar, { backgroundColor: progressBgColor }]}>
                    <View style={[
                        styles.progressFill,
                        {
                            width: `${statusPercent}%`,
                            backgroundColor: progressFillColor
                        }
                    ]} />
                </View>

                {/* Next service */}
                {vehicle.nextMaintenance && (
                    <View style={styles.nextService}>
                        <Feather name="alert-circle" size={12} color={theme?.warning || '#E6A700'} />
                        <Text style={[styles.nextServiceText, { color: secondaryTextColor }]}>
                            Próximo servicio: {vehicle.nextMaintenance}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 8,
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    year: {
        fontSize: 13,
        marginTop: 2,
    },
    colorIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    imageContainer: {
        position: 'relative',
        height: 120,
        marginVertical: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    image: {
        resizeMode: 'stretch',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    stat: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    statIconContainer: {
        marginRight: 6,
        marginTop: 2,
    },
    statLabel: {
        fontSize: 12,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
    },
    statusContainer: {
        marginTop: 4,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusLabel: {
        fontSize: 12,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
    },
    progressFill: {
        height: 6,
        borderRadius: 3,
    },
    statusPercent: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    nextService: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    nextServiceText: {
        fontSize: 11,
        marginLeft: 4,
    },
});

export default VehicleCard;