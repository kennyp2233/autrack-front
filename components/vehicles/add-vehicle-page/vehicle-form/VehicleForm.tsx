import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { VehicleFormData } from '@/types/Vehicle';
import BrandSelector from './BrandSelector';
import FormField from './FormField';

interface VehicleFormProps {
    vehicleData: VehicleFormData;
    errors: { [key: string]: string };
    showBrandsList: boolean;
    onToggleBrandsList: () => void;
    onSelectBrand: (brand: string) => void;
    onChange: (name: string, value: string) => void;
    theme: any;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
    vehicleData,
    errors,
    showBrandsList,
    onToggleBrandsList,
    onSelectBrand,
    onChange,
    theme
}) => {
    // Colores basados en el tema
    const cardColor = theme.card;
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const borderColor = theme.border;

    return (
        <View style={[styles.form, { backgroundColor: cardColor, borderColor }]}>
            {/* Brand Field */}
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>
                    Marca <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                    style={[
                        styles.input,
                        errors.brand && styles.inputError,
                        { borderColor: errors.brand ? theme.danger : borderColor }
                    ]}
                    onPress={onToggleBrandsList}
                >
                    <Text style={[
                        vehicleData.brand ? styles.inputText : styles.inputPlaceholder,
                        { color: vehicleData.brand ? textColor : secondaryTextColor }
                    ]}>
                        {vehicleData.brand || 'Selecciona una marca'}
                    </Text>
                    <Feather
                        name={showBrandsList ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={secondaryTextColor}
                    />
                </TouchableOpacity>
                {errors.brand && <Text style={[styles.errorText, { color: theme.danger }]}>{errors.brand}</Text>}

                {/* Brands Dropdown */}
                {showBrandsList && (
                    <BrandSelector
                        selectedBrand={vehicleData.brand}
                        onSelectBrand={onSelectBrand}
                        theme={theme}
                    />
                )}
            </View>

            {/* Model Field */}
            <FormField
                label="Modelo"
                value={vehicleData.model}
                placeholder="Ej. Corolla"
                required={true}
                error={errors.model}
                onChange={(value) => onChange('model', value)}
                theme={theme}
            />

            {/* Year Field */}
            <FormField
                label="Año"
                value={vehicleData.year?.toString()}
                placeholder="Ej. 2022"
                required={true}
                error={errors.year}
                onChange={(value) => onChange('year', value)}
                keyboardType="number-pad"
                theme={theme}
            />

            {/* Plate Field */}
            <FormField
                label="Número de Placa"
                value={vehicleData.plate}
                placeholder="Ej. ABC-1234"
                required={false}
                error={errors.plate}
                onChange={(value) => onChange('plate', value)}
                optional={true}
                theme={theme}
            />

            {/* Fuel Type Field */}
            <FormField
                label="Tipo de Combustible"
                value={vehicleData.fuelType}
                placeholder="Ej. Gasolina"
                required={false}
                error={errors.fuelType}
                onChange={(value) => onChange('fuelType', value)}
                optional={true}
                theme={theme}
            />

            {/* Color Field */}
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>Color</Text>
                <View style={[styles.colorContainer, { borderColor }]}>
                    <TextInput
                        style={[
                            styles.colorInput,
                            { color: textColor, borderColor }
                        ]}
                        value={vehicleData.color}
                        onChangeText={(text) => onChange('color', text)}
                        placeholder="#RRGGBB"
                        placeholderTextColor={secondaryTextColor}
                    />
                    <View
                        style={[styles.colorPreview, { backgroundColor: vehicleData.color }]}
                    />
                </View>
            </View>

            {/* Mileage Field */}
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>
                    Kilometraje Actual <Text style={styles.required}>*</Text>
                </Text>
                <View style={[
                    styles.mileageContainer,
                    { borderColor: errors.mileage ? theme.danger : borderColor }
                ]}>
                    <TextInput
                        style={[
                            styles.mileageInput,
                            errors.mileage && styles.inputError,
                            { color: textColor }
                        ]}
                        placeholder="Ej. 25000"
                        placeholderTextColor={secondaryTextColor}
                        value={vehicleData.mileage?.toString()}
                        onChangeText={(text) => onChange('mileage', text)}
                        keyboardType="number-pad"
                    />
                    <Text style={[styles.mileageUnit, { color: secondaryTextColor }]}>km</Text>
                </View>
                {errors.mileage && <Text style={[styles.errorText, { color: theme.danger }]}>{errors.mileage}</Text>}
            </View>

            {/* Notes Field */}
            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>
                    Notas <Text style={[styles.optional, { color: secondaryTextColor }]}>(Opcional)</Text>
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        styles.textArea,
                        { color: textColor, borderColor }
                    ]}
                    placeholder="Información adicional sobre el vehículo..."
                    placeholderTextColor={secondaryTextColor}
                    value={vehicleData.notes}
                    onChangeText={(text) => onChange('notes', text)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 80, // Espacio para botones de acción
        borderWidth: 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
    },
    required: {
        color: 'red',
    },
    optional: {
        fontWeight: 'normal',
        fontSize: 12,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 48,
    },
    inputError: {
        borderColor: 'red',
    },
    inputText: {
        fontWeight: '400',
    },
    inputPlaceholder: {
        fontWeight: '400',
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
    },
    colorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingRight: 12,
    },
    colorInput: {
        flex: 1,
        height: 48,
        padding: 12,
    },
    colorPreview: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    mileageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    mileageInput: {
        flex: 1,
        height: 48,
    },
    mileageUnit: {
        marginLeft: 8,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
});

export default VehicleForm;