// components/vehicles/maintenance-page/AddMaintenanceButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AddMaintenanceButtonProps {
    onPress: () => void;
    theme: any;
}

const AddMaintenanceButton = ({ onPress, theme }: AddMaintenanceButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Feather name="plus" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.text}>Agregar mantenimiento</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 24,
        right: 16,
        left: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddMaintenanceButton;