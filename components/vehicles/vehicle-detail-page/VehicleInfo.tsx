import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Vehicle } from '@/types/Vehicle';

interface VehicleInfoProps {
    vehicle: Vehicle;
    onEditPress: () => void;
    theme: any;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({
    vehicle,
    onEditPress,
    theme
}) => {
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const borderColor = theme.border;

    // Renderizado de cada campo de información
    const renderDetailItem = (label: string, value: string | number | undefined, renderCustom?: (value: any) => React.ReactNode) => {
        return (
            <View style={[styles.detailItem, { borderBottomColor: borderColor }]}>
                <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>{label}</Text>
                {renderCustom ? (
                    renderCustom(value)
                ) : (
                    <Text style={[styles.detailValue, { color: textColor }]}>
                        {value !== undefined ? value.toString() : 'No registrado'}
                    </Text>
                )}
            </View>
        );
    };

    // Renderizado especial para el color
    const renderColorDetail = (color: string | undefined) => {
        if (!color) return <Text style={[styles.detailValue, { color: textColor }]}>No especificado</Text>;

        return (
            <View style={styles.colorDetail}>
                <View style={[styles.colorSwatch, { backgroundColor: color }]} />
                <Text style={[styles.detailValue, { color: textColor }]}>
                    {color === '#3B82F6' ? 'Azul' :
                        color === '#10B981' ? 'Verde' : 'Personalizado'}
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
                Información del Vehículo
            </Text>

            {renderDetailItem('Marca', vehicle.marca?.nombre)}
            {renderDetailItem('Modelo', vehicle.modelo?.nombre)}
            {renderDetailItem('Año', vehicle.anio)}
            {renderDetailItem('Placa', vehicle.placa)}
            {vehicle.color && renderDetailItem('Color', vehicle.color, renderColorDetail)}
            {vehicle.vinNumber && renderDetailItem('Número VIN', vehicle.vinNumber)}
            {vehicle.purchaseDate && renderDetailItem('Fecha de adquisición', vehicle.purchaseDate)}

            <TouchableOpacity
                style={[styles.editButton, { borderColor }]}
                onPress={onEditPress}
            >
                <Feather name="edit-2" size={16} color={secondaryTextColor} />
                <Text style={[styles.editButtonText, { color: secondaryTextColor }]}>
                    Editar información
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    detailLabel: {
        fontSize: 14,
    },
    detailValue: {
        fontWeight: '500',
        fontSize: 14,
    },
    colorDetail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorSwatch: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 0.5,
        borderColor: '#ddd',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
    },
    editButtonText: {
        marginLeft: 8,
        fontWeight: '500',
    },
});

export default VehicleInfo;