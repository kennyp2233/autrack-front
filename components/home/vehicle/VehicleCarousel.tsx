import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Vehicle } from '@/types/Vehicle';
import VehicleCard from './VehicleCard';

interface VehicleCarouselProps {
    vehicles: Vehicle[];
    onViewAll: () => void;
}

const VehicleCarousel: React.FC<VehicleCarouselProps> = ({
    vehicles,
    onViewAll
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

    // If no vehicles available
    if (vehicles.length === 0) {
        return (
            <View style={styles.emptyVehicle}>
                <Feather name="truck" size={40} color="#999" />
                <Text style={styles.emptyText}>No tienes vehículos registrados</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/vehicles/add')}
                >
                    <Text style={styles.addButtonText}>Agregar Vehículo</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Current vehicle
    const currentVehicle = vehicles[activeIndex];

    return (
        <View style={styles.carouselContainer}>
            <TouchableOpacity
                style={[
                    styles.navButton,
                    activeIndex === 0 && styles.navButtonDisabled
                ]}
                onPress={handlePrevVehicle}
                disabled={activeIndex === 0}
            >
                <Feather
                    name="chevron-left"
                    size={24}
                    color={activeIndex === 0 ? "#ccc" : "#333"}
                />
            </TouchableOpacity>

            <VehicleCard
                vehicle={currentVehicle}
                onPress={handleVehiclePress}
            />

            <TouchableOpacity
                style={[
                    styles.navButton,
                    activeIndex === vehicles.length - 1 && styles.navButtonDisabled
                ]}
                onPress={handleNextVehicle}
                disabled={activeIndex === vehicles.length - 1}
            >
                <Feather
                    name="chevron-right"
                    size={24}
                    color={activeIndex === vehicles.length - 1 ? "#ccc" : "#333"}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
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
    emptyVehicle: {
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        color: '#666',
        marginVertical: 8,
    },
    addButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default VehicleCarousel;