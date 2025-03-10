import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import CustomBottomNav from '@/components/ui/CustomBottomNav';

export default function AppLayout() {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Stack navigator para todas las pantallas */}
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.background }
            }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="vehicles" />
                <Stack.Screen name="vehicles/[id]" />
                <Stack.Screen name="vehicles/add" />
                <Stack.Screen name="vehicles/[id]/edit" />
                <Stack.Screen name="vehicles/[id]/maintenance" />
                <Stack.Screen name="vehicles/[id]/maintenance/add" />
                <Stack.Screen name="vehicles/[id]/maintenance/[id]" />
                <Stack.Screen name="reports" />
                <Stack.Screen name="reports/export" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="profile" />
            </Stack>

            {/* Barra de navegación personalizada */}
            <CustomBottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative', // Importante para posicionar el CustomBottomNav
    },
});