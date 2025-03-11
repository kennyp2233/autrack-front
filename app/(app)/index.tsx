import React from 'react';
import { View, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useVehicles } from '@/contexts/VehiclesContext';

// Import custom components
import HomeHeader from '@/components/home/HomeHeader';
import SectionCard from '@/components/home/section-card/SectionCard';
import VehicleCarousel from '@/components/home/vehicle/VehicleCarousel';
import MaintenanceList from '@/components/home/maintenance/MaintenanceList';
import StatsSummary from '@/components/home/stats-summary/StatsSummaryt';

export default function HomeScreen() {
    const router = useRouter();
    const { vehicles, maintenance } = useVehicles();

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

    // Calculate header height for proper spacing
    const headerHeight = Platform.OS === 'ios' ? 150 : (StatusBar.currentHeight || 0) + 130;

    return (
        <View style={styles.container}>
            {/* Background Header */}
            <HomeHeader onNotificationPress={handleNotificationPress} />

            {/* Main Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: headerHeight } // Dynamic padding based on header height
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Vehicles Section */}
                <SectionCard style={styles.vehiclesCard}>
                    <View style={styles.vehiclesHeader}>
                        <VehicleCarousel
                            vehicles={vehicles}
                            onViewAll={() => router.push('/vehicles')}
                        />
                    </View>
                </SectionCard>

                {/* Upcoming Maintenance Section */}
                <SectionCard>
                    <MaintenanceList
                        maintenanceItems={maintenance.slice(0, 3)}
                        getVehicleName={getVehicleName}
                        onItemPress={handleMaintenancePress}
                        onViewAll={() => router.push('/maintenance')}
                    />
                </SectionCard>

                {/* Statistics Summary */}
                <SectionCard>
                    <StatsSummary maintenanceItems={maintenance} />
                </SectionCard>

                {/* Bottom spacing to avoid content being hidden behind the bottom nav */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
        zIndex: 10, // Higher zIndex to ensure it's above the header
    },
    scrollContent: {
        // We set paddingTop dynamically to account for header height
        paddingBottom: 20,
    },
    vehiclesCard: {
        zIndex: 20, // Higher zIndex for this card
    },
    vehiclesHeader: {
        marginBottom: 12,
    },
    bottomSpacer: {
        height: 80, // Adjust based on your bottom nav height
    },
});