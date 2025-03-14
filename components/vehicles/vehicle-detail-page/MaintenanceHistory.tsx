import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Maintenance } from '@/types/Maintenance';
import MaintenanceItem from './MaintenanceItem';

interface MaintenanceHistoryProps {
    maintenanceItems: Maintenance[];
    vehicleId: number;
    onViewAllPress: () => void;
    onAddPress: () => void;
    onDeleteVehiclePress: () => void;
    theme: any;
}

const MaintenanceHistory: React.FC<MaintenanceHistoryProps> = ({
    maintenanceItems,
    vehicleId,
    onViewAllPress,
    onAddPress,
    onDeleteVehiclePress,
    theme
}) => {
    const router = useRouter();
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const dangerColor = theme.danger;
    const borderColor = theme.border;

    const handleMaintenancePress = (maintenanceId: number) => {
        router.push(`/vehicles/${vehicleId}/maintenance/${maintenanceId}`);
    };

    // Limitamos a 3 elementos para la visualización en detalle
    const displayedItems = maintenanceItems.slice(0, 3);

    return (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor }]}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                    Historial de Mantenimientos
                </Text>
                <TouchableOpacity onPress={onViewAllPress}>
                    <Text style={[styles.seeAllText, { color: primaryColor }]}>
                        Ver todo
                    </Text>
                </TouchableOpacity>
            </View>

            {displayedItems.length > 0 ? (
                <ScrollView>
                    {displayedItems.map(item => (
                        <MaintenanceItem
                            key={item.id}
                            maintenance={item}
                            onPress={() => handleMaintenancePress(item.id)}
                            theme={theme}
                        />
                    ))}
                </ScrollView>
            ) : (
                <Text style={[styles.noMaintenanceText, { color: secondaryTextColor }]}>
                    No hay registros de mantenimiento
                </Text>
            )}

            <TouchableOpacity
                style={[styles.addMaintenanceButton, { backgroundColor: primaryColor }]}
                onPress={onAddPress}
            >
                <Feather name="plus" size={16} color="#fff" />
                <Text style={styles.addMaintenanceButtonText}>
                    Agregar mantenimiento
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.deleteButton, { borderColor: dangerColor }]}
                onPress={onDeleteVehiclePress}
            >
                <Feather name="trash-2" size={16} color={dangerColor} />
                <Text style={[styles.deleteButtonText, { color: dangerColor }]}>
                    Eliminar vehículo
                </Text>
            </TouchableOpacity>
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
        fontWeight: '500',
    },
    noMaintenanceText: {
        textAlign: 'center',
        padding: 16,
    },
    addMaintenanceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginVertical: 16,
    },
    addMaintenanceButtonText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 8,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
    },
    deleteButtonText: {
        fontWeight: '500',
        marginLeft: 8,
    },
});

export default MaintenanceHistory;