import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useVehicles } from '@/contexts/VehiclesContext';

export default function ReportExportScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { vehicles, maintenance } = useVehicles();

    // Por defecto, exportar todo si no hay parámetros específicos
    const format = params.format as string || 'all';
    const vehicleId = params.vehicleId ? Number(params.vehicleId) : undefined;

    // Estados para opciones de exportación
    const [selectedFormat, setSelectedFormat] = useState('pdf');
    const [includePhotos, setIncludePhotos] = useState(true);
    const [includeNotes, setIncludeNotes] = useState(true);

    // Opciones de formato
    const formatOptions = [
        { id: 'pdf', name: 'PDF', icon: 'file-text' },
        { id: 'excel', name: 'Excel', icon: 'file' },
        { id: 'csv', name: 'CSV', icon: 'file' }
    ];

    // Manejar exportación
    const handleExport = () => {
        // Aquí se implementaría la lógica real para generar y exportar el reporte

        let message = `Exportando reporte en formato ${selectedFormat.toUpperCase()}`;

        if (vehicleId) {
            const vehicle = vehicles.find(v => v.id === vehicleId);
            if (vehicle) {
                message += ` para ${vehicle.brand} ${vehicle.model}`;
            }
        }

        Alert.alert(
            'Exportando Reporte',
            message,
            [{ text: 'OK', onPress: () => router.back() }]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Exportar Reporte</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Format Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Formato</Text>
                    <Text style={styles.sectionDescription}>Selecciona el formato en el que deseas exportar el reporte.</Text>

                    <View style={styles.optionsContainer}>
                        {formatOptions.map(option => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.formatOption,
                                    selectedFormat === option.id && styles.selectedFormatOption
                                ]}
                                onPress={() => setSelectedFormat(option.id)}
                            >
                                <Feather
                                    name={option.icon as any}
                                    size={24}
                                    color={selectedFormat === option.id ? '#3B82F6' : '#666'}
                                />
                                <Text
                                    style={[
                                        styles.formatOptionText,
                                        selectedFormat === option.id && styles.selectedFormatOptionText
                                    ]}
                                >
                                    {option.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Content Options Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contenido</Text>
                    <Text style={styles.sectionDescription}>Personaliza el contenido que deseas incluir en el reporte.</Text>

                    <View style={styles.optionItem}>
                        <Text style={styles.optionLabel}>Incluir fotografías</Text>
                        <Switch
                            value={includePhotos}
                            onValueChange={setIncludePhotos}
                        />
                    </View>

                    <View style={styles.optionItem}>
                        <Text style={styles.optionLabel}>Incluir notas</Text>
                        <Switch
                            value={includeNotes}
                            onValueChange={setIncludeNotes}
                        />
                    </View>
                </View>

                {/* Date Range Section (simplified) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Período</Text>
                    <Text style={styles.sectionDescription}>El reporte incluirá los mantenimientos registrados en este período.</Text>

                    <View style={styles.dateRangeInfo}>
                        <Feather name="calendar" size={20} color="#666" />
                        <Text style={styles.dateRangeText}>Todo el historial</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.exportButton}
                    onPress={handleExport}
                >
                    <Feather name="download" size={20} color="#fff" style={styles.exportButtonIcon} />
                    <Text style={styles.exportButtonText}>Exportar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionDescription: {
        color: '#666',
        marginBottom: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    formatOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginHorizontal: 4,
    },
    selectedFormatOption: {
        borderColor: '#3B82F6',
        backgroundColor: '#F0F7FF',
    },
    formatOptionText: {
        marginTop: 8,
        fontWeight: '500',
        color: '#666',
    },
    selectedFormatOptionText: {
        color: '#3B82F6',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionLabel: {
        fontWeight: '500',
    },
    dateRangeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 12,
    },
    dateRangeText: {
        marginLeft: 8,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cancelButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    exportButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        marginLeft: 8,
    },
    exportButtonIcon: {
        marginRight: 8,
    },
    exportButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});