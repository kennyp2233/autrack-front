// components/vehicles/add-vehicle-page/vehicle-form/VehicleForm.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Yup from 'yup';
import { useTheme } from '@/contexts/ThemeContext';
import { VehicleFormData } from '@/types/Vehicle';
import { VehicleService } from '@/api';
import { useVehicles } from '@/contexts/VehiclesContext';

// Componentes UI
import Card from '@/components/ui/Card';
import SectionHeader from '@/components/ui/SectionHeader';
import LoadingErrorIndicator from '@/components/common/LoadingErrorIndicator';
import {
    FormikContainer,
    FormikField,
    FormikDropdown,
    FormikButtonGroup,
    DropdownItem
} from '@/components/ui/formik';
import VehicleFormHeader from '@/components/vehicles/add-vehicle-page/vehicle-form-header/VehicleFormHeader';

// Esquema de validación
const VehicleSchema = Yup.object().shape({
    brand: Yup.number().required('La marca es requerida'),
    model: Yup.number().required('El modelo es requerido'),
    year: Yup.number()
        .typeError('El año debe ser un número')
        .required('El año es requerido')
        .min(1900, 'Año inválido')
        .max(new Date().getFullYear() + 1, 'Año inválido'),
    mileage: Yup.number()
        .typeError('El kilometraje debe ser un número')
        .required('El kilometraje es requerido')
        .min(0, 'El kilometraje no puede ser negativo'),
    plate: Yup.string(),
});

// Definir el tipo para los valores del formulario
interface FormValues {
    brand: number | '';
    model: number | '';
    year: string;
    mileage: string;
    plate: string;
}

export default function VehicleForm() {
    const router = useRouter();
    const { theme } = useTheme();
    const { refreshData } = useVehicles();

    // Estados
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [brands, setBrands] = useState<DropdownItem[]>([]);
    const [models, setModels] = useState<DropdownItem[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingModels, setLoadingModels] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

    // Valores iniciales del formulario
    const initialValues: FormValues = {
        brand: '',
        model: '',
        year: '',
        mileage: '',
        plate: ''
    };

    // Cargar marcas al iniciar
    useEffect(() => {
        const loadBrands = async () => {
            try {
                setLoadingBrands(true);
                setError(null);
                const brandsData = await VehicleService.getAllBrands();

                // Formatear para el dropdown
                const formattedBrands = brandsData.map(brand => ({
                    id: brand.id_marca.toString(),
                    label: brand.nombre,
                    value: brand.id_marca
                }));

                setBrands(formattedBrands);
            } catch (err) {
                console.error('Error al cargar marcas:', err);
                setError('No se pudieron cargar las marcas de vehículos');
            } finally {
                setLoadingBrands(false);
            }
        };

        loadBrands();
    }, []);

    // Cargar modelos cuando se selecciona una marca
    const loadModels = async (brandId: number) => {
        if (!brandId) return;

        try {
            setLoadingModels(true);
            setError(null);
            const modelsData = await VehicleService.getModelsByBrand(brandId);

            // Formatear para el dropdown
            const formattedModels = modelsData.map(model => ({
                id: model.id_modelo.toString(),
                label: model.nombre,
                value: model.id_modelo
            }));

            setModels(formattedModels);
        } catch (err) {
            console.error('Error al cargar modelos:', err);
            setError('No se pudieron cargar los modelos para esta marca');
        } finally {
            setLoadingModels(false);
        }
    };

    // Manejar cambio de marca
    const handleBrandChange = (item: DropdownItem) => {
        setSelectedBrand(item.value as number);
        loadModels(item.value as number);
    };

    // Crear nueva marca
    const handleAddBrand = async () => {
        Alert.prompt(
            'Agregar Nueva Marca',
            'Nombre de la marca:',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Guardar',
                    onPress: async (name) => {
                        if (!name) return;

                        try {
                            setLoadingBrands(true);
                            const newBrand = await VehicleService.createBrand(name);

                            // Agregar a la lista de marcas
                            const brandItem = {
                                id: newBrand.id_marca.toString(),
                                label: newBrand.nombre,
                                value: newBrand.id_marca
                            };

                            setBrands(prev => [...prev, brandItem]);
                            setSelectedBrand(newBrand.id_marca);
                            loadModels(newBrand.id_marca);
                        } catch (err) {
                            console.error('Error al crear marca:', err);
                            Alert.alert('Error', 'No se pudo crear la marca');
                        } finally {
                            setLoadingBrands(false);
                        }
                    }
                }
            ],
            'plain-text'
        );
    };

    // Crear nuevo modelo
    const handleAddModel = async () => {
        if (!selectedBrand) {
            Alert.alert('Error', 'Primero debes seleccionar una marca');
            return;
        }

        Alert.prompt(
            'Agregar Nuevo Modelo',
            'Nombre del modelo:',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Guardar',
                    onPress: async (name) => {
                        if (!name) return;

                        try {
                            setLoadingModels(true);
                            const newModel = await VehicleService.createModel({
                                id_marca: selectedBrand,
                                nombre: name
                            });

                            // Agregar a la lista de modelos
                            const modelItem = {
                                id: newModel.id_modelo.toString(),
                                label: newModel.nombre,
                                value: newModel.id_modelo
                            };

                            setModels(prev => [...prev, modelItem]);
                        } catch (err) {
                            console.error('Error al crear modelo:', err);
                            Alert.alert('Error', 'No se pudo crear el modelo');
                        } finally {
                            setLoadingModels(false);
                        }
                    }
                }
            ],
            'plain-text'
        );
    };

    // Manejar envío del formulario
    const handleSubmit = async (values: FormValues) => {
        try {
            setIsLoading(true);
            setError(null);

            // Mapear los valores del formulario al formato esperado por la API
            const vehicleData: VehicleFormData = {
                id_marca: values.brand as number,
                id_modelo: values.model as number,
                anio: Number(values.year),
                kilometraje_actual: Number(values.mileage),
                placa: values.plate
            };

            // Llamar al servicio para crear el vehículo
            await VehicleService.createVehicle(vehicleData);

            // Actualizar datos
            await refreshData();

            // Mostrar mensaje de éxito y navegar
            Alert.alert(
                'Vehículo Agregado',
                'El vehículo ha sido registrado exitosamente',
                [{ text: 'OK', onPress: () => router.replace('/vehicles') }]
            );
        } catch (err) {
            console.error('Error al guardar vehículo:', err);
            const errorMessage = err instanceof Error ? err.message : 'No se pudo guardar el vehículo';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LoadingErrorIndicator
                isLoading={isLoading && !error}
                error={error}
                onRetry={() => setError(null)}
                theme={theme}
            />

            <FormikContainer
                initialValues={initialValues}
                validationSchema={VehicleSchema}
                onSubmit={handleSubmit}
                scrollEnabled={true}
            >
                {({ setFieldValue }) => (
                    <>
                        {/* Cabecera con imagen del vehículo (opcional) */}
                        <VehicleFormHeader
                            theme={theme}
                            onImagePress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                        />

                        {/* Sección: Marca y Modelo */}
                        <Card>
                            <SectionHeader title="Marca y Modelo" showBorder={false} />

                            <FormikDropdown
                                name="brand"
                                label="Marca"
                                items={brands}
                                placeholder="Selecciona una marca"
                                loading={loadingBrands}
                                required={true}
                                showAddNew={true}
                                onAddNew={handleAddBrand}
                                addNewLabel="Agregar nueva marca"
                                onSelect={(item) => {
                                    handleBrandChange(item);
                                    setFieldValue('model', ''); // Resetear modelo al cambiar marca
                                }}
                            />

                            <FormikDropdown
                                name="model"
                                label="Modelo"
                                items={models}
                                placeholder={selectedBrand ? "Selecciona un modelo" : "Primero selecciona una marca"}
                                loading={loadingModels}
                                required={true}
                                disabled={!selectedBrand}
                                showAddNew={true}
                                onAddNew={handleAddModel}
                                addNewLabel="Agregar nuevo modelo"
                                emptyListMessage="No hay modelos disponibles para esta marca"
                            />
                        </Card>

                        {/* Sección: Detalles */}
                        <Card>
                            <SectionHeader title="Detalles del Vehículo" showBorder={false} />

                            <FormikField
                                name="year"
                                label="Año"
                                placeholder="Ej. 2023"
                                keyboardType="numeric"
                                icon="calendar"
                                required={true}
                            />

                            <FormikField
                                name="mileage"
                                label="Kilometraje"
                                placeholder="Ej. 15000"
                                keyboardType="numeric"
                                icon="map-pin"
                                required={true}
                            />

                            <FormikField
                                name="plate"
                                label="Placa"
                                placeholder="Ej. ABC-123"
                                icon="truck"
                                optional={true}
                            />
                        </Card>

                        {/* Botones de acción */}
                        <FormikButtonGroup
                            submitLabel="Guardar"
                            cancelLabel="Cancelar"
                            onCancel={() => router.back()}
                            externalLoading={isLoading}
                        />
                    </>
                )}
            </FormikContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});