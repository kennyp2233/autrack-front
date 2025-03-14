// components/home/dashboard-summary/DashboardSummary.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface DashboardSummaryProps {
    vehiclesCount: number;
    nextMaintenanceDate: string;
    totalMaintenance: number;
    theme: any;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
    vehiclesCount,
    nextMaintenanceDate,
    totalMaintenance,
    theme
}) => {
    // Extraer colores del tema
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const borderColor = theme.border;
    const cardColor = theme.card;
    const isDark = theme.isDark;

    // Color de fondo para cada tarjeta
    const getCardBackgroundColor = (index: number) => {
        if (isDark) {
            // En modo oscuro, usamos variaciones del color primario con distinta opacidad
            const opacityValues = ['10', '08', '06'];
            return `${primaryColor}${opacityValues[index]}`;
        } else {
            // En modo claro, usamos colores pastel
            const colors = ['#F0F7FF', '#F5FFFA', '#FFF5F5'];
            return colors[index];
        }
    };

    // Iconos para cada tarjeta
    const icons = [
        { name: 'truck', color: '#3B82F6' },
        { name: 'calendar', color: '#10B981' },
        { name: 'tool', color: '#F59E0B' },
    ];

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
                Resumen del Garaje
            </Text>

            <View style={styles.cardsContainer}>
                {/* Vehículos card */}
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: getCardBackgroundColor(0),
                            borderColor: borderColor
                        }
                    ]}
                >
                    <View style={[styles.iconContainer, { backgroundColor: `${icons[0].color}20` }]}>
                        <Feather name={icons[0].name as any} size={20} color={icons[0].color} />
                    </View>
                    <Text style={[styles.cardTitle, { color: textColor }]}>Vehículos</Text>
                    <Text style={[styles.cardValue, { color: primaryColor }]}>
                        {vehiclesCount}
                    </Text>
                </View>

                {/* Próximo mantenimiento card */}
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: getCardBackgroundColor(1),
                            borderColor: borderColor
                        }
                    ]}
                >
                    <View style={[styles.iconContainer, { backgroundColor: `${icons[1].color}20` }]}>
                        <Feather name={icons[1].name as any} size={20} color={icons[1].color} />
                    </View>
                    <Text style={[styles.cardTitle, { color: textColor }]}>Próximo</Text>
                    <Text style={[styles.cardValue, { color: icons[1].color }]}>
                        {nextMaintenanceDate}
                    </Text>
                </View>

                {/* Total mantenimientos card */}
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: getCardBackgroundColor(2),
                            borderColor: borderColor
                        }
                    ]}
                >
                    <View style={[styles.iconContainer, { backgroundColor: `${icons[2].color}20` }]}>
                        <Feather name={icons[2].name as any} size={20} color={icons[2].color} />
                    </View>
                    <Text style={[styles.cardTitle, { color: textColor }]}>Servicios</Text>
                    <Text style={[styles.cardValue, { color: icons[2].color }]}>
                        {totalMaintenance}
                    </Text>
                </View>
            </View>

            {/* Botón rápido para agregar mantenimiento */}
            <TouchableOpacity
                style={[
                    styles.quickAddButton,
                    { backgroundColor: isDark ? `${primaryColor}15` : `${primaryColor}10`, borderColor }
                ]}
            >
                <Feather name="plus-circle" size={16} color={primaryColor} style={styles.quickAddIcon} />
                <Text style={[styles.quickAddText, { color: primaryColor }]}>
                    Registrar mantenimiento
                </Text>
            </TouchableOpacity>
        </View>
    );
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
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        width: '31%',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    quickAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    quickAddIcon: {
        marginRight: 8,
    },
    quickAddText: {
        fontWeight: '500',
    },
});

export default DashboardSummary;