import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Maintenance } from '@/types/Maintenance';

interface MaintenanceItemProps {
    maintenance: Maintenance;
    onPress: () => void;
    theme: any;
}

const MaintenanceItem: React.FC<MaintenanceItemProps> = ({
    maintenance,
    onPress,
    theme
}) => {
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const cardColor = theme.isDark ? `${theme.card}90` : '#f9f9f9';
    const borderColor = theme.border;

    return (
        <TouchableOpacity
            style={[styles.maintenanceItem, { backgroundColor: cardColor }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.maintenanceHeader}>
                <Text style={[styles.maintenanceType, { color: textColor }]}>
                    {maintenance.type}
                </Text>
                <Text style={[styles.maintenanceCost, { color: primaryColor }]}>
                    ${maintenance.cost || 0}
                </Text>
            </View>

            <View style={styles.maintenanceDetails}>
                <View style={styles.maintenanceDetail}>
                    <Feather name="calendar" size={14} color={secondaryTextColor} />
                    <Text style={[styles.maintenanceDetailText, { color: secondaryTextColor }]}>
                        {maintenance.date}
                    </Text>
                </View>
                <View style={styles.maintenanceDetail}>
                    <Feather name="map" size={14} color={secondaryTextColor} />
                    <Text style={[styles.maintenanceDetailText, { color: secondaryTextColor }]}>
                        {maintenance.mileage} km
                    </Text>
                </View>
            </View>

            {maintenance.notes && (
                <Text
                    style={[
                        styles.maintenanceNotes,
                        { color: secondaryTextColor, borderTopColor: borderColor }
                    ]}
                    numberOfLines={2}
                >
                    {maintenance.notes}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    maintenanceItem: {
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
    },
    maintenanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    maintenanceType: {
        fontWeight: 'bold',
    },
    maintenanceCost: {
        fontWeight: 'bold',
    },
    maintenanceDetails: {
        flexDirection: 'row',
    },
    maintenanceDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    maintenanceDetailText: {
        marginLeft: 4,
        fontSize: 12,
    },
    maintenanceNotes: {
        marginTop: 8,
        fontSize: 13,
        borderTopWidth: 1,
        paddingTop: 8,
    },
});

export default MaintenanceItem;