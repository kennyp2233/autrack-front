import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { VehiclesProvider } from '@/contexts/VehiclesContext';
import CustomBottomNav from '@/components/CustomBottomNav';

export default function AppLayout() {
    return (
        <ThemeProvider>
            <VehiclesProvider>
                <View style={styles.container}>
                    {/* Stack navigator with header options disabled - we're using our custom header */}
                    <Stack screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: '#f5f5f5' }
                    }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="vehicles/index" />
                        <Stack.Screen name="vehicles/[id]/index" />
                        <Stack.Screen name="vehicles/add" />
                        <Stack.Screen name="vehicles/[id]/edit" />
                        <Stack.Screen name="vehicles/[id]/maintenance/index" />
                        <Stack.Screen name="vehicles/[id]/maintenance/add" />
                        <Stack.Screen name="vehicles/[id]/maintenance/[id]" />
                        <Stack.Screen name="reports/index" />
                        <Stack.Screen name="reports/export" />
                        <Stack.Screen name="settings" />
                        <Stack.Screen name="profile" />
                    </Stack>

                    {/* Custom Bottom Navigation */}
                    <CustomBottomNav />
                </View>
            </VehiclesProvider>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative', // Important for positioning the CustomBottomNav
    },
});