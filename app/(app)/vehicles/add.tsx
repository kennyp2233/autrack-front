// app/(app)/vehicles/add.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import StaticHeader from '@/components/common/StaticHeader';
import VehicleForm from '@/components/vehicles/add-vehicle-page/vehicle-form/VehicleForm';

export default function AddVehicleScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <StaticHeader
                title="Agregar Vehículo"
                showBackButton={true}
                theme={theme}
            />

            {/* Formulario de vehículo adaptado para trabajar con el backend */}
            <VehicleForm />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});