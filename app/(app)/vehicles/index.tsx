import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useTheme } from '@/contexts/ThemeContext';
import StaticHeader from '@/components/StaticHeader';
import VehiclesList from '@/components/vehicles/index-vehicle-page/vehicle-list/VehiclesList';
import SearchBar from '@/components/vehicles/index-vehicle-page/search-bar/SearchBar';
import AddVehicleButton from '@/components/vehicles/index-vehicle-page/add-vehicle-button/AddVehicleButton';
import EmptyVehicleState from '@/components/vehicles/index-vehicle-page/empty-vehicle-state/EmptyVehicleState';

// Altura para margen superior (espacio para el header)
const HEADER_HEIGHT = 56;
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
const TOP_SPACING = HEADER_HEIGHT + STATUSBAR_HEIGHT;

export default function VehiclesListScreen() {
    const { vehicles } = useVehicles();
    const { theme } = useTheme();
    const router = useRouter();

    // Estado para la búsqueda
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState(vehicles.filter(v => v.isActive));

    // Estado para la animación del input de búsqueda
    const [searchInputWidth] = useState(new Animated.Value(0));
    const [isSearchActive, setIsSearchActive] = useState(false);

    // Actualizar vehículos filtrados cuando cambia la búsqueda o los vehículos
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredVehicles(vehicles.filter(v => v.isActive));
            return;
        }

        const filtered = vehicles.filter(vehicle => {
            const searchLower = searchQuery.toLowerCase();
            return (
                vehicle.isActive &&
                (vehicle.brand.toLowerCase().includes(searchLower) ||
                    vehicle.model.toLowerCase().includes(searchLower) ||
                    vehicle.plate?.toLowerCase().includes(searchLower) ||
                    vehicle.year.toString().includes(searchLower))
            );
        });

        setFilteredVehicles(filtered);
    }, [searchQuery, vehicles]);

    // Manejar búsqueda
    const toggleSearch = () => {
        if (isSearchActive) {
            // Cerrar búsqueda
            setSearchQuery('');
            Animated.timing(searchInputWidth, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start(() => {
                setIsSearchActive(false);
            });
        } else {
            // Abrir búsqueda
            setIsSearchActive(true);
            Animated.timing(searchInputWidth, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            }).start();
        }
    };

    // Manejar agregar vehículo
    const handleAddVehicle = () => {
        router.push('/vehicles/add');
    };

    // Manejar toque en un vehículo
    const handleVehiclePress = (id: number) => {
        router.push(`/vehicles/${id}`);
    };

    // Calcular el ancho animado del input de búsqueda
    const inputWidth = searchInputWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header estático */}
            <StaticHeader
                title="Mis Vehículos"
                showBackButton={false}
                rightIcon={isSearchActive ? "x" : "search"}
                onRightIconPress={toggleSearch}
                theme={theme}
            />

            {/* Barra de búsqueda animada */}
            {isSearchActive && (
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    width={inputWidth}
                    theme={theme}
                    topPosition={TOP_SPACING}
                />
            )}

            {/* Lista de vehículos o estado vacío */}
            {filteredVehicles.length > 0 ? (
                <VehiclesList
                    vehicles={filteredVehicles}
                    onVehiclePress={handleVehiclePress}
                    searchActive={isSearchActive}
                    theme={theme}
                />
            ) : (
                <EmptyVehicleState
                    searchQuery={searchQuery}
                    onAddVehicle={handleAddVehicle}
                    theme={theme}
                />
            )}

            {/* Botón flotante para agregar vehículo */}
            <AddVehicleButton onPress={handleAddVehicle} theme={theme} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});