import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BrandSelectorProps {
    selectedBrand: string;
    onSelectBrand: (brand: string) => void;
    theme: any;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({
    selectedBrand,
    onSelectBrand,
    theme
}) => {
    // Lista de marcas populares
    const popularBrands = [
        'Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet',
        'Nissan', 'Hyundai', 'Kia', 'Mazda', 'BMW', 'Mercedes-Benz'
    ];

    // Colores basados en el tema
    const cardColor = theme.card;
    const textColor = theme.text;
    const primaryColor = theme.primary;
    const borderColor = theme.border;
    const selectedBgColor = theme.isDark ? `${primaryColor}33` : '#E5EDFF';

    return (
        <View style={[styles.dropdown, { backgroundColor: cardColor, borderColor }]}>
            {popularBrands.map((brand) => (
                <TouchableOpacity
                    key={brand}
                    style={[
                        styles.dropdownItem,
                        selectedBrand === brand && { backgroundColor: selectedBgColor },
                        { borderBottomColor: borderColor }
                    ]}
                    onPress={() => onSelectBrand(brand)}
                >
                    <Text style={{ color: textColor, fontWeight: selectedBrand === brand ? '500' : 'normal' }}>{brand}</Text>
                    {selectedBrand === brand && (
                        <Feather name="check" size={16} color={primaryColor} />
                    )}
                </TouchableOpacity>
            ))}
            <TouchableOpacity
                style={[styles.dropdownItemAdd, { borderTopColor: borderColor }]}
                onPress={() => onSelectBrand('Otro')}
            >
                <Text style={[styles.dropdownItemAddText, { color: primaryColor }]}>
                    + Agregar otra marca
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 4,
        maxHeight: 200,
        borderTopWidth: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
    },
    selectedItem: {
        // ViewStyle doesn't directly accept fontWeight
    },
    dropdownItemAdd: {
        padding: 12,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    dropdownItemAddText: {
        fontWeight: '500',
    },
});

export default BrandSelector;