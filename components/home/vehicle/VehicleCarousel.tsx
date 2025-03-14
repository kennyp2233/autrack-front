import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Vehicle } from '@/types/Vehicle';
import VehicleCard from './VehicleCard';

interface VehicleCarouselProps {
    vehicles: Vehicle[];
    onViewAll: () => void;
    theme: any; // Tipo del tema
}

const VehicleCarousel: React.FC<VehicleCarouselProps> = ({
    vehicles,
    onViewAll,
    theme
}) => {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    // Handle vehicle selection
    const handleVehiclePress = (vehicleId: number) => {
        router.push(`/vehicles/${vehicleId}`);
    };

    // Handle carousel navigation
    const handlePrevVehicle = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    const handleNextVehicle = () => {
        if (activeIndex < vehicles.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    // Renderizar el encabezado de la sección
    const renderSectionHeader = () => (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Mis Vehículos
            </Text>
            <TouchableOpacity
                style={styles.viewAllButton}
                onPress={onViewAll}
            >
                <Text style={[styles.viewAllText, { color: theme.primary }]}>Ver todos</Text>
                <Feather name="chevron-right" size={16} color={theme.primary} />
            </TouchableOpacity>
        </View>
    );

    // If no vehicles available
    if (vehicles.length === 0) {
        return (
            <View>
                {renderSectionHeader()}
                <View style={[styles.emptyVehicle, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Feather name="truck" size={40} color={theme.secondaryText} />
                    <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                        No tienes vehículos registrados
                    </Text>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/vehicles/add')}
                    >
                        <Text style={styles.addButtonText}>
                            Agregar Vehículo
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Current vehicle
    const currentVehicle = vehicles[activeIndex];

    return (
        <View>
            {renderSectionHeader()}

            <View style={styles.carouselContainer}>
                <TouchableOpacity
                    style={[
                        styles.navButton,
                        activeIndex === 0 && styles.navButtonDisabled,
                        { backgroundColor: theme.card }
                    ]}
                    onPress={handlePrevVehicle}
                    disabled={activeIndex === 0}
                >
                    <Feather
                        name="chevron-left"
                        size={24}
                        color={activeIndex === 0 ? theme.border : theme.text}
                    />
                </TouchableOpacity>

                <VehicleCard
                    vehicle={currentVehicle}
                    onPress={() => handleVehiclePress(currentVehicle.id)}
                    theme={theme}
                />

                <TouchableOpacity
                    style={[
                        styles.navButton,
                        activeIndex === vehicles.length - 1 && styles.navButtonDisabled,
                        { backgroundColor: theme.card }
                    ]}
                    onPress={handleNextVehicle}
                    disabled={activeIndex === vehicles.length - 1}
                >
                    <Feather
                        name="chevron-right"
                        size={24}
                        color={activeIndex === vehicles.length - 1 ? theme.border : theme.text}
                    />
                </TouchableOpacity>
            </View>

            {/* Indicadores de paginación */}
            {vehicles.length > 1 && (
                <View style={styles.pagination}>
                    {vehicles.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                {
                                    backgroundColor: index === activeIndex
                                        ? theme.primary
                                        : theme.border
                                }
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
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
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    navButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow for the button
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    emptyVehicle: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    emptyText: {
        marginVertical: 8,
    },
    addButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    addButtonText: {
        fontWeight: 'bold',
        color: 'white',
    },
});

export default VehicleCarousel;