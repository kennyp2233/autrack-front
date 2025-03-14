// components/home/stats-summary/StatsSummary.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Maintenance } from '@/types/Maintenance';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64; // Accounting for paddings

interface StatsSummaryProps {
    maintenanceItems: Maintenance[];
    theme: any;
}

type MaintenanceTypeCount = {
    [key: string]: {
        count: number;
        totalCost: number;
    }
};

type MonthlyData = {
    [key: string]: {
        count: number;
        totalCost: number;
    }
};

const StatsSummary: React.FC<StatsSummaryProps> = ({
    maintenanceItems,
    theme
}) => {
    // Obtener colores del tema
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const cardColor = theme.card;
    const borderColor = theme.border;
    const isDark = theme.isDark;

    // Calcular estadísticas
    const stats = useMemo(() => {
        if (!maintenanceItems || maintenanceItems.length === 0) {
            return {
                totalCost: 0,
                averageCost: 0,
                maintenanceCount: 0,
                mostCommonType: 'N/A',
                highestCostType: 'N/A',
                typeCounts: {} as MaintenanceTypeCount,
                monthlyData: {} as MonthlyData,
                formattedMonthData: [] as any[],
                formattedTypeData: [] as any[]
            };
        }

        // Calcular totales
        const totalCost = maintenanceItems.reduce((sum, item) => sum + (item.cost || 0), 0);
        const averageCost = totalCost / maintenanceItems.length;

        // Conteo por tipo de mantenimiento
        const typeCounts: MaintenanceTypeCount = {};
        maintenanceItems.forEach(item => {
            const type = item.type;
            if (!typeCounts[type]) {
                typeCounts[type] = { count: 0, totalCost: 0 };
            }
            typeCounts[type].count++;
            typeCounts[type].totalCost += item.cost || 0;
        });

        // Encontrar el tipo más común
        let mostCommonType = '';
        let maxCount = 0;
        Object.entries(typeCounts).forEach(([type, data]) => {
            if (data.count > maxCount) {
                mostCommonType = type;
                maxCount = data.count;
            }
        });

        // Encontrar el tipo con mayor costo
        let highestCostType = '';
        let maxCost = 0;
        Object.entries(typeCounts).forEach(([type, data]) => {
            if (data.totalCost > maxCost) {
                highestCostType = type;
                maxCost = data.totalCost;
            }
        });

        // Datos por mes (últimos 6 meses)
        const monthlyData: MonthlyData = {};
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        // Inicializar los últimos 6 meses
        for (let i = 0; i < 6; i++) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = month.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            monthlyData[monthKey] = { count: 0, totalCost: 0 };
        }

        // Llenar con datos reales
        maintenanceItems.forEach(item => {
            try {
                const date = new Date(item.date);
                if (date >= sixMonthsAgo) {
                    const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
                    if (!monthlyData[monthKey]) {
                        monthlyData[monthKey] = { count: 0, totalCost: 0 };
                    }
                    monthlyData[monthKey].count++;
                    monthlyData[monthKey].totalCost += item.cost || 0;
                }
            } catch (e) {
                // Ignorar fechas inválidas
            }
        });

        // Datos formateados para gráficos
        const formattedMonthData = Object.entries(monthlyData)
            .map(([month, data]) => ({
                name: month,
                costo: data.totalCost,
                servicios: data.count
            }))
            .reverse();

        const formattedTypeData = Object.entries(typeCounts)
            .map(([type, data]) => ({
                name: type.length > 10 ? `${type.substring(0, 10)}...` : type,
                costo: data.totalCost,
                servicios: data.count
            }))
            .sort((a, b) => b.costo - a.costo)
            .slice(0, 5);

        return {
            totalCost,
            averageCost,
            maintenanceCount: maintenanceItems.length,
            mostCommonType,
            highestCostType,
            typeCounts,
            monthlyData,
            formattedMonthData,
            formattedTypeData
        };
    }, [maintenanceItems]);

    // Si no hay datos, mostrar mensaje para agregar mantenimiento
    if (maintenanceItems.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                    Estadísticas
                </Text>
                <View style={[styles.emptyContainer, { borderColor }]}>
                    <Feather name="bar-chart-2" size={48} color={secondaryTextColor} />
                    <Text style={[styles.emptyTitle, { color: textColor }]}>
                        Sin datos de mantenimiento
                    </Text>
                    <Text style={[styles.emptyMessage, { color: secondaryTextColor }]}>
                        Agrega mantenimientos a tus vehículos para ver estadísticas y gráficos
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
                Estadísticas
            </Text>

            {/* Tarjetas de resumen */}
            <View style={styles.summaryCards}>
                <View style={[styles.summaryCard, { backgroundColor: isDark ? `${primaryColor}10` : '#F0F7FF', borderColor }]}>
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardLabel, { color: secondaryTextColor }]}>Total Mantenimientos</Text>
                        <Text style={[styles.cardValue, { color: textColor }]}>{stats.maintenanceCount}</Text>
                    </View>
                    <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}20` }]}>
                        <Feather name="tool" size={18} color={primaryColor} />
                    </View>
                </View>

                <View style={[styles.summaryCard, { backgroundColor: isDark ? `${primaryColor}10` : '#F5FFFA', borderColor }]}>
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardLabel, { color: secondaryTextColor }]}>Costo Promedio</Text>
                        <Text style={[styles.cardValue, { color: textColor }]}>${stats.averageCost.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.iconContainer, { backgroundColor: `${theme.success}20` }]}>
                        <Feather name="dollar-sign" size={18} color={theme.success} />
                    </View>
                </View>
            </View>

            {/* Tipo más común / Más caro */}
            <View style={styles.summaryCards}>
                <View style={[styles.summaryCard, { backgroundColor: isDark ? `${primaryColor}10` : '#FFF5F5', borderColor }]}>
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardLabel, { color: secondaryTextColor }]}>Más Frecuente</Text>
                        <Text style={[styles.cardValue, { color: textColor }]} numberOfLines={1}>{stats.mostCommonType}</Text>
                    </View>
                    <View style={[styles.iconContainer, { backgroundColor: `${theme.warning}20` }]}>
                        <Feather name="repeat" size={18} color={theme.warning} />
                    </View>
                </View>

                <View style={[styles.summaryCard, { backgroundColor: isDark ? `${primaryColor}10` : '#F0F7FF', borderColor }]}>
                    <View style={styles.cardContent}>
                        <Text style={[styles.cardLabel, { color: secondaryTextColor }]}>Mayor Gasto</Text>
                        <Text style={[styles.cardValue, { color: textColor }]} numberOfLines={1}>{stats.highestCostType}</Text>
                    </View>
                    <View style={[styles.iconContainer, { backgroundColor: `${theme.danger}20` }]}>
                        <Feather name="trending-up" size={18} color={theme.danger} />
                    </View>
                </View>
            </View>

            {/* Gráfico por Mes - Costos */}
            <View style={[styles.chartContainer, { borderColor }]}>
                <Text style={[styles.chartTitle, { color: textColor }]}>
                    Gasto por Mes
                </Text>

                <View style={styles.chartWrapper}>
                    {stats.formattedMonthData && stats.formattedMonthData.length > 0 ? (
                        <Text style={{ color: secondaryTextColor, textAlign: 'center' }}>
                            Gráfico de costos mensuales
                            (${stats.totalCost.toLocaleString()} total)
                        </Text>
                    ) : (
                        <Text style={{ color: secondaryTextColor, textAlign: 'center' }}>
                            No hay suficientes datos para mostrar tendencias
                        </Text>
                    )}
                </View>
            </View>

            {/* Gráfico por Tipo - Top 5 */}
            <View style={[styles.chartContainer, { borderColor }]}>
                <Text style={[styles.chartTitle, { color: textColor }]}>
                    Gasto por Tipo
                </Text>

                <View style={styles.chartWrapper}>
                    {stats.formattedTypeData && stats.formattedTypeData.length > 0 ? (
                        <Text style={{ color: secondaryTextColor, textAlign: 'center' }}>
                            Top 5 categorías por gasto
                        </Text>
                    ) : (
                        <Text style={{ color: secondaryTextColor, textAlign: 'center' }}>
                            No hay suficientes datos para mostrar
                        </Text>
                    )}
                </View>
            </View>

            {/* Desglose detallado */}
            <View style={[styles.detailedContainer, { borderColor }]}>
                <Text style={[styles.chartTitle, { color: textColor }]}>
                    Desglose por Tipo
                </Text>

                {Object.entries(stats.typeCounts).map(([type, data], index) => (
                    <View key={index} style={styles.typeItem}>
                        <View style={styles.typeNameContainer}>
                            <View
                                style={[
                                    styles.typeDot,
                                    {
                                        backgroundColor: getColorForIndex(index, theme)
                                    }
                                ]}
                            />
                            <Text style={[styles.typeName, { color: textColor }]} numberOfLines={1}>
                                {type}
                            </Text>
                        </View>
                        <View style={styles.typeDataContainer}>
                            <Text style={[styles.typeCount, { color: secondaryTextColor }]}>
                                {data.count} {data.count === 1 ? 'servicio' : 'servicios'}
                            </Text>
                            <Text style={[styles.typeCost, { color: primaryColor }]}>
                                ${data.totalCost.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Resumen total de gastos */}
            <View style={[styles.totalContainer, { backgroundColor: isDark ? `${primaryColor}15` : `${primaryColor}10` }]}>
                <Text style={[styles.totalLabel, { color: textColor }]}>
                    Gasto Total en Mantenimiento
                </Text>
                <Text style={[styles.totalValue, { color: primaryColor }]}>
                    ${stats.totalCost.toLocaleString()}
                </Text>
            </View>
        </View>
    );
};

// Función para obtener colores diferentes para los tipos de mantenimiento
const getColorForIndex = (index: number, theme: any) => {
    const colors = [
        theme.primary,
        theme.secondary || '#9D8B70',
        theme.success,
        theme.warning,
        theme.danger,
        '#8884d8',
        '#82ca9d',
        '#ffc658'
    ];
    return colors[index % colors.length];
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    summaryCards: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    summaryCard: {
        flex: 1,
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
    },
    cardContent: {
        flex: 1,
        marginRight: 8,
    },
    cardLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartContainer: {
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    chartWrapper: {
        alignItems: 'center',
        height: 180,
        justifyContent: 'center',
    },
    detailedContainer: {
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
    typeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    typeNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    typeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    typeName: {
        fontSize: 14,
        flex: 1,
    },
    typeDataContainer: {
        alignItems: 'flex-end',
    },
    typeCount: {
        fontSize: 12,
    },
    typeCost: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    totalContainer: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    totalLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
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
    },
});

export default StatsSummary;