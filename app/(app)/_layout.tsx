import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { VehiclesProvider } from '@/contexts/VehiclesContext';
import CustomBottomNav from '@/components/CustomBottomNav';

// Componente interno para aplicar los ajustes específicos del tema
const ThemedAppLayout = () => {
    const { theme, isDark } = useTheme();

    // Efecto para sincronizar el StatusBar con el tema
    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(theme.primary);
        }
        StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    }, [isDark, theme]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* StatusBar configurado según el tema */}
            <StatusBar
                backgroundColor={theme.primary}
                barStyle={isDark ? 'light-content' : 'dark-content'}
            />

            {/* Stack navigator con header options disabled - usamos nuestro custom header */}
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.background },
                // Añadir animación de transición más suave
                animation: 'slide_from_right'
            }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="vehicles/index" />
                <Stack.Screen name="vehicles/[id]/index" />
                <Stack.Screen name="vehicles/add" />
                <Stack.Screen name="vehicles/[id]/edit" />
                <Stack.Screen name="vehicles/[id]/maintenance/index" />
                <Stack.Screen name="vehicles/[id]/maintenance/add" />
                <Stack.Screen name="vehicles/[id]/maintenance/[id]" />
                <Stack.Screen name="maintenance/index" />
                <Stack.Screen name="maintenance/add" />
                <Stack.Screen name="reports/index" />
                <Stack.Screen name="reports/export" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="more" />
                <Stack.Screen name="profile" />
            </Stack>

            {/* Custom Bottom Navigation */}
            <CustomBottomNav />
        </View>
    );
};

// Componente principal de Layout que incluye los providers
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
        position: 'relative', // Importante para posicionar el CustomBottomNav
    },
});