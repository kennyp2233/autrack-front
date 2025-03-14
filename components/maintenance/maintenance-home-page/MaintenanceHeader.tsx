// components/vehicles/maintenance-page/MaintenanceHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Vehicle } from '@/types/Vehicle';

interface MaintenanceHeaderProps {
    vehicle: Vehicle;
    onBack: () => void;
    onFilter: () => void;
    theme: any;
}

const MaintenanceHeader = ({ vehicle, onBack, onFilter, theme }: MaintenanceHeaderProps) => {
    return (
        <SafeAreaView style={[styles.header, { backgroundColor: theme.primary }]}>
            <View style={styles.statusBarPlaceholder} />
            <View style={styles.headerContent}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Historial de Mantenimiento</Text>
                    <Text style={styles.subtitle}>{vehicle.brand} {vehicle.model} ({vehicle.year})</Text>
                </View>

                <TouchableOpacity onPress={onFilter} style={styles.filterButton}>
                    <Feather name="filter" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 8,
        zIndex: 10,
    },
    statusBarPlaceholder: {
        height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerContent: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        marginLeft: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MaintenanceHeader;