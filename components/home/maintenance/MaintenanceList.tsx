// components/home/maintenance/MaintenanceList.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Maintenance } from '@/types/Maintenance';

interface MaintenanceListProps {
    maintenanceItems: Maintenance[];
    getVehicleName: (vehicleId: number) => string;
    onItemPress: (vehicleId: number, maintenanceId: number) => void;
    onViewAll: () => void;
    theme: any;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({
    maintenanceItems,
    getVehicleName,
    onItemPress,
    onViewAll,
    theme
}) => {
    // Extraer colores del tema
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const cardColor = theme.card;
    const borderColor = theme.border;
    const isDark = theme.isDark;

    // Formatear fecha
    const formatDate = (dateString: string) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Determinar el ícono basado en tipo de mantenimiento
    const getMaintenanceIcon = (type: string) => {
        const lowerType = type.toLowerCase();

        if (lowerType.includes('aceite')) return 'droplet';
        if (lowerType.includes('freno')) return 'alert-octagon';
        if (lowerType.includes('neumático') || lowerType.includes('rueda')) return 'circle';
        if (lowerType.includes('alineación') || lowerType.includes('balanceo')) return 'sliders';
        if (lowerType.includes('filtro')) return 'filter';
        if (lowerType.includes('batería')) return 'battery';
        if (lowerType.includes('general') || lowerType.includes('revisión')) return 'clipboard';

        return 'tool';
    };

    // Renderizar el encabezado de la sección
    const renderSectionHeader = () => (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
                Próximos Mantenimientos
            </Text>
            <TouchableOpacity
                style={styles.viewAllButton}
                onPress={onViewAll}
            >
                <Text style={[styles.viewAllText, { color: primaryColor }]}>Ver todos</Text>
                <Feather name="chevron-right" size={16} color={primaryColor} />
            </TouchableOpacity>
        </View>
    );

    // Renderizar un elemento de mantenimiento
    const renderItem = ({ item }: { item: Maintenance }) => {
        const maintenanceIcon = getMaintenanceIcon(item.type);
        const vehicleName = getVehicleName(item.vehicleId);

        return (
            <TouchableOpacity
                style={[
                    styles.maintenanceItem,
                    { backgroundColor: cardColor, borderColor }
                ]}
                onPress={() => onItemPress(item.vehicleId, item.id)}
                activeOpacity={0.7}
            >
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: `${primaryColor}15` }
                ]}>
                    <Feather name={maintenanceIcon as any} size={20} color={primaryColor} />
                </View>

                <View style={styles.maintenanceContent}>
                    <View style={styles.maintenanceHeader}>
                        <Text style={[styles.maintenanceType, { color: textColor }]}>
                            {item.type}
                        </Text>
                        <Text style={[styles.maintenanceCost, { color: primaryColor }]}>
                            ${item.cost?.toFixed(2) || '0.00'}
                        </Text>
                    </View>

                    <View style={styles.maintenanceDetails}>
                        <View style={styles.detailItem}>
                            <Feather name="calendar" size={12} color={secondaryTextColor} style={styles.detailIcon} />
                            <Text style={[styles.detailText, { color: secondaryTextColor }]}>
                                {formatDate(item.date)}
                            </Text>
                        </View>

                        <View style={styles.detailItem}>
                            <Feather name="truck" size={12} color={secondaryTextColor} style={styles.detailIcon} />
                            <Text style={[styles.detailText, { color: secondaryTextColor }]}>
                                {vehicleName}
                            </Text>
                        </View>
                    </View>

                    {item.location && (
                        <View style={styles.locationContainer}>
                            <Feather name="map-pin" size={12} color={secondaryTextColor} style={styles.detailIcon} />
                            <Text style={[styles.locationText, { color: secondaryTextColor }]} numberOfLines={1}>
                                {item.location}
                            </Text>
                        </View>
                    )}
                </View>

                <Feather name="chevron-right" size={20} color={secondaryTextColor} />
            </TouchableOpacity>
        );
    };

    // Renderizar cuando no hay mantenimientos
    const renderEmptyState = () => (
        <View style={[styles.emptyContainer, { borderColor }]}>
            <Feather name="calendar" size={48} color={secondaryTextColor} />
            <Text style={[styles.emptyTitle, { color: textColor }]}>
                Sin próximos mantenimientos
            </Text>
            <Text style={[styles.emptyMessage, { color: secondaryTextColor }]}>
                Programa mantenimientos para tus vehículos y visualiza tu historial
            </Text>
            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: primaryColor }]}
                onPress={onViewAll}
            >
                <Feather name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
                <Text style={styles.addButtonText}>Agregar mantenimiento</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {renderSectionHeader()}

            {maintenanceItems.length > 0 ? (
                maintenanceItems.map((item) => (
                    <View key={item.id}>
                        {renderItem({ item })}
                    </View>
                ))
            ) : (
                renderEmptyState()
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontWeight: '500',
        marginRight: 4,
    },
    maintenanceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    maintenanceContent: {
        flex: 1,
        marginRight: 8,
    },
    maintenanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    maintenanceType: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    maintenanceCost: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    maintenanceDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 4,
    },
    detailIcon: {
        marginRight: 4,
    },
    detailText: {
        fontSize: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 12,
        flex: 1,
    },
    emptyContainer: {
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addButtonIcon: {
        marginRight: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
});

export default MaintenanceList;