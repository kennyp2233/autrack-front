// app/(app)/vehicles/add.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

// Componentes
import StaticHeader from '@/components/common/StaticHeader';
import PageContainer from '@/components/ui/PageContainer';
import VehicleForm from '@/components/vehicles/add-vehicle-page/vehicle-form/VehicleForm';

export default function AddVehicleScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <PageContainer>
            <StaticHeader
                title="Agregar Vehículo"
                showBackButton={true}
                theme={theme}
            />

            <VehicleForm />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});