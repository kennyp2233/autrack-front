// app/(app)/vehicles/[id]/maintenance/add.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Yup from 'yup';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { CreateMaintenanceRecordDto } from '@/types/Maintenance';

// Componentes reutilizados
import StaticHeader from '@/components/common/StaticHeader';
import { FormikContainer, FormikField, FormikDropdown, FormikButtonGroup } from '@/components/ui/formik';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import LoadingErrorIndicator from '@/components/common/LoadingErrorIndicator';

// Definir esquema de validación usando Yup
const MaintenanceSchema = Yup.object().shape({
    id_tipo: Yup.number().required('El tipo de mantenimiento es requerido'),
    fecha: Yup.string().required('La fecha es requerida'),
    kilometraje: Yup.number()
        .typeError('El kilometraje debe ser un número')
        .required('El kilometraje es requerido')
        .min(1, 'El kilometraje debe ser mayor a 0'),
    costo: Yup.number()
        .typeError('El costo debe ser un número')
        .nullable()
        .min(0, 'El costo no puede ser negativo'),
    notas: Yup.string().nullable(),
});

export default function AddMaintenanceScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { theme } = useTheme();
    const { getVehicle, addMaintenance } = useVehicles();
    const { types, loadTypes, isLoading: isMaintenanceLoading, error: maintenanceError } = useMaintenance();

    const vehicleId = Number(params.id as string);
    const vehicle = getVehicle(vehicleId);

    const [isLoading, setIsLoading] = useState(false);
    const [maintenanceTypes, setMaintenanceTypes] = useState<{ id: string, label: string, value: number }[]>([]);

    // Cargar tipos de mantenimiento
    useEffect(() => {
        const loadData = async () => {
            if (types.length === 0) {
                await loadTypes();
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

    // Valores iniciales para el formulario
    const initialValues = {
        id_vehiculo: vehicleId,
        id_tipo: '',
        fecha: '',
        kilometraje: vehicle ? vehicle.kilometraje_actual.toString() : '',
        costo: '',
        notas: ''
    };

    // Manejar el envío del formulario
    const handleSubmit = async (values: any) => {
        setIsLoading(true);
        try {
            // Preparar el objeto para enviar al backend
            const maintenanceData: CreateMaintenanceRecordDto = {
                id_vehiculo: vehicleId,
                id_tipo: Number(values.id_tipo),
                fecha: values.fecha,
                kilometraje: Number(values.kilometraje),
                costo: values.costo ? Number(values.costo) : undefined,
                notas: values.notas
            };

            // Guardar el registro de mantenimiento
            await addMaintenance(maintenanceData);

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
                isLoading={isMaintenanceLoading && !maintenanceTypes.length}
                error={maintenanceError}
                onRetry={loadTypes}
                theme={theme}
            />

            <FormikContainer
                initialValues={initialValues}
                validationSchema={MaintenanceSchema}
                onSubmit={handleSubmit}
                scrollEnabled={true}
            >
                {() => (
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
                                items={maintenanceTypes.length > 0 ? maintenanceTypes : []}
                                placeholder="Seleccionar tipo de mantenimiento"
                                required={true}
                                loading={isMaintenanceLoading && !maintenanceTypes.length}
                                emptyListMessage="No hay tipos de mantenimiento disponibles"
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