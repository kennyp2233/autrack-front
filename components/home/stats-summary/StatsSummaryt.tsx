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

    // Definir colores con valores por defecto que garantizan buen contraste
    const textColor = theme?.text || '#333333';
    const secondaryTextColor = theme?.secondaryText || '#555555'; // Mejorado para contraste
    const primaryColor = theme?.primary || '#3B82F6';
    const borderColor = theme?.border || '#E0E0E0'; // Más visible
    const cardBgColor = theme?.isDark ? theme?.card : '#f0f0f0'; // Ligeramente más oscuro que el original

    return (
        <View>
            <Text style={[styles.title, { color: textColor }]}>
                Estadísticas
            </Text>

            <View style={styles.statsContainer}>
                <View style={[
                    styles.statCard,
                    {
                        backgroundColor: cardBgColor,
                        borderColor: borderColor,
                        borderWidth: theme?.isDark ? 1 : 0.5 // Borde sutil para modo claro también
                    }
                ]}>
                    <Text style={[styles.statValue, { color: primaryColor }]}>
                        {maintenanceItems.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                        Mantenimientos Totales
                    </Text>
                </View>

                <View style={[
                    styles.statCard,
                    {
                        backgroundColor: cardBgColor,
                        borderColor: borderColor,
                        borderWidth: theme?.isDark ? 1 : 0.5 // Borde sutil para modo claro también
                    }
                ]}>
                    <Text style={[styles.statValue, { color: primaryColor }]}>
                        ${totalCost}
                    </Text>
                    <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
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
        // Añadida sombra sutil para mejorar separación visual en modo claro
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
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