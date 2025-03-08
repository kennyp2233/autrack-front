import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { MaintenanceFormData, MaintenanceType } from '@/types/Maintenance';

// Datos de ejemplo
const vehiclesData = {
    '1': {
        id: 1,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2019,
        plate: 'ABC-123',
        mileage: 35000,
    },
    '2': {
        id: 2,
        brand: 'Honda',
        model: 'Civic',
        year: 2020,
        plate: 'XYZ-789',
        mileage: 28000,
    }
};

export default function AddMaintenanceScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const vehicleId = Number(params.id as string);

    // Obtener datos del vehículo
    const vehicle = vehiclesData[vehicleId.toString() as keyof typeof vehiclesData];

    // Estado para expandir secciones
    const [expandedSection, setExpandedSection] = useState('type');

    // Estado para datos del mantenimiento
    const [maintenanceData, setMaintenanceData] = useState<MaintenanceFormData>({
        vehicleId,
        type: '',
        date: '',
        time: '',
        mileage: vehicle?.mileage.toString() || '',
        cost: '',
        location: '',
        notes: '',
        photos: []
    });

    // Estado para validación
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Estado para pasos completados
    const [completedSections, setCompletedSections] = useState({
        type: false,
        date: false,
        details: false
    });

    // Tipos de mantenimiento predefinidos
    const maintenanceTypes: MaintenanceType[] = [
        { id: 'oil', name: 'Cambio de Aceite', icon: '🔧', color: 'bg-blue-100' },
        { id: 'brakes', name: 'Revisión de Frenos', icon: '🛑', color: 'bg-red-100' },
        { id: 'tires', name: 'Neumáticos', icon: '🔄', color: 'bg-gray-100' },
        { id: 'alignment', name: 'Alineación y Balanceo', icon: '⚙️', color: 'bg-green-100' },
        { id: 'airfilter', name: 'Filtro de Aire', icon: '💨', color: 'bg-purple-100' },
        { id: 'general', name: 'Revisión General', icon: '🔍', color: 'bg-yellow-100' },
        { id: 'custom', name: 'Personalizado', icon: '➕', color: 'bg-gray-100' }
    ];

    // Manejar cambios en los campos
    const handleChange = (name: string, value: string) => {
        setMaintenanceData({
            ...maintenanceData,
            [name]: value
        });

        // Limpiar error si existe
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    // Seleccionar tipo de mantenimiento
    const selectMaintenanceType = (typeId: string) => {
        const selectedType = maintenanceTypes.find(type => type.id === typeId);

        setMaintenanceData({
            ...maintenanceData,
            type: selectedType ? selectedType.name : ''
        });

        // Marcar sección como completada
        setCompletedSections({
            ...completedSections,
            type: true
        });

        // Expandir siguiente sección
        setExpandedSection('date');
    };

    // Completar sección de fecha
    const completeDateSection = () => {
        if (!maintenanceData.date) {
            setErrors({
                ...errors,
                date: 'La fecha es requerida'
            });
            return;
        }

        // Marcar sección como completada
        setCompletedSections({
            ...completedSections,
            date: true
        });

        // Expandir siguiente sección
        setExpandedSection('details');
    };

    // Validar el formulario completo
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!maintenanceData.type) {
            newErrors.type = 'Selecciona un tipo de mantenimiento';
        }

        if (!maintenanceData.date) {
            newErrors.date = 'La fecha es requerida';
        }

        if (!maintenanceData.mileage) {
            newErrors.mileage = 'El kilometraje es requerido';
        } else {
            const mileageNum = Number(maintenanceData.mileage);
            if (isNaN(mileageNum) || mileageNum <= 0) {
                newErrors.mileage = 'Introduce un kilometraje válido';
            }
        }

        if (maintenanceData.cost) {
            const costNum = Number(maintenanceData.cost);
            if (isNaN(costNum) || costNum < 0) {
                newErrors.cost = 'Introduce un costo válido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = () => {
        if (validateForm()) {
            // Aquí iría la lógica para guardar el mantenimiento
            Alert.alert(
                'Mantenimiento guardado',
                'El mantenimiento se ha registrado correctamente',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }
    };

    // Función para añadir fotos
    const handleAddPhoto = () => {
        const newPhotos = [...maintenanceData.photos || []];
        newPhotos.push(`photo-${Date.now()}.jpg`);

        setMaintenanceData({
            ...maintenanceData,
            photos: newPhotos
        });
    };

    // Función para eliminar fotos
    const handleRemovePhoto = (index: number) => {
        const newPhotos = maintenanceData.photos?.filter((_, i) => i !== index);

        setMaintenanceData({
            ...maintenanceData,
            photos: newPhotos
        });
    };

    if (!vehicle) {
        return (
            <View style={styles.container}>
                <Text>Vehículo no encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Registrar Mantenimiento</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Section: Maintenance Type */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => setExpandedSection(expandedSection === 'type' ? '' : 'type')}
                    >
                        <View style={styles.sectionTitle}>
                            <View style={styles.sectionNumber}>
                                <Text style={styles.sectionNumberText}>1</Text>
                            </View>
                            <Text style={styles.sectionTitleText}>Tipo de Mantenimiento</Text>
                        </View>
                        {completedSections.type ? (
                            <Feather name="check" size={20} color="green" />
                        ) : (
                            <Feather name={expandedSection === 'type' ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
                        )}
                    </TouchableOpacity>

                    {expandedSection === 'type' && (
                        <View style={styles.sectionContent}>
                            <View style={styles.maintenanceTypesGrid}>
                                {maintenanceTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type.id}
                                        style={[
                                            styles.maintenanceTypeItem,
                                            maintenanceData.type === type.name && styles.maintenanceTypeItemSelected
                                        ]}
                                        onPress={() => selectMaintenanceType(type.id)}
                                    >
                                        <Text style={styles.maintenanceTypeIcon}>{type.icon}</Text>
                                        <Text style={styles.maintenanceTypeName}>{type.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

                            {maintenanceData.type === 'Personalizado' && (
                                <View style={styles.customTypeContainer}>
                                    <Text style={styles.label}>Especificar tipo de mantenimiento</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ej. Cambio de bujías"
                                        value={maintenanceData.type === 'Personalizado' ? '' : maintenanceData.type}
                                        onChangeText={(text) => handleChange('type', text)}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Section: Date & Time */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => setExpandedSection(expandedSection === 'date' ? '' : 'date')}
                    >
                        <View style={styles.sectionTitle}>
                            <View style={styles.sectionNumber}>
                                <Text style={styles.sectionNumberText}>2</Text>
                            </View>
                            <Text style={styles.sectionTitleText}>Fecha y Hora</Text>
                        </View>
                        {completedSections.date ? (
                            <Feather name="check" size={20} color="green" />
                        ) : (
                            <Feather name={expandedSection === 'date' ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
                        )}
                    </TouchableOpacity>

                    {expandedSection === 'date' && (
                        <View style={styles.sectionContent}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Fecha del mantenimiento <Text style={styles.required}>*</Text></Text>
                                <View style={styles.inputWithIcon}>
                                    <Feather name="calendar" size={18} color="#999" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, errors.date && styles.inputError]}
                                        placeholder="DD/MM/AAAA"
                                        value={maintenanceData.date}
                                        onChangeText={(text) => handleChange('date', text)}
                                    />
                                </View>
                                {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Hora (opcional)</Text>
                                <View style={styles.inputWithIcon}>
                                    <Feather name="clock" size={18} color="#999" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="HH:MM"
                                        value={maintenanceData.time}
                                        onChangeText={(text) => handleChange('time', text)}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={completeDateSection}
                            >
                                <Text style={styles.continueButtonText}>Continuar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Section: Maintenance Details */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => setExpandedSection(expandedSection === 'details' ? '' : 'details')}
                    >
                        <View style={styles.sectionTitle}>
                            <View style={styles.sectionNumber}>
                                <Text style={styles.sectionNumberText}>3</Text>
                            </View>
                            <Text style={styles.sectionTitleText}>Detalles del Mantenimiento</Text>
                        </View>
                        {completedSections.details ? (
                            <Feather name="check" size={20} color="green" />
                        ) : (
                            <Feather name={expandedSection === 'details' ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
                        )}
                    </TouchableOpacity>

                    {expandedSection === 'details' && (
                        <View style={styles.sectionContent}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Kilometraje actual <Text style={styles.required}>*</Text></Text>
                                <View style={styles.inputWithIcon}>
                                    <Feather name="map-pin" size={18} color="#999" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, errors.mileage && styles.inputError]}
                                        placeholder="Ej. 35000"
                                        value={maintenanceData.mileage?.toString()}
                                        onChangeText={(text) => handleChange('mileage', text)}
                                        keyboardType="number-pad"
                                    />
                                    <Text style={styles.inputSuffix}>km</Text>
                                </View>
                                {errors.mileage && <Text style={styles.errorText}>{errors.mileage}</Text>}
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Costo (opcional)</Text>
                                <View style={styles.inputWithIcon}>
                                    <Feather name="dollar-sign" size={18} color="#999" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, errors.cost && styles.inputError]}
                                        placeholder="Ej. 150.00"
                                        value={maintenanceData.cost?.toString()}
                                        onChangeText={(text) => handleChange('cost', text)}
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                                {errors.cost && <Text style={styles.errorText}>{errors.cost}</Text>}
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Lugar o taller (opcional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. Taller Mecánico XYZ"
                                    value={maintenanceData.location}
                                    onChangeText={(text) => handleChange('location', text)}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Notas (opcional)</Text>
                                <View style={styles.textAreaContainer}>
                                    <Feather name="file-text" size={18} color="#999" style={styles.textAreaIcon} />
                                    <TextInput
                                        style={styles.textArea}
                                        placeholder="Información adicional sobre el mantenimiento..."
                                        value={maintenanceData.notes}
                                        onChangeText={(text) => handleChange('notes', text)}
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Fotos o documentos (opcional)</Text>

                                <View style={styles.photosGrid}>
                                    {maintenanceData.photos?.map((photo, index) => (
                                        <View key={index} style={styles.photoItem}>
                                            <View style={styles.photoPlaceholder}>
                                                <Text style={styles.photoPlaceholderText}>Foto {index + 1}</Text>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.removePhotoButton}
                                                onPress={() => handleRemovePhoto(index)}
                                            >
                                                <Feather name="x" size={14} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}

                                    <TouchableOpacity
                                        style={styles.addPhotoButton}
                                        onPress={handleAddPhoto}
                                    >
                                        <Feather name="camera" size={24} color="#999" />
                                        <Text style={styles.addPhotoText}>Añadir</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Footer with Action Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSubmit}
                >
                    <Feather name="save" size={18} color="#fff" style={styles.saveButtonIcon} />
                    <Text style={styles.saveButtonText}>Guardar</Text>
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        //borderBottomWidth: expandedSection ? 1 : 0,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E5EDFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionNumberText: {
        color: '#3B82F6',
        fontWeight: 'bold',
    },
    sectionTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionContent: {
        padding: 16,
    },
    maintenanceTypesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    maintenanceTypeItem: {
        width: '48%',
        margin: '1%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    maintenanceTypeItemSelected: {
        borderColor: '#3B82F6',
        backgroundColor: '#E5EDFF',
    },
    maintenanceTypeIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    maintenanceTypeName: {
        fontWeight: '500',
    },
    customTypeContainer: {
        marginTop: 12,
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
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        height: 48,
    },
    inputError: {
        borderColor: 'red',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    inputIcon: {
        marginRight: 8,
    },
    inputSuffix: {
        marginLeft: 8,
        color: '#999',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: 12,
    },
    continueButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    continueButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    textAreaContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        paddingTop: 12,
    },
    textAreaIcon: {
        marginRight: 8,
        marginTop: 2,
    },
    textArea: {
        flex: 1,
        height: 80,
        textAlignVertical: 'top',
    },
    photosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    photoItem: {
        width: 80,
        height: 80,
        margin: 4,
        position: 'relative',
    },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#eee',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoPlaceholderText: {
        color: '#999',
        fontSize: 12,
    },
    removePhotoButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'red',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addPhotoButton: {
        width: 80,
        height: 80,
        margin: 4,
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addPhotoText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    footer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#666',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    saveButtonIcon: {
        marginRight: 8,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});