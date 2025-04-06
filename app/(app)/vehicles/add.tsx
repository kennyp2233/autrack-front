// app/(app)/vehicles/[id]/maintenance/add.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaintenanceService } from '@/api';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useTheme } from '@/contexts/ThemeContext';

// Componentes reutilizados
import StaticHeader from '@/components/common/StaticHeader';
import { FormikContainer, FormikField, FormikDropdown, FormikButtonGroup } from '@/components/ui/formik';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';

// Definir esquema de validación usando Yup
const MaintenanceSchema = Yup.object().shape({
    id_tipo: Yup.number().required('El tipo de mantenimiento es requerido'),
    fecha: Yup.string().required('La fecha es requerida'),
    kilometraje: Yup.number()
        .required('El kilometraje es requerido')
        .min(1, 'El kilometraje debe ser mayor a 0'),
    costo: Yup.number()
        .nullable()
        .min(0, 'El costo no puede ser negativo'),
    notas: Yup.string().nullable(),
});

// Tipos de mantenimiento predefinidos para demostración
// Esto debería venir de tu API en producción
const maintenanceTypes = [
    { id: 1, label: 'Cambio de Aceite', value: 1 },
    { id: 2, label: 'Revisión de Frenos', value: 2 },
    { id: 3, label: 'Neumáticos', value: 3 },
    { id: 4, label: 'Alineación y Balanceo', value: 4 },
    { id: 5, label: 'Filtro de Aire', value: 5 },
    { id: 6, label: 'Revisión General', value: 6 },
    { id: 7, label: 'Personalizado', value: 7 }
];

export default function AddMaintenanceScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { theme } = useTheme();
    const { getVehicle, addMaintenance } = useVehicles();

    const vehicleId = Number(params.id as string);
    const vehicle = getVehicle(vehicleId);

    const [isLoading, setIsLoading] = useState(false);
    const [maintenanceCategories, setMaintenanceCategories] = useState([]);

    // Valores iniciales para el formulario
    const initialValues = {
        id_vehiculo: vehicleId,
        id_tipo: '',
        fecha: '',
        kilometraje: vehicle ? vehicle.kilometraje_actual.toString() : '',
        costo: '',
        notas: ''
    };

    // Cargar categorías y tipos de mantenimiento
    useEffect(() => {
        const loadCategories = async () => {
            try {
                // En producción, esto debería obtener datos de la API
                // const response = await MaintenanceService.getMaintenanceCategories();
                // setMaintenanceCategories(response);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        };

        loadCategories();
    }, []);

    // Manejar el envío del formulario
    const handleSubmit = async (values: { id_tipo: any; fecha: any; kilometraje: any; costo: any; notas: any; }) => {
        setIsLoading(true);
        try {
            // Preparar el objeto para enviar al backend
            const maintenanceData = {
                id_vehiculo: vehicleId,
                id_tipo: Number(values.id_tipo),
                fecha: values.fecha,
                kilometraje: Number(values.kilometraje),
                costo: values.costo ? Number(values.costo) : undefined,
                notas: values.notas
            };

            // Guardar el registro de mantenimiento
            await addMaintenance({
                vehicleId: vehicleId,
                type: maintenanceTypes.find(t => t.value === Number(values.id_tipo))?.label || 'Mantenimiento',
                date: values.fecha,
                mileage: Number(values.kilometraje),
                cost: values.costo ? Number(values.costo) : undefined,
                notes: values.notas
            });

            Alert.alert(
                'Mantenimiento registrado',
                'El registro de mantenimiento ha sido guardado exitosamente',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error al guardar mantenimiento:', error);
            Alert.alert('Error', 'No se pudo guardar el registro de mantenimiento');
        } finally {
            setIsLoading(false);
        }
    };

    if (!vehicle) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <StaticHeader title="Agregar Mantenimiento" theme={theme} />
                <View style={styles.centerContent}>
                    <Text style={{ color: theme.text }}>Vehículo no encontrado</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StaticHeader title="Agregar Mantenimiento" theme={theme} />

            <FormikContainer
                initialValues={initialValues}
                validationSchema={MaintenanceSchema}
                onSubmit={handleSubmit}
                scrollEnabled={true}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <>
                        {/* Sección: Tipo de Mantenimiento */}
                        <Card>
                            <SectionHeader
                                title="Tipo de Mantenimiento"
                                showBorder={false}
                            />

                            <FormikDropdown
                                name="id_tipo"
                                label="Selecciona el tipo de mantenimiento"
                                items={maintenanceTypes}
                                placeholder="Seleccionar tipo de mantenimiento"
                                required={true}
                            />
                        </Card>

                        {/* Sección: Fecha y Kilometraje */}
                        <Card>
                            <SectionHeader
                                title="Detalles"
                                showBorder={false}
                            />

                            <FormikField
                                name="fecha"
                                label="Fecha del mantenimiento"
                                placeholder="DD/MM/AAAA"
                                icon="calendar"
                                required={true}
                            />

                            <FormikField
                                name="kilometraje"
                                label="Kilometraje actual"
                                placeholder={`Ej. ${vehicle.kilometraje_actual}`}
                                icon="map-pin"
                                keyboardType="numeric"
                                required={true}
                            />

                            <FormikField
                                name="costo"
                                label="Costo"
                                placeholder="Ej. 150.00"
                                icon="dollar-sign"
                                keyboardType="numeric"
                            />
                        </Card>

                        {/* Sección: Notas */}
                        <Card>
                            <SectionHeader
                                title="Observaciones"
                                showBorder={false}
                            />

                            <FormikField
                                name="notas"
                                label="Notas o comentarios"
                                placeholder="Información adicional sobre el mantenimiento..."
                                icon="file-text"
                                multiline={true}
                                numberOfLines={4}
                            />
                        </Card>

                        {/* Botones de acción */}
                        <FormikButtonGroup
                            submitLabel="Guardar"
                            cancelLabel="Cancelar"
                            onCancel={() => router.back()}
                            externalLoading={isLoading}
                            sticky={true}
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
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});