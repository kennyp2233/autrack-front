// app/(app)/vehicles/[id]/maintenance/add.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@/contexts/ThemeContext';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { useVehicles } from '@/contexts/VehiclesContext';
import { CreateMaintenanceRecordDto, MaintenanceType } from '@/types/Maintenance';

// Componentes
import StaticHeader from '@/components/common/StaticHeader';
import Card from '@/components/ui/Card';
import { FormikField, FormikDropdown, FormikButtonGroup } from '@/components/ui/formik';
import SectionHeader from '@/components/ui/SectionHeader';
import LoadingErrorIndicator from '@/components/common/LoadingErrorIndicator';

// Esquema de validación
const MaintenanceSchema = Yup.object().shape({
    id_tipo: Yup.number().required('Debes seleccionar un tipo de mantenimiento'),
    fecha: Yup.string().required('La fecha es requerida'),
    kilometraje: Yup.number()
        .typeError('El kilometraje debe ser un número')
        .required('El kilometraje es requerido')
        .min(1, 'El kilometraje debe ser mayor a 0'),
    costo: Yup.number()
        .typeError('El costo debe ser un número')
        .nullable()
        .min(0, 'El costo no puede ser negativo'),
    notas: Yup.string()
});

export default function AddMaintenanceScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const vehicleId = Number(params.id);

    const { theme } = useTheme();
    const { getVehicle } = useVehicles();
    const {
        types,
        categories,
        loadCategories,
        loadTypes,
        createRecord,
        isLoading,
        error
    } = useMaintenance();

    const [maintenanceTypes, setMaintenanceTypes] = useState<{ id: string, label: string, value: number }[]>([]);

    // Obtener el vehículo
    const vehicle = getVehicle(vehicleId);

    // Cargar tipos de mantenimiento
    useEffect(() => {
        const loadData = async () => {
            if (types.length === 0) {
                await loadTypes();
            }
            if (categories.length === 0) {
                await loadCategories();
            }
        };

        loadData();
    }, []);

    // Formatear tipos para el dropdown
    useEffect(() => {
        if (types.length > 0) {
            const formattedTypes = types.map(type => ({
                id: type.id_tipo.toString(),
                label: type.nombre,
                value: type.id_tipo
            }));
            setMaintenanceTypes(formattedTypes);
        }
    }, [types]);

    // Valores iniciales
    const initialValues: CreateMaintenanceRecordDto & { fecha: string } = {
        id_vehiculo: vehicleId,
        id_tipo: 0,
        fecha: '',
        kilometraje: vehicle ? vehicle.kilometraje_actual : 0,
        costo: undefined,
        notas: ''
    };

    // Manejar envío del formulario
    const handleSubmit = async (values: typeof initialValues) => {
        try {
            // Crear nuevo registro
            await createRecord({
                ...values,
                id_tipo: Number(values.id_tipo),
                kilometraje: Number(values.kilometraje),
                costo: values.costo ? Number(values.costo) : undefined
            });

            Alert.alert(
                "Mantenimiento registrado",
                "El registro de mantenimiento ha sido guardado exitosamente",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error al guardar mantenimiento:', error);
        }
    };

    if (!vehicle) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <StaticHeader title="Agregar Mantenimiento" theme={theme} />
                <View style={styles.contentCenter}>
                    <LoadingErrorIndicator
                        isLoading={false}
                        error="No se pudo encontrar el vehículo especificado"
                        theme={theme}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StaticHeader title="Agregar Mantenimiento" theme={theme} />

            {/* Indicador de carga o error */}
            <LoadingErrorIndicator
                isLoading={isLoading && !maintenanceTypes.length}
                error={error}
                onRetry={() => {
                    loadTypes();
                    loadCategories();
                }}
                theme={theme}
            />

            <Formik
                initialValues={initialValues}
                validationSchema={MaintenanceSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ handleSubmit }) => (
                    <ScrollView
                        style={styles.content}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Sección de Tipo de Mantenimiento */}
                        <Card>
                            <SectionHeader title="Tipo de Mantenimiento" showBorder={false} />

                            <FormikDropdown
                                name="id_tipo"
                                label="Tipo de mantenimiento"
                                items={maintenanceTypes}
                                placeholder="Selecciona un tipo de mantenimiento"
                                required
                                loading={isLoading && !maintenanceTypes.length}
                                emptyListMessage="No hay tipos de mantenimiento disponibles"
                            />
                        </Card>

                        {/* Sección de Detalles */}
                        <Card>
                            <SectionHeader title="Detalles del Mantenimiento" showBorder={false} />

                            <FormikField
                                name="fecha"
                                label="Fecha del mantenimiento"
                                placeholder="DD/MM/AAAA"
                                icon="calendar"
                                required
                            />

                            <FormikField
                                name="kilometraje"
                                label="Kilometraje actual"
                                placeholder={`Kilómetros actuales (Ej: ${vehicle.kilometraje_actual})`}
                                icon="map-pin"
                                keyboardType="numeric"
                                required
                            />

                            <FormikField
                                name="costo"
                                label="Costo"
                                placeholder="Costo del mantenimiento (Opcional)"
                                icon="dollar-sign"
                                keyboardType="numeric"
                            />
                        </Card>

                        {/* Sección de Notas */}
                        <Card>
                            <SectionHeader title="Notas" showBorder={false} />

                            <FormikField
                                name="notas"
                                label="Notas adicionales"
                                placeholder="Detalles adicionales sobre el mantenimiento (Opcional)"
                                icon="file-text"
                                multiline
                                numberOfLines={4}
                            />
                        </Card>

                        {/* Botones de acción */}
                        <FormikButtonGroup
                            submitLabel="Guardar"
                            cancelLabel="Cancelar"
                            onCancel={() => router.back()}
                            externalLoading={isLoading}
                        />
                    </ScrollView>
                )}
            </Formik>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    contentCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});