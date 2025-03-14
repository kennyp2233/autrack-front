import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AddVehicleButtonProps {
    onPress: () => void;
    theme: any;
}

const AddVehicleButton: React.FC<AddVehicleButtonProps> = ({ onPress, theme }) => {
    // Colores basados en el tema
    const primaryColor = theme.primary;

    return (
        <TouchableOpacity
            style={[styles.addButton, { backgroundColor: primaryColor }]}
            onPress={onPress}
        >
            <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        zIndex: 10,
    },
});

export default AddVehicleButton;