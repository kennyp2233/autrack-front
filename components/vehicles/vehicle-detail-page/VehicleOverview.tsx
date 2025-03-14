import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Vehicle } from '@/types/Vehicle';

interface VehicleOverviewProps {
    vehicle: Vehicle;
    onSchedulePress: () => void;
    theme: any;
}

const VehicleOverview: React.FC<VehicleOverviewProps> = ({
    vehicle,
    onSchedulePress,
    theme
}) => {
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const borderColor = theme.border;

    return (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor }]}>
            <View style={styles.vehicleHeader}>
                <View style={[styles.vehicleIcon, { backgroundColor: `${primaryColor}15` }]}>
                    <Feather name="truck" size={32} color={primaryColor} />
                </View>

                <View>
                    <Text style={[styles.vehicleName, { color: textColor }]}>
                        {vehicle.brand} {vehicle.model}
                    </Text>
                    <Text style={[styles.vehicleSubtitle, { color: secondaryTextColor }]}>
                        {vehicle.year} • {vehicle.plate || 'Sin placa'}
                    </Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Feather name="map" size={16} color={secondaryTextColor} />
                    <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                        Kilometraje
                    </Text>
                    <Text style={[styles.statValue, { color: textColor }]}>
                        {vehicle.mileage} km
                    </Text>
                </View>

                <View style={styles.statItem}>
                    <Feather name="calendar" size={16} color={secondaryTextColor} />
                    <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                        Último mantenimiento
                    </Text>
                    <Text style={[styles.statValue, { color: textColor }]}>
                        {vehicle.lastMaintenance || 'No registrado'}
                    </Text>
                </View>
            </View>

            {vehicle.nextMaintenance && (
                <View style={[styles.nextMaintenance, { backgroundColor: `${primaryColor}15` }]}>
                    <View>
                        <View style={styles.nextMaintenanceHeader}>
                            <Feather name="alert-circle" size={16} color={primaryColor} />
                            <Text style={[styles.nextMaintenanceLabel, { color: primaryColor }]}>
                                Próximo mantenimiento
                            </Text>
                        </View>
                        <Text style={[styles.nextMaintenanceDate, { color: textColor }]}>
                            {vehicle.nextMaintenance}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.scheduleButton, { backgroundColor: `${primaryColor}25` }]}
                        onPress={onSchedulePress}
                    >
                        <Text style={[styles.scheduleButtonText, { color: primaryColor }]}>
                            Programar
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    vehicleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    vehicleIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    vehicleName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    vehicleSubtitle: {
        fontSize: 14,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'flex-start',
    },
    statLabel: {
        marginVertical: 4,
        fontSize: 12,
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    nextMaintenance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
    },
    nextMaintenanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nextMaintenanceLabel: {
        fontWeight: '500',
        marginLeft: 6,
    },
    nextMaintenanceDate: {
        fontWeight: 'bold',
        marginTop: 4,
    },
    scheduleButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    scheduleButtonText: {
        fontWeight: '500',
    },
});

export default VehicleOverview;