// components/vehicles/maintenance-page/MaintenanceFilters.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface MaintenanceFiltersProps {
    visible: boolean;
    filters: {
        type: string;
        dateFrom: string;
        dateTo: string;
    };
    onChangeFilter: (name: string, value: string) => void;
    onApply: () => void;
    onClear: () => void;
    onClose: () => void;
    theme: any;
}

const MaintenanceFilters = ({ 
    visible, 
    filters, 
    onChangeFilter, 
    onApply, 
    onClear, 
    onClose,
    theme 
}: MaintenanceFiltersProps) => {
    if (!visible) return null;

    // Obtener colores del tema
    const textColor = theme.text;
    const borderColor = theme.border;
    const secondaryText = theme.secondaryText;
    const primaryColor = theme.primary;
    const cardBg = theme.card;

    // Tipos de mantenimiento
    const maintenanceTypes = [
        { id: 'all', name: 'Todos' },
        { id: 'oil', name: 'Cambio de Aceite' },
        { id: 'brakes', name: 'Frenos' },
        { id: 'tires', name: 'Neumáticos' },
        { id: 'other', name: 'Otros' }
    ];

    return (
        <View style={[styles.container, { backgroundColor: cardBg }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>Filtros</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Feather name="x" size={22} color={secondaryText} />
                </TouchableOpacity>
            </View>

            {/* Tipo de mantenimiento */}
            <View style={styles.filterSection}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Tipo de mantenimiento</Text>
                <View style={styles.typeButtons}>
                    {maintenanceTypes.map(type => (
                        <TouchableOpacity 
                            key={type.id}
                            style={[
                                styles.typeButton,
                                filters.type === type.id && { 
                                    backgroundColor: `${primaryColor}15`,
                                    borderColor: primaryColor 
                                },
                                { borderColor }
                            ]}
                            onPress={() => onChangeFilter('type', type.id)}
                        >
                            <Text 
                                style={[
                                    styles.typeButtonText, 
                                    { color: filters.type === type.id ? primaryColor : textColor }
                                ]}
                            >
                                {type.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Rango de fechas */}
            <View style={styles.filterSection}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Rango de fechas</Text>
                
                <View style={styles.dateInputs}>
                    <View style={styles.dateInputContainer}>
                        <Text style={[styles.dateLabel, { color: secondaryText }]}>Desde</Text>
                        <View style={[styles.dateInput, { borderColor }]}>
                            <Feather name="calendar" size={16} color={secondaryText} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                placeholder="DD/MM/AAAA"
                                placeholderTextColor={secondaryText}
                                value={filters.dateFrom}
                                onChangeText={text => onChangeFilter('dateFrom', text)}
                            />
                        </View>
                    </View>

                    <View style={styles.dateInputContainer}>
                        <Text style={[styles.dateLabel, { color: secondaryText }]}>Hasta</Text>
                        <View style={[styles.dateInput, { borderColor }]}>
                            <Feather name="calendar" size={16} color={secondaryText} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: textColor }]}
                                placeholder="DD/MM/AAAA"
                                placeholderTextColor={secondaryText}
                                value={filters.dateTo}
                                onChangeText={text => onChangeFilter('dateTo', text)}
                            />
                        </View>
                    </View>
                </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.actions}>
                <TouchableOpacity 
                    style={[styles.clearButton, { borderColor }]} 
                    onPress={onClear}
                >
                    <Text style={{ color: secondaryText }}>Limpiar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.applyButton, { backgroundColor: primaryColor }]} 
                    onPress={onApply}
                >
                    <Text style={styles.applyButtonText}>Aplicar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 110,
        left: 16,
        right: 16,
        borderRadius: 16,
        padding: 20,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    filterSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    typeButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    typeButton: {
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 14,
        margin: 6,
        minWidth: 90,
        alignItems: 'center',
    },
    typeButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    dateInputs: {
        flexDirection: 'row',
        marginHorizontal: -8,
    },
    dateInputContainer: {
        flex: 1,
        paddingHorizontal: 8,
    },
    dateLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 44,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
    },
    clearButton: {
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 12,
    },
    applyButton: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
});

export default MaintenanceFilters;