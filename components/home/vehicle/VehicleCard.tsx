import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Vehicle } from '@/types/Vehicle';

interface VehicleCardProps {
    vehicle: Vehicle;
    onPress: (id: number) => void;
    theme?: any; // Tipo del tema
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress, theme }) => {
    // Definir colores con valores por defecto que garantizan buen contraste
    const textColor = theme?.text || '#333333';
    const secondaryTextColor = theme?.secondaryText || '#555555'; // Más oscuro que el original para mejor contraste
    const progressBgColor = theme?.progressBarBackground || '#E5E7EB';
    const progressFillColor = theme?.success || '#4CAF50';

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(vehicle.id)}
            activeOpacity={0.9}
        >
            <View>
                <Text style={[styles.name, { color: textColor }]}>
                    {vehicle.brand} {vehicle.model}
                </Text>
                <Text style={[styles.year, { color: secondaryTextColor }]}>
                    {vehicle.year}
                </Text>
            </View>

            {/* Car Image - using an icon for now */}
            <View style={styles.imageContainer}>
                <Feather
                    name="truck"
                    size={60}
                    color={textColor}
                    style={[styles.image, { opacity: theme?.isDark ? 0.7 : 0.8 }]} // Aumentada para mejor visibilidad
                />
            </View>

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                        Kilometraje
                    </Text>
                    <Text style={[styles.statValue, { color: textColor }]}>
                        {vehicle.mileage}km
                    </Text>
                </View>

                <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: secondaryTextColor }]}>
                        Último servicio
                    </Text>
                    <Text style={[styles.statValue, { color: textColor }]}>
                        {vehicle.lastMaintenance || 'No registrado'}
                    </Text>
                </View>
            </View>

            <View style={styles.statusContainer}>
                <Text style={[styles.statusLabel, { color: secondaryTextColor }]}>
                    Estado general
                </Text>
                <View style={[styles.progressBar, { backgroundColor: progressBgColor }]}>
                    <View style={[
                        styles.progressFill,
                        {
                            width: '85%',
                            backgroundColor: progressFillColor
                        }
                    ]} />
                </View>
                <Text style={[styles.statusPercent, { color: secondaryTextColor }]}>
                    85%
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    year: {
        fontSize: 14,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
        marginVertical: 16,
    },
    image: {
        // Quitamos la opacidad del estilo base y la controlamos con las props
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    stat: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statusContainer: {
        marginTop: 4,
    },
    statusLabel: {
        fontSize: 12,
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        marginVertical: 4,
    },
    progressFill: {
        height: 4,
        borderRadius: 2,
    },
    statusPercent: {
        fontSize: 12,
        textAlign: 'right',
    },
});

export default VehicleCard;