// app/(app)/vehicles/add.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

// Importar el nuevo componente NavigationHeader
import { NavigationHeader } from '@/components/ui/headers';
import PageContainer from '@/components/ui/PageContainer';
import VehicleForm from '@/components/vehicles/add-vehicle-page/vehicle-form/VehicleForm';

export default function AddVehicleScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <PageContainer>
            {/* Reemplazar StaticHeader por NavigationHeader */}
            <NavigationHeader
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