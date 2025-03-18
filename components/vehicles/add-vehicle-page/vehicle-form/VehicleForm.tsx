// components/vehicles/add-vehicle-page/vehicle-form/VehicleForm.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { VehicleFormData } from '@/types/Vehicle';
import { VehicleService } from '@/api';
import { useVehicles } from '@/contexts/VehiclesContext';

export default function VehicleForm() {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const { refreshData } = useVehicles();
    // Estados para listas de marcas y modelos
    const [brands, setBrands] = useState<Array<{ id_marca: number, nombre: string }>>([]);
    const [models, setModels] = useState<Array<{ id_modelo: number, nombre: string }>>([]);
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
    const handleSelectBrand = async (brand: { id_marca: number, nombre: string }) => {
        setSelectedBrandName(brand.nombre);
        setFormData({
            ...formData,
            id_marca: brand.id_marca,
            id_modelo: 0 // Resetear modelo al cambiar marca
        });
        setSelectedModelName('');
        setShowBrandDropdown(false);

        // Cargar modelos para esta marca
        try {
            setLoadingModels(true);
            const modelsData = await VehicleService.getModelsByBrand(brand.id_marca);
            setModels(modelsData);

            // Aquí es crucial cerrar el dropdown de marca para evitar problemas de interfaz
            setTimeout(() => {
                setShowBrandDropdown(false);
            }, 100);
        } catch (error) {
            console.error('Error al cargar modelos:', error);
            Alert.alert('Error', 'No se pudieron cargar los modelos para esta marca');
        } finally {
            setLoadingModels(false);
        }
    };

    // Función para seleccionar modelo
    const handleSelectModel = (model: { id_modelo: number, nombre: string }) => {
        setSelectedModelName(model.nombre);
        setFormData({
            ...formData,
            id_modelo: model.id_modelo
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

            await refreshData(); // Asegúrate de que esta función esté disponible desde el contexto

            Alert.alert(
                'Éxito',
                'Vehículo agregado correctamente',
                [{ text: 'OK', onPress: () => router.replace('/vehicles') }]
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

    // Definir colores basados en el tema
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const backgroundColor = theme.background;
    const cardColor = theme.card;
    const borderColor = theme.border;
    const primaryColor = theme.primary;
    const dangerColor = theme.danger;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor }]}
            keyboardShouldPersistTaps="handled" // Esto evita que el teclado cierre los dropdowns
        >
            <View style={styles.brandSelectorGroup}>
                <Text style={[styles.label, { color: textColor }]}>Marca<Text style={styles.required}>*</Text></Text>
                <TouchableOpacity
                    style={[
                        styles.dropdown,
                        errors.id_marca && { borderColor: dangerColor },
                        { borderColor, backgroundColor: cardColor }
                    ]}
                    onPress={() => setShowBrandDropdown(!showBrandDropdown)}
                >
                    <Text style={[
                        selectedBrandName ? styles.dropdownText : styles.dropdownPlaceholder,
                        { color: selectedBrandName ? textColor : secondaryTextColor }
                    ]}>
                        {selectedBrandName || 'Seleccionar marca'}
                    </Text>
                    {loadingBrands ? (
                        <ActivityIndicator size="small" color={primaryColor} />
                    ) : (
                        <Feather name="chevron-down" size={18} color={secondaryTextColor} />
                    )}
                </TouchableOpacity>
                {errors.id_marca && <Text style={[styles.errorText, { color: dangerColor }]}>{errors.id_marca}</Text>}

                {showBrandDropdown && (
                    <View style={[styles.dropdownMenu, { backgroundColor: cardColor, borderColor }]}>
                        <ScrollView
                            style={styles.dropdownScroll}
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                        >
                            {brands.map(brand => (
                                <TouchableOpacity
                                    key={brand.id_marca}
                                    style={[
                                        styles.dropdownItem,
                                        formData.id_marca === brand.id_marca && { backgroundColor: `${primaryColor}15` },
                                        { borderBottomColor: borderColor }
                                    ]}
                                    onPress={() => handleSelectBrand(brand)}
                                >
                                    <Text style={{ color: textColor }}>{brand.nombre}</Text>
                                    {formData.id_marca === brand.id_marca && (
                                        <Feather name="check" size={16} color={primaryColor} />
                                    )}
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={[styles.addNewButton, { borderTopColor: borderColor }]}
                                onPress={handleCreateBrand}
                            >
                                <Feather name="plus" size={16} color={primaryColor} />
                                <Text style={[styles.addNewButtonText, { color: primaryColor }]}>Agregar nueva marca</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}
            </View>

            <View style={styles.modelSelectorGroup}>
                <Text style={[styles.label, { color: textColor }]}>Modelo<Text style={styles.required}>*</Text></Text>
                <TouchableOpacity
                    style={[
                        styles.dropdown,
                        errors.id_modelo && { borderColor: dangerColor },
                        !formData.id_marca && styles.dropdownDisabled,
                        { borderColor, backgroundColor: cardColor }
                    ]}
                    onPress={() => formData.id_marca && setShowModelDropdown(!showModelDropdown)}
                    disabled={!formData.id_marca}
                >
                    <Text style={[
                        selectedModelName ? styles.dropdownText : styles.dropdownPlaceholder,
                        { color: selectedModelName ? textColor : secondaryTextColor }
                    ]}>
                        {selectedModelName || (formData.id_marca ? 'Seleccionar modelo' : 'Primero selecciona una marca')}
                    </Text>
                    {loadingModels ? (
                        <ActivityIndicator size="small" color={primaryColor} />
                    ) : (
                        <Feather name="chevron-down" size={18} color={secondaryTextColor} />
                    )}
                </TouchableOpacity>
                {errors.id_modelo && <Text style={[styles.errorText, { color: dangerColor }]}>{errors.id_modelo}</Text>}

                {showModelDropdown && (
                    <View style={[styles.dropdownMenu, { backgroundColor: cardColor, borderColor }]}>
                        <ScrollView
                            style={styles.dropdownScroll}
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                        >
                            {models.length > 0 ? (
                                models.map(model => (
                                    <TouchableOpacity
                                        key={model.id_modelo}
                                        style={[
                                            styles.dropdownItem,
                                            formData.id_modelo === model.id_modelo && { backgroundColor: `${primaryColor}15` },
                                            { borderBottomColor: borderColor }
                                        ]}
                                        onPress={() => handleSelectModel(model)}
                                    >
                                        <Text style={{ color: textColor }}>{model.nombre}</Text>
                                        {formData.id_modelo === model.id_modelo && (
                                            <Feather name="check" size={16} color={primaryColor} />
                                        )}
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={[styles.noModelsText, { color: secondaryTextColor }]}>
                                    No hay modelos disponibles para esta marca
                                </Text>
                            )}
                            <TouchableOpacity
                                style={[styles.addNewButton, { borderTopColor: borderColor }]}
                                onPress={handleCreateModel}
                            >
                                <Feather name="plus" size={16} color={primaryColor} />
                                <Text style={[styles.addNewButtonText, { color: primaryColor }]}>Agregar nuevo modelo</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}
            </View>

            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>Año<Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={[
                        styles.input,
                        errors.anio && { borderColor: dangerColor },
                        { borderColor, backgroundColor: cardColor, color: textColor }
                    ]}
                    placeholder="Ej. 2023"
                    placeholderTextColor={secondaryTextColor}
                    value={formData.anio?.toString()}
                    onChangeText={(text) => setFormData({ ...formData, anio: text })}
                    keyboardType="numeric"
                />
                {errors.anio && <Text style={[styles.errorText, { color: dangerColor }]}>{errors.anio}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>Kilometraje<Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={[
                        styles.input,
                        errors.kilometraje_actual && { borderColor: dangerColor },
                        { borderColor, backgroundColor: cardColor, color: textColor }
                    ]}
                    placeholder="Ej. 15000"
                    placeholderTextColor={secondaryTextColor}
                    value={formData.kilometraje_actual?.toString()}
                    onChangeText={(text) => setFormData({ ...formData, kilometraje_actual: text })}
                    keyboardType="numeric"
                />
                {errors.kilometraje_actual && <Text style={[styles.errorText, { color: dangerColor }]}>{errors.kilometraje_actual}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>Placa (opcional)</Text>
                <TextInput
                    style={[
                        styles.input,
                        { borderColor, backgroundColor: cardColor, color: textColor }
                    ]}
                    placeholder="Ej. ABC-123"
                    placeholderTextColor={secondaryTextColor}
                    value={formData.placa}
                    onChangeText={(text) => setFormData({ ...formData, placa: text })}
                />
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.cancelButton, { backgroundColor: isDark ? '#333' : '#f5f5f5' }]}
                    onPress={() => router.back()}
                    disabled={isLoading}
                >
                    <Text style={[styles.cancelButtonText, { color: secondaryTextColor }]}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: primaryColor }, isLoading && styles.disabledButton]}
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
    },
    // Primera marca tiene mayor z-index para aparecer sobre los demás campos
    brandSelectorGroup: {
        marginBottom: 16,
        position: 'relative',
        zIndex: 10, // Mayor que otros campos para asegurar que aparezca por encima
    },
    // Modelo tiene z-index intermedio
    modelSelectorGroup: {
        marginBottom: 16,
        position: 'relative',
        zIndex: 9, // Menor que marca pero mayor que otros campos
    },
    formGroup: {
        marginBottom: 16,
        position: 'relative',
        zIndex: 2, // Higher z-index for dropdown positioning
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
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        height: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownDisabled: {
        opacity: 0.7,
    },
    dropdownText: {
        fontSize: 16,
    },
    dropdownPlaceholder: {
        fontSize: 16,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 80, // Position below the dropdown selector
        left: 0,
        right: 0,
        borderWidth: 1,
        borderRadius: 8,
        zIndex: 999, // Very high to ensure it's above everything
        elevation: 9, // Higher elevation for Android
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dropdownScroll: {
        maxHeight: 200,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
    },
    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderTopWidth: 1,
    },
    addNewButtonText: {
        marginLeft: 8,
        fontWeight: '500',
    },
    noModelsText: {
        padding: 12,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: 40,
    },
    cancelButton: {
        flex: 1,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        fontWeight: '500',
    },
    saveButton: {
        flex: 1,
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