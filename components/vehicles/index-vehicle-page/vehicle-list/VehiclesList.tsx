// components/vehicles/index-vehicle-page/vehicle-list/VehiclesList.tsx
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Vehicle } from '@/types/Vehicle';
import VehicleItem from './VehicleItem';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';

interface VehiclesListProps {
    vehicles: Vehicle[];
    onVehiclePress: (id: number) => void;
    theme: any;
}

const VehiclesList: React.FC<VehiclesListProps> = ({
    vehicles,
    onVehiclePress,
}) => {
    // Filtrar solo vehículos activos
    const activeVehicles = vehicles.filter(item => item.activo !== false);

    // Renderizar cada elemento de vehículo
    const renderVehicleItem = ({ item }: { item: Vehicle }) => {
        return (
            <VehicleItem
                vehicle={item}
                onPress={() => onVehiclePress(item.id_vehiculo)}
            />
        );
    };

    // Renderizar encabezado de lista con contador
    const ListHeader = () => (
        <View style={styles.listHeader}>
            <SectionHeader
                title="Vehículos"
                showBorder={false}
                rightContent={
                    <Badge
                        label={`${activeVehicles.length} ${activeVehicles.length === 1 ? 'vehículo' : 'vehículos'}`}
                        variant="primary"
                        size="small"
                    />
                }
            />
        </View>
    );

    return (
        <FlatList
            data={activeVehicles}
            keyExtractor={(item) => item.id_vehiculo.toString()}
            renderItem={renderVehicleItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={<View style={styles.listFooter} />}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
        paddingBottom: 90, // Espacio para el FAB
    },
    listHeader: {
        marginBottom: 8,
    },
    listFooter: {
        height: 20, // Espacio extra al final de la lista
    }
});

export default VehiclesList;