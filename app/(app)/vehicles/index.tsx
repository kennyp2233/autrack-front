// app/(app)/vehicles/index.tsx
import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useVehicles } from '@/contexts/VehiclesContext';

// Componentes base
import PageContainer from '@/components/ui/PageContainer';
import PageHeaderWithSearch from '@/components/ui/PageHeaderWithSearch';
import EmptyStateView from '@/components/ui/EmptyStateView';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import LoadingErrorIndicator from '@/components/common/LoadingErrorIndicator';

// Componentes específicos
import VehicleItem from '@/components/vehicles/index-vehicle-page/vehicle-list/VehicleItem';
import { useTheme } from '@/contexts/ThemeContext';

export default function VehiclesIndexScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { vehicles, isLoading, error, refreshData } = useVehicles();

    // Estado para búsqueda
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState(vehicles);

    // Filtrar vehículos cuando cambia la búsqueda o los datos
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredVehicles(vehicles);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = vehicles.filter(vehicle => {
                const brand = vehicle.marca?.nombre.toLowerCase() || '';
                const model = vehicle.modelo?.nombre.toLowerCase() || '';
                const plate = vehicle.placa?.toLowerCase() || '';
                const year = vehicle.anio?.toString() || '';

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

    // Manejar clic en un vehículo
    const handleVehiclePress = (id: number) => {
        router.push(`/vehicles/${id}`);
    };

    // Manejar agregar nuevo vehículo
    const handleAddVehicle = () => {
        router.push('/vehicles/add');
    };

    // Renderizado de cada vehículo
    const renderVehicleItem = ({ item }: any) => (
        <VehicleItem
            vehicle={item}
            onPress={() => handleVehiclePress(item.id_vehiculo)}
        />
    );

    // Determinar el contenido principal
    const renderContent = () => {
        if (isLoading) {
            return (
                <LoadingErrorIndicator
                    isLoading={true}
                    error={null}
                    loadingMessage="Cargando vehículos..."
                    theme={theme}
                />
            );
        }

        if (error) {
            return (
                <LoadingErrorIndicator
                    isLoading={false}
                    error={error}
                    onRetry={refreshData}
                    theme={theme}
                />
            );
        }

        if (vehicles.length === 0) {
            return (
                <EmptyStateView
                    icon="truck"
                    title="No tienes vehículos registrados"
                    message="Agrega tu primer vehículo para comenzar a gestionar su mantenimiento."
                    actionLabel="Agregar vehículo"
                    onAction={handleAddVehicle}
                />
            );
        }

        if (filteredVehicles.length === 0 && searchQuery !== '') {
            return (
                <EmptyStateView
                    icon="search"
                    title="No se encontraron resultados"
                    message={`No hay vehículos que coincidan con "${searchQuery}"`}
                    actionLabel="Limpiar búsqueda"
                    onAction={() => setSearchQuery('')}
                />
            );
        }

        return (
            <FlatList
                data={filteredVehicles}
                renderItem={renderVehicleItem}
                keyExtractor={(item) => item.id_vehiculo.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        );
    };

    return (
        <PageContainer>
            <PageHeaderWithSearch
                title="Mis Vehículos"
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchClear={() => setSearchQuery('')}
                placeholder="Buscar marca, modelo, placa..."
            />

            <View style={styles.content}>
                {renderContent()}
            </View>

            {vehicles.length > 0 && (
                <FloatingActionButton
                    icon="plus"
                    onPress={handleAddVehicle}
                />
            )}
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80, // Espacio para el FAB
    }
});