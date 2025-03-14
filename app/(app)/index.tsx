import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useTheme } from '@/contexts/ThemeContext';

// Import custom components
import HomeHeader from '@/components/home/HomeHeader';
import SectionCard from '@/components/home/section-card/SectionCard';
import VehicleCarousel from '@/components/home/vehicle/VehicleCarousel';
import MaintenanceList from '@/components/home/maintenance/MaintenanceList';
import StatsSummary from '@/components/home/stats-summary/StatsSummaryt';

// Definimos las alturas del header para mantener la consistencia con HomeHeader.tsx
const HEADER_MAX_HEIGHT = 220;
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const NAVBAR_HEIGHT = 80; // Altura del navbar según CustomBottomNav.tsx

export default function HomeScreen() {
    const router = useRouter();
    const { vehicles, maintenance } = useVehicles();
    const { theme } = useTheme();

    // Creamos una referencia para el valor de animación del scroll
    const scrollY = useRef(new Animated.Value(0)).current;

    // Handle notification press
    const handleNotificationPress = () => {
        console.log('Notification button pressed');
    };

    // Get vehicle name by id
    const getVehicleName = (vehicleId: number) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehículo desconocido';
    };

    // Handle navigation to maintenance detail
    const handleMaintenancePress = (vehicleId: number, maintenanceId: number) => {
        router.push(`/vehicles/${vehicleId}/maintenance/${maintenanceId}`);
    };

    // Calculamos el padding dinámico para el contenido
    // Ajustamos para que el primer card aparezca sobrepuesto al header
    const paddingTop = Platform.OS === 'ios'
        ? HEADER_MAX_HEIGHT - 60 // iOS
        : HEADER_MAX_HEIGHT - 60 + (StatusBar.currentHeight || 0); // Android con StatusBar

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Cabecera animada que se sitúa debajo del contenido */}
            <HomeHeader
                onNotificationPress={handleNotificationPress}
                scrollY={scrollY}
                theme={theme}
            />

            {/* ScrollView animado que actualiza el valor scrollY */}
            <Animated.ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop },
                    { paddingBottom: NAVBAR_HEIGHT + 20 } // Añadimos espacio para el navbar
                ]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16} // Importante: controla la frecuencia de actualización
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false } // Importante para animaciones de layout
                )}
            >
                {/* Vehicles Section - Con elevación para que se vea sobre el header */}
                <SectionCard
                    style={[
                        styles.vehiclesCard,
                        { backgroundColor: theme.card }
                    ]}
                >
                    <View style={styles.vehiclesHeader}>
                        <VehicleCarousel
                            vehicles={vehicles}
                            onViewAll={() => router.push('/vehicles')}
                            theme={theme}
                        />
                    </View>
                </SectionCard>

                {/* Upcoming Maintenance Section */}
                <SectionCard style={{ backgroundColor: theme.card }}>
                    <MaintenanceList
                        maintenanceItems={maintenance.slice(0, 3)}
                        getVehicleName={getVehicleName}
                        onItemPress={handleMaintenancePress}
                        onViewAll={() => router.push('/maintenance')}
                        theme={theme}
                    />
                </SectionCard>

                {/* Statistics Summary */}
                <SectionCard style={{ backgroundColor: theme.card }}>
                    <StatsSummary
                        maintenanceItems={maintenance}
                        theme={theme}
                    />
                </SectionCard>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        zIndex: 20, // Asegura que el ScrollView esté encima del header
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    vehiclesCard: {
        marginTop: 0,
        zIndex: 30, // Asegura que este card esté por encima
        // Efecto de elevación extra para el primer card
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    vehiclesHeader: {
        marginBottom: 12,
    },
});