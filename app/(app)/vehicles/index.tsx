// app/(app)/vehicles/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useTheme } from '@/contexts/ThemeContext';
import LoadingErrorIndicator from '@/components/common/LoadingErrorIndicator';
import SearchBar from '@/components/vehicles/index-vehicle-page/search-bar/SearchBar';
import VehiclesList from '@/components/vehicles/index-vehicle-page/vehicle-list/VehiclesList';
import EmptyVehicleState from '@/components/vehicles/index-vehicle-page/empty-vehicle-state/EmptyVehicleState';
import AddVehicleButton from '@/components/vehicles/index-vehicle-page/add-vehicle-button/AddVehicleButton';
import StaticHeader from '@/components/common/StaticHeader';

export default function VehiclesIndexScreen() {
    const router = useRouter();
    const { vehicles, isLoading, error, refreshData } = useVehicles();
    const { theme, isDark } = useTheme();

    // Estado para búsqueda de vehículos
    const [searchQuery, setSearchQuery] = useState('');
    const [searchActive, setSearchActive] = useState(false);
    const [filteredVehicles, setFilteredVehicles] = useState(vehicles);

    // Animación para la barra de búsqueda
    const searchBarWidth = useState(new Animated.Value(60))[0];

    // Aplicar filtros cuando cambie la búsqueda o la lista de vehículos
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredVehicles(vehicles);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = vehicles.filter(vehicle => {
                const brand = vehicle.marca ? vehicle.marca.nombre.toLowerCase() : '';
                const model = vehicle.modelo ? vehicle.modelo.nombre.toLowerCase() : '';
                const plate = vehicle.placa ? vehicle.placa.toLowerCase() : '';
                const year = vehicle.anio ? vehicle.anio.toString() : '';

                return (
                    brand.includes(query) ||
                    model.includes(query) ||
                    plate.includes(query) ||
                    year.includes(query)
                );
            });
            setFilteredVehicles(filtered);
        }
    }, [searchQuery, vehicles]);

    // Activar/desactivar búsqueda
    const toggleSearch = () => {
        if (searchActive) {
            // Cerrar búsqueda
            setSearchQuery('');
            Animated.timing(searchBarWidth, {
                toValue: 60,
                duration: 300,
                useNativeDriver: false
            }).start(() => {
                setSearchActive(false);
            });
        } else {
            // Abrir búsqueda
            setSearchActive(true);
            Animated.timing(searchBarWidth, {
                toValue: 92, // Ancho casi completo
                duration: 300,
                useNativeDriver: false
            }).start();
        }
    };

    // Ir a la pantalla de detalle del vehículo
    const handleVehiclePress = (id: number) => {
        router.push(`/vehicles/${id}`);
    };

    // Ir a la pantalla de agregar vehículo
    const handleAddVehicle = () => {
        router.push('/vehicles/add');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header estático */}
            <StaticHeader
                title={searchActive ? '' : 'Mis Vehículos'}
                showBackButton={false}
                rightIcon={searchActive ? '' : 'search'}
                onRightIconPress={toggleSearch}
                theme={theme}
            />

            {/* Barra de búsqueda animada */}
            {searchActive && (
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    width={searchBarWidth}
                    theme={theme}
                    topPosition={StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50}
                />
            )}

            {/* Indicador de carga o error */}
            <LoadingErrorIndicator
                isLoading={isLoading}
                error={error}
                onRetry={refreshData}
                loadingMessage="Cargando vehículos..."
                theme={theme}
            />

            {/* Contenido principal */}
            {!isLoading && !error && (
                vehicles.length === 0 ? (
                    <EmptyVehicleState
                        searchQuery={searchQuery}
                        onAddVehicle={handleAddVehicle}
                        theme={theme}
                    />
                ) : (
                    <>
                        <VehiclesList
                            vehicles={filteredVehicles}
                            onVehiclePress={handleVehiclePress}
                            searchActive={searchActive}
                            theme={theme}
                        />
                        <AddVehicleButton
                            onPress={handleAddVehicle}
                            theme={theme}
                        />
                    </>
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});