import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Maintenance } from '@/types/Maintenance';

interface MaintenanceListProps {
    maintenanceItems: Maintenance[];
    getVehicleName: (vehicleId: number) => string;
    onItemPress: (vehicleId: number, maintenanceId: number) => void;
    onViewAll?: () => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({
    maintenanceItems,
    getVehicleName,
    onItemPress,
    onViewAll,
}) => {
    if (maintenanceItems.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No hay mantenimientos programados</Text>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.title}>Próximos Mantenimientos</Text>
                {onViewAll && (
                    <TouchableOpacity onPress={onViewAll}>
                        <Text style={styles.viewAllText}>Ver todos</Text>
                    </TouchableOpacity>
                )}
            </View>

            {maintenanceItems.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={styles.maintenanceItem}
                    onPress={() => onItemPress(item.vehicleId, item.id)}
                >
                    <View style={styles.maintenanceInfo}>
                        <Text style={styles.maintenanceType}>{item.type}</Text>
                        <Text style={styles.maintenanceVehicle}>{getVehicleName(item.vehicleId)}</Text>
                    </View>
                    <View style={styles.maintenanceDate}>
                        <Text style={styles.maintenanceDateText}>{item.date}</Text>
                        <Text style={styles.maintenanceDaysLeft}>Próximamente</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAllText: {
        color: '#3B82F6',
        fontSize: 14,
    },
    maintenanceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    maintenanceInfo: {
        flex: 1,
    },
    maintenanceType: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
    },
    maintenanceVehicle: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
    },
    maintenanceDate: {
        alignItems: 'flex-end',
    },
    maintenanceDateText: {
        fontWeight: '500',
        fontSize: 14,
        color: '#333',
    },
    maintenanceDaysLeft: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
    },
    emptyState: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
    },
});

export default MaintenanceList;