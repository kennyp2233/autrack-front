import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Maintenance } from '@/types/Maintenance';

interface StatsSummaryProps {
    maintenanceItems: Maintenance[];
    theme?: any; // Tipo del tema
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ maintenanceItems, theme }) => {
    // Calculate total maintenance cost
    const totalCost = maintenanceItems.reduce((sum, item) => sum + (item.cost || 0), 0);

    return (
        <View>
            <Text style={[styles.title, { color: theme?.text || '#333' }]}>
                Estadísticas
            </Text>

            <View style={styles.statsContainer}>
                <View style={[
                    styles.statCard,
                    {
                        backgroundColor: theme?.isDark ? theme?.card : '#f9f9f9',
                        borderColor: theme?.border || 'transparent',
                        borderWidth: theme?.isDark ? 1 : 0
                    }
                ]}>
                    <Text style={[styles.statValue, { color: theme?.primary || '#3B82F6' }]}>
                        {maintenanceItems.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme?.secondaryText || '#666' }]}>
                        Mantenimientos Totales
                    </Text>
                </View>

                <View style={[
                    styles.statCard,
                    {
                        backgroundColor: theme?.isDark ? theme?.card : '#f9f9f9',
                        borderColor: theme?.border || 'transparent',
                        borderWidth: theme?.isDark ? 1 : 0
                    }
                ]}>
                    <Text style={[styles.statValue, { color: theme?.primary || '#3B82F6' }]}>
                        ${totalCost}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme?.secondaryText || '#666' }]}>
                        Gasto Total
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
    },
});

export default StatsSummary;