import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { VehicleFormData } from '@/types/Vehicle';

export default function AddVehicleScreen() {
    const router = useRouter();

    const [vehicleData, setVehicleData] = useState<VehicleFormData>({
        brand: '',
        model: '',
        year: '',
        plate: '',
        color: '#3B82F6',
        mileage: '',
        notes: ''
    });

    const [showBrandsList, setShowBrandsList] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Lista de marcas populares
    const popularBrands = [
        'Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet',
        'Nissan', 'Hyundai', 'Kia', 'Mazda', 'BMW', 'Mercedes-Benz'
    ];

    // Manejar cambios en inputs
    const handleChange = (name: string, value: string) => {
        setVehicleData({
            ...vehicleData,
            [name]: value
        });

        // Limpiar error si existe
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    // Seleccionar marca
    const selectBrand = (brand: string) => {
        handleChange('brand', brand);
        setShowBrandsList(false);
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!vehicleData.brand) {
            newErrors.brand = 'La marca es requerida';
        }

        if (!vehicleData.model) {
            newErrors.model = 'El modelo es requerido';
        }

        if (!vehicleData.year) {
            newErrors.year = 'El año es requerido';
        } else {
            const yearNum = Number(vehicleData.year);
            if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
                newErrors.year = 'Año inválido';
            }
        }

        if (!vehicleData.mileage) {
            newErrors.mileage = 'El kilometraje es requerido';
        } else {
            const mileageNum = Number(vehicleData.mileage);
            if (isNaN(mileageNum) || mileageNum < 0) {
                newErrors.mileage = 'Kilometraje inválido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar guardar vehículo
    const handleSave = () => {
        if (validateForm()) {
            // Aquí iría la lógica para guardar el vehículo en la base de datos
            Alert.alert(
                'Vehículo guardado',
                'El vehículo se ha guardado correctamente',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Agregar Vehículo</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Vehicle Image */}
                <TouchableOpacity style={styles.imageContainer}>
                    <Feather name="camera" size={32} color="#3B82F6" />
                    <Text style={styles.imageText}>Agregar foto</Text>
                </TouchableOpacity>

                {/* Form */}
                <View style={styles.form}>
                    {/* Brand Field */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Marca <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity
                            style={[styles.input, errors.brand && styles.inputError]}
                            onPress={() => setShowBrandsList(!showBrandsList)}
                        >
                            <Text style={vehicleData.brand ? styles.inputText : styles.inputPlaceholder}>
                                {vehicleData.brand || 'Selecciona una marca'}
                            </Text>
                            <Feather name={showBrandsList ? "chevron-up" : "chevron-down"} size={20} color="#999" />
                        </TouchableOpacity>
                        {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}

                        {/* Brands Dropdown */}
                        {showBrandsList && (
                            <View style={styles.dropdown}>
                                {popularBrands.map((brand) => (
                                    <TouchableOpacity
                                        key={brand}
                                        style={styles.dropdownItem}
                                        onPress={() => selectBrand(brand)}
                                    >
                                        <Text>{brand}</Text>
                                        {vehicleData.brand === brand && (
                                            <Feather name="check" size={16} color="#3B82F6" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity style={styles.dropdownItemAdd}>
                                    <Text style={styles.dropdownItemAddText}>+ Agregar otra marca</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Model Field */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Modelo <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={[styles.input, errors.model && styles.inputError]}
                            placeholder="Ej. Corolla"
                            value={vehicleData.model?.toString()}
                            onChangeText={(text) => handleChange('model', text)}
                        />
                        {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
                    </View>

                    {/* Year Field */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Año <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={[styles.input, errors.year && styles.inputError]}
                            placeholder="Ej. 2022"
                            value={vehicleData.year?.toString()}
                            onChangeText={(text) => handleChange('year', text)}
                            keyboardType="number-pad"
                        />
                        {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
                    </View>

                    {/* Plate Field */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Número de Placa <Text style={styles.optional}>(Opcional)</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. ABC-1234"
                            value={vehicleData.plate}
                            onChangeText={(text) => handleChange('plate', text)}
                        />
                    </View>

                    {/* Color Field */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Color</Text>
                        <View style={styles.colorContainer}>
                            <TextInput
                                style={styles.colorInput}
                                value={vehicleData.color}
                                onChangeText={(text) => handleChange('color', text)}
                            />
                            <View
                                style={[styles.colorPreview, { backgroundColor: vehicleData.color }]}
                            />
                        </View>
                    </View>

                    {/* Mileage Field */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Kilometraje Actual <Text style={styles.required}>*</Text></Text>
                        <View style={styles.mileageContainer}>
                            <TextInput
                                style={[styles.input, errors.mileage && styles.inputError]}
                                placeholder="Ej. 25000"
                                value={vehicleData.mileage?.toString()}
                                onChangeText={(text) => handleChange('mileage', text)}
                                keyboardType="number-pad"
                            />
                            <Text style={styles.mileageUnit}>km</Text>
                        </View>
                        {errors.mileage && <Text style={styles.errorText}>{errors.mileage}</Text>}
                    </View>

                    {/* Notes Field */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Notas <Text style={styles.optional}>(Opcional)</Text></Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Información adicional sobre el vehículo..."
                            value={vehicleData.notes}
                            onChangeText={(text) => handleChange('notes', text)}
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Guardar Vehículo</Text>
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
    backButton: {
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
        backgroundColor: '#EBF5FF',
        borderRadius: 8,
        marginBottom: 20,
    },
    imageText: {
        marginTop: 8,
        color: '#3B82F6',
    },
    form: {
        flex: 1,
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
        color: '#999',
        fontWeight: 'normal',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputError: {
        borderColor: 'red',
    },
    inputText: {
        color: '#000',
    },
    inputPlaceholder: {
        color: '#999',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: 12,
    },
    dropdown: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginTop: 4,
        maxHeight: 200,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemAdd: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    dropdownItemAddText: {
        color: '#3B82F6',
    },
    colorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginRight: 12,
        flex: 1,
    },
    colorPreview: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    mileageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mileageUnit: {
        position: 'absolute',
        right: 12,
        color: '#999',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
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
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#666',
    },
    saveButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 8,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});