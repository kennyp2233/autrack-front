import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface EmptyVehicleStateProps {
    searchQuery: string;
    onAddVehicle: () => void;
    theme: any;
}

const EmptyVehicleState: React.FC<EmptyVehicleStateProps> = ({
    searchQuery,
    onAddVehicle,
    theme
}) => {
    // Colores basados en el tema
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;

    return (
        <View style={styles.emptyContainer}>
            <Feather name="truck" size={60} color={secondaryTextColor} style={styles.emptyIcon} />
            <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
                {searchQuery
                    ? 'No se encontraron vehículos con esa búsqueda'
                    : 'No tienes vehículos registrados'}
            </Text>
            {!searchQuery && (
                <TouchableOpacity
                    style={[styles.emptyButton, { backgroundColor: primaryColor }]}
                    onPress={onAddVehicle}
                >
                    <Text style={styles.emptyButtonText}>Agregar vehículo</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyIcon: {
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default EmptyVehicleState;