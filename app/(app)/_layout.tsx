// app/_layout.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { VehiclesProvider } from '@/contexts/VehiclesContext';
import CustomBottomNav from '@/components/common/CustomBottomNav';
import { useNavLayout } from '@/hooks/useNavLayout';

// Altura de la barra de navegación
const NAVBAR_HEIGHT = 65;

const ThemedAppLayout = () => {
    const { theme } = useTheme();
    const { showNavBar, needsBottomPadding } = useNavLayout();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: theme.background,
                paddingBottom: needsBottomPadding ? NAVBAR_HEIGHT : 0
            }
        ]}>
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.background },
                animation: 'ios_from_right'
            }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="vehicles/[id]/index" />
                <Stack.Screen name="vehicles/add" />
                <Stack.Screen name="vehicles/[id]/edit" />
                <Stack.Screen name="vehicles/[id]/maintenance/index" />
                <Stack.Screen name="vehicles/[id]/maintenance/add" />
                <Stack.Screen name="vehicles/[id]/maintenance/[id]" />
                <Stack.Screen name="reports/export" />
                <Stack.Screen name="profile" />
            </Stack>

            {/* Solo renderiza la navegación si debe mostrarse */}
            {showNavBar && <CustomBottomNav />}
        </View>
    );
};

export default function AppLayout() {
    return (
        <ThemeProvider>
            <VehiclesProvider>
                <ThemedAppLayout />
            </VehiclesProvider>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});