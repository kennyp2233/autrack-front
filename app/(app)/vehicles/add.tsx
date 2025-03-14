import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useVehicles } from '@/contexts/VehiclesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { VehicleFormData } from '@/types/Vehicle';
import StaticHeader from '@/components/StaticHeader';
import VehicleFormHeader from '@/components/vehicles/add-vehicle-page/vehicle-form-header/VehicleFormHeader';
import VehicleForm from '@/components/vehicles/add-vehicle-page/vehicle-form/VehicleForm';
import FormActions from '@/components/vehicles/add-vehicle-page/form-actions/FormActions';

export default function AddVehicleScreen() {
    const router = useRouter();
    const { addVehicle } = useVehicles();
    const { theme } = useTheme();

    // Estado inicial del formulario
    const [vehicleData, setVehicleData] = useState<VehicleFormData>({
        brand: '',
        model: '',
        year: '',
        plate: '',
        color: '#3B82F6',
        mileage: '',
        fuelType: '',
        notes: ''
    });

    // Estado para errores de validación
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Estado para lista desplegable de marcas
    const [showBrandsList, setShowBrandsList] = useState(false);

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
            const currentYear = new Date().getFullYear();
            if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
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
            try {
                const newVehicle = addVehicle(vehicleData);

                Alert.alert(
                    'Vehículo guardado',
                    `El vehículo ${newVehicle.brand} ${newVehicle.model} ha sido guardado correctamente`,
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            } catch (error) {
                Alert.alert(
                    'Error',
                    'Ocurrió un error al guardar el vehículo. Inténtalo de nuevo.',
                    [{ text: 'OK' }]
                );
            }
        }
    };

    // Manejar cancelar
    const handleCancel = () => {
        router.back();
    };

    // Manejar selección de marca
    const handleSelectBrand = (brand: string) => {
        handleChange('brand', brand);
        setShowBrandsList(false);
    };

    // Manejar toggle de la lista de marcas
    const toggleBrandsList = () => {
        setShowBrandsList(!showBrandsList);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <StaticHeader
                title="Agregar Vehículo"
                showBackButton={true}
                theme={theme}
            />

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Form Header with Image */}
                <VehicleFormHeader theme={theme} />

                {/* Vehicle Form */}
                <VehicleForm
                    vehicleData={vehicleData}
                    errors={errors}
                    showBrandsList={showBrandsList}
                    onToggleBrandsList={toggleBrandsList}
                    onSelectBrand={handleSelectBrand}
                    onChange={handleChange}
                    theme={theme}
                />
            </ScrollView>

            {/* Form Actions */}
            <FormActions
                onCancel={handleCancel}
                onSave={handleSave}
                saveLabel="Guardar Vehículo"
                theme={theme}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
});