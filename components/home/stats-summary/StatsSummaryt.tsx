import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Maintenance } from '@/types/Maintenance';

interface StatsSummaryProps {
    maintenanceItems: Maintenance[];
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ maintenanceItems }) => {
    // Calculate total maintenance cost
    const totalCost = maintenanceItems.reduce((sum, item) => sum + (item.cost || 0), 0);

    return (
        <View>
            <Text style={styles.title}>Estadísticas</Text>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{maintenanceItems.length}</Text>
                    <Text style={styles.statLabel}>Mantenimientos Totales</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statValue}>${totalCost}</Text>
                    <Text style={styles.statLabel}>Gasto Total</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
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
        backgroundColor: '#f9f9f9',
        marginHorizontal: 4,
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#3B82F6',
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
    },
});

export default StatsSummary;