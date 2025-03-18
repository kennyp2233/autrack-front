// components/vehicles/add-vehicle-page/VehicleForm.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { VehicleService } from '@/api';
import { VehicleFormData } from '@/types/Vehicle';

export default function VehicleForm() {
    const router = useRouter();

    // Estados para listas de marcas y modelos
    const [brands, setBrands] = useState<Array<{ id: number, nombre: string }>>([]);
    const [models, setModels] = useState<Array<{ id: number, nombre: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingModels, setLoadingModels] = useState(false);

    // Estados para mostrar/ocultar dropdowns
    const [showBrandDropdown, setShowBrandDropdown] = useState(false);
    const [showModelDropdown, setShowModelDropdown] = useState(false);

    // Estado para el formulario
    const [formData, setFormData] = useState<VehicleFormData>({
        id_marca: 0,
        id_modelo: 0,
        anio: '',
        kilometraje_actual: '',
        placa: ''
    });

    // Estado para nombres mostrados (para UI)
    const [selectedBrandName, setSelectedBrandName] = useState('');
    const [selectedModelName, setSelectedModelName] = useState('');

    // Estado para errores
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Cargar marcas al iniciar
    useEffect(() => {
        const loadBrands = async () => {
            try {
                setLoadingBrands(true);
                const brandsData = await VehicleService.getAllBrands();
                setBrands(brandsData);
            } catch (error) {
                console.error('Error al cargar marcas:', error);
                Alert.alert('Error', 'No se pudieron cargar las marcas de vehículos');
            } finally {
                setLoadingBrands(false);
            }
        };

        loadBrands();
    }, []);

    // Función para seleccionar marca
    const handleSelectBrand = async (brand: { id: number, nombre: string }) => {
        setSelectedBrandName(brand.nombre);
        setFormData({
            ...formData,
            id_marca: brand.id,
            id_modelo: 0 // Resetear modelo al cambiar marca
        });
        setSelectedModelName('');
        setShowBrandDropdown(false);

        // Cargar modelos para esta marca
        try {
            setLoadingModels(true);
            const modelsData = await VehicleService.getModelsByBrand(brand.id);
            setModels(modelsData);
        } catch (error) {
            console.error('Error al cargar modelos:', error);
            Alert.alert('Error', 'No se pudieron cargar los modelos para esta marca');
        } finally {
            setLoadingModels(false);
        }
    };

    // Función para seleccionar modelo
    const handleSelectModel = (model: { id: number, nombre: string }) => {
        setSelectedModelName(model.nombre);
        setFormData({
            ...formData,
            id_modelo: model.id
        });
        setShowModelDropdown(false);
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.id_marca) {
            newErrors.id_marca = 'Debes seleccionar una marca';
        }

        if (!formData.id_modelo) {
            newErrors.id_modelo = 'Debes seleccionar un modelo';
        }

        if (!formData.anio) {
            newErrors.anio = 'El año es requerido';
        } else {
            const anioNum = Number(formData.anio);
            const currentYear = new Date().getFullYear();
            if (isNaN(anioNum) || anioNum < 1900 || anioNum > currentYear + 1) {
                newErrors.anio = 'Año inválido';
            }
        }

        if (!formData.kilometraje_actual) {
            newErrors.kilometraje_actual = 'El kilometraje es requerido';
        } else {
            const kmNum = Number(formData.kilometraje_actual);
            if (isNaN(kmNum) || kmNum < 0) {
                newErrors.kilometraje_actual = 'Kilometraje inválido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const vehicle = await VehicleService.createVehicle({
                id_marca: formData.id_marca,
                id_modelo: formData.id_modelo,
                anio: Number(formData.anio),
                kilometraje_actual: Number(formData.kilometraje_actual),
                placa: formData.placa || undefined
            });

            Alert.alert(
                'Éxito',
                'Vehículo agregado correctamente',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error al guardar vehículo:', error);
            Alert.alert('Error', 'No se pudo guardar el vehículo. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Para crear nueva marca si no existe
    const handleCreateBrand = async () => {
        const brandName = await promptForName('Agregar Nueva Marca', 'Nombre de la marca:');
        if (!brandName) return;

        try {
            setLoadingBrands(true);
            const newBrand = await VehicleService.createBrand(brandName);
            setBrands([...brands, newBrand]);
            handleSelectBrand(newBrand);
        } catch (error) {
            console.error('Error al crear marca:', error);
            Alert.alert('Error', 'No se pudo crear la marca');
        } finally {
            setLoadingBrands(false);
        }
    };

    // Para crear nuevo modelo si no existe
    const handleCreateModel = async () => {
        if (!formData.id_marca) {
            Alert.alert('Error', 'Primero debes seleccionar una marca');
            return;
        }

        const modelName = await promptForName('Agregar Nuevo Modelo', 'Nombre del modelo:');
        if (!modelName) return;

        try {
            setLoadingModels(true);
            const newModel = await VehicleService.createModel({
                id_marca: formData.id_marca,
                nombre: modelName
            });
            setModels([...models, newModel]);
            handleSelectModel(newModel);
        } catch (error) {
            console.error('Error al crear modelo:', error);
            Alert.alert('Error', 'No se pudo crear el modelo');
        } finally {
            setLoadingModels(false);
        }
    };

    // Función auxiliar para pedir nombre (implementación simplificada - normalmente usarías un modal propio)
    const promptForName = (title: string, message: string): Promise<string> => {
        return new Promise((resolve) => {
            Alert.prompt(
                title,
                message,
                [
                    { text: 'Cancelar', onPress: () => resolve(''), style: 'cancel' },
                    { text: 'Guardar', onPress: (name) => resolve(name || '') }
                ],
                'plain-text'
            );
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Marca<Text style={styles.required}>*</Text></Text>
                <TouchableOpacity
                    style={[styles.dropdown, errors.id_marca && styles.inputError]}
                    onPress={() => setShowBrandDropdown(!showBrandDropdown)}
                >
                    <Text style={selectedBrandName ? styles.dropdownText : styles.dropdownPlaceholder}>
                        {selectedBrandName || 'Seleccionar marca'}
                    </Text>
                    {loadingBrands ? (
                        <ActivityIndicator size="small" color="#3B82F6" />
                    ) : (
                        <Feather name="chevron-down" size={18} color="#999" />
                    )}
                </TouchableOpacity>
                {errors.id_marca && <Text style={styles.errorText}>{errors.id_marca}</Text>}

                {showBrandDropdown && (
                    <View style={styles.dropdownMenu}>
                        <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                            {brands.map(brand => (
                                <TouchableOpacity
                                    key={brand.id}
                                    style={[
                                        styles.dropdownItem,
                                        formData.id_marca === brand.id && styles.dropdownItemSelected
                                    ]}
                                    onPress={() => handleSelectBrand(brand)}
                                >
                                    <Text style={styles.dropdownItemText}>{brand.nombre}</Text>
                                    {formData.id_marca === brand.id && (
                                        <Feather name="check" size={16} color="#3B82F6" />
                                    )}
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={styles.addNewButton}
                                onPress={handleCreateBrand}
                            >
                                <Feather name="plus" size={16} color="#3B82F6" />
                                <Text style={styles.addNewButtonText}>Agregar nueva marca</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Modelo<Text style={styles.required}>*</Text></Text>
                <TouchableOpacity
                    style={[
                        styles.dropdown,
                        errors.id_modelo && styles.inputError,
                        !formData.id_marca && styles.dropdownDisabled
                    ]}
                    onPress={() => formData.id_marca && setShowModelDropdown(!showModelDropdown)}
                    disabled={!formData.id_marca}
                >
                    <Text style={selectedModelName ? styles.dropdownText : styles.dropdownPlaceholder}>
                        {selectedModelName || (formData.id_marca ? 'Seleccionar modelo' : 'Primero selecciona una marca')}
                    </Text>
                    {loadingModels ? (
                        <ActivityIndicator size="small" color="#3B82F6" />
                    ) : (
                        <Feather name="chevron-down" size={18} color="#999" />
                    )}
                </TouchableOpacity>
                {errors.id_modelo && <Text style={styles.errorText}>{errors.id_modelo}</Text>}

                {showModelDropdown && (
                    <View style={styles.dropdownMenu}>
                        <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                            {models.length > 0 ? (
                                models.map(model => (
                                    <TouchableOpacity
                                        key={model.id}
                                        style={[
                                            styles.dropdownItem,
                                            formData.id_modelo === model.id && styles.dropdownItemSelected
                                        ]}
                                        onPress={() => handleSelectModel(model)}
                                    >
                                        <Text style={styles.dropdownItemText}>{model.nombre}</Text>
                                        {formData.id_modelo === model.id && (
                                            <Feather name="check" size={16} color="#3B82F6" />
                                        )}
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={styles.noModelsText}>No hay modelos disponibles para esta marca</Text>
                            )}
                            <TouchableOpacity
                                style={styles.addNewButton}
                                onPress={handleCreateModel}
                            >
                                <Feather name="plus" size={16} color="#3B82F6" />
                                <Text style={styles.addNewButtonText}>Agregar nuevo modelo</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Año<Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={[styles.input, errors.anio && styles.inputError]}
                    placeholder="Ej. 2023"
                    value={formData.anio?.toString()}
                    onChangeText={(text) => setFormData({ ...formData, anio: text })}
                    keyboardType="number-pad"
                />
                {errors.anio && <Text style={styles.errorText}>{errors.anio}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Kilometraje<Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={[styles.input, errors.kilometraje_actual && styles.inputError]}
                    placeholder="Ej. 15000"
                    value={formData.kilometraje_actual?.toString()}
                    onChangeText={(text) => setFormData({ ...formData, kilometraje_actual: text })}
                    keyboardType="number-pad"
                />
                {errors.kilometraje_actual && <Text style={styles.errorText}>{errors.kilometraje_actual}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Placa (opcional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej. ABC-123"
                    value={formData.placa}
                    onChangeText={(text) => setFormData({ ...formData, placa: text })}
                />
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                    disabled={isLoading}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.saveButton, isLoading && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.saveButtonText}>Guardar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    formGroup: {
        marginBottom: 16,
        position: 'relative',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    required: {
        color: 'red',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    inputError: {
        borderColor: 'red',
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
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownDisabled: {
        backgroundColor: '#f0f0f0',
        borderColor: '#ccc',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownPlaceholder: {
        fontSize: 16,
        color: '#999',
    },
    dropdownMenu: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        zIndex: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownScroll: {
        maxHeight: 200,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItemSelected: {
        backgroundColor: '#e6f2ff',
    },
    dropdownItemText: {
        fontSize: 16,
    },
    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    addNewButtonText: {
        color: '#3B82F6',
        marginLeft: 8,
        fontWeight: '500',
    },
    noModelsText: {
        padding: 12,
        color: '#999',
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: 40,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginLeft: 8,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    disabledButton: {
        opacity: 0.6,
    },
});