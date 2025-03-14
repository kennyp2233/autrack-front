// components/vehicles/maintenance-page/MaintenanceItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Maintenance } from '@/types/Maintenance';

interface MaintenanceItemProps {
    item: Maintenance;
    onPress: () => void;
    theme: any;
}

const MaintenanceItem = ({ item, onPress, theme }: MaintenanceItemProps) => {
    const textColor = theme.text;
    const secondaryText = theme.secondaryText;
    const cardBg = theme.card;
    const borderColor = theme.border;
    const accentColor = theme.isDark ? theme.primary : `${theme.primary}15`;
    
    // Formatear fecha
    const formatDate = (dateString: string) => {
        try {
            // Si ya está en formato DD/MM/YYYY
            if (dateString.includes('/')) return dateString;
            
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {
            return dateString; // Si el formato no es compatible, devolver el original
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'cambio de aceite':
                return 'droplet';
            case 'revisión de frenos':
                return 'octagon';
            case 'alineación y balanceo':
                return 'sliders';
            case 'neumáticos':
                return 'circle';
            default:
                return 'tool';
        }
    };

    return (
        <TouchableOpacity 
            style={[styles.container, { backgroundColor: cardBg }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: accentColor }]}>
                <Feather name={getTypeIcon(item.type)} size={20} color={theme.primary} />
            </View>
            
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: textColor }]}>{item.type}</Text>
                    <Text style={[styles.cost, { color: theme.primary }]}>
                        ${item.cost?.toFixed(2) || '0.00'}
                    </Text>
                </View>
                
                <View style={styles.details}>
                    <View style={styles.detail}>
                        <Feather name="calendar" size={14} color={secondaryText} />
                        <Text style={[styles.detailText, { color: secondaryText }]}>
                            {formatDate(item.date)}
                        </Text>
                    </View>
                    
                    <View style={styles.detail}>
                        <Feather name="map-pin" size={14} color={secondaryText} />
                        <Text style={[styles.detailText, { color: secondaryText }]}>
                            {item.mileage.toLocaleString()} km
                        </Text>
                    </View>
                </View>
                
                {item.location && (
                    <View style={[styles.locationContainer, { borderTopColor: borderColor }]}>
                        <Feather name="home" size={14} color={secondaryText} />
                        <Text style={[styles.location, { color: secondaryText }]}>{item.location}</Text>
                    </View>
                )}
            </View>
            
            <View style={styles.chevronContainer}>
                <Feather name="chevron-right" size={20} color={secondaryText} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 16,
        marginBottom: 12,
        paddingVertical: 16,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    cost: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    details: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    detailText: {
        fontSize: 14,
        marginLeft: 6,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 0.5,
    },
    location: {
        fontSize: 14,
        marginLeft: 6,
    },
    chevronContainer: {
        justifyContent: 'center',
    },
});

export default MaintenanceItem;