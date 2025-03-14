import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Vehicle } from '@/types/Vehicle';
import VehicleItem from './VehicleItem';

interface VehiclesListProps {
    vehicles: Vehicle[];
    onVehiclePress: (id: number) => void;
    searchActive: boolean;
    theme: any;
}

const VehiclesList: React.FC<VehiclesListProps> = ({
    vehicles,
    onVehiclePress,
    searchActive,
    theme
}) => {
    // Renderizar cada elemento de vehículo
    const renderVehicleItem = ({ item }: { item: Vehicle }) => {
        // Si el vehículo no está activo, no lo mostramos
        if (!item.isActive) return null;

        return (
            <VehicleItem
                vehicle={item}
                onPress={() => onVehiclePress(item.id)}
                theme={theme}
            />
        );
    };

    return (
        <FlatList
            data={vehicles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderVehicleItem}
            contentContainerStyle={[
                styles.listContent,
                { paddingTop: searchActive ? 80 : 16 } // Espacio para la barra de búsqueda cuando está activa
            ]}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
});

export default VehiclesList;