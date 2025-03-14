import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Maintenance } from '@/types/Maintenance';

interface MaintenanceListProps {
    maintenanceItems: Maintenance[];
    getVehicleName: (vehicleId: number) => string;
    onItemPress: (vehicleId: number, maintenanceId: number) => void;
    onViewAll?: () => void;
    theme?: any; // Tipo del tema
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({
    maintenanceItems,
    getVehicleName,
    onItemPress,
    onViewAll,
    theme
}) => {
    // Definir colores con valores por defecto que garantizan buen contraste
    const textColor = theme?.text || '#333333';
    const secondaryTextColor = theme?.secondaryText || '#555555'; // Más oscuro que el original para mejor contraste
    const primaryColor = theme?.primary || '#3B82F6';
    const borderColor = theme?.border || '#E0E0E0'; // Más oscuro para mejor visibilidad

    if (maintenanceItems.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
                    No hay mantenimientos programados
                </Text>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>
                    Próximos Mantenimientos
                </Text>
                {onViewAll && (
                    <TouchableOpacity onPress={onViewAll}>
                        <Text style={[styles.viewAllText, { color: primaryColor }]}>
                            Ver todos
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {maintenanceItems.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={[styles.maintenanceItem, { borderBottomColor: borderColor }]}
                    onPress={() => onItemPress(item.vehicleId, item.id)}
                >
                    <View style={styles.maintenanceInfo}>
                        <Text style={[styles.maintenanceType, { color: textColor }]}>
                            {item.type}
                        </Text>
                        <Text style={[styles.maintenanceVehicle, { color: secondaryTextColor }]}>
                            {getVehicleName(item.vehicleId)}
                        </Text>
                    </View>
                    <View style={styles.maintenanceDate}>
                        <Text style={[styles.maintenanceDateText, { color: textColor }]}>
                            {item.date}
                        </Text>
                        <Text style={[styles.maintenanceDaysLeft, { color: secondaryTextColor }]}>
                            Próximamente
                        </Text>
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
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '500', // Añadido peso para mejorar legibilidad
    },
    maintenanceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    maintenanceInfo: {
        flex: 1,
    },
    maintenanceType: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    maintenanceVehicle: {
        fontSize: 12,
        marginTop: 4,
    },
    maintenanceDate: {
        alignItems: 'flex-end',
    },
    maintenanceDateText: {
        fontWeight: '500',
        fontSize: 14,
    },
    maintenanceDaysLeft: {
        fontSize: 12,
        marginTop: 4,
    },
    emptyState: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14, // Especificado para consistencia
    },
});

export default MaintenanceList;