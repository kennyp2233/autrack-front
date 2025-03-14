import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface OptionsMenuProps {
    onClose: () => void;
    onEdit: () => void;
    onViewMaintenance: () => void;
    onAddMaintenance: () => void;
    onDelete: () => void;
    theme: any;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
    onClose,
    onEdit,
    onViewMaintenance,
    onAddMaintenance,
    onDelete,
    theme
}) => {
    const cardColor = theme.card;
    const textColor = theme.text;
    const dangerColor = theme.danger;
    const borderColor = theme.border;

    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View
                    style={[
                        styles.optionsMenu,
                        {
                            backgroundColor: cardColor,
                            borderColor: borderColor,
                            top: 50,
                            right: 10
                        }
                    ]}
                >
                    <OptionItem
                        icon="edit-2"
                        label="Editar vehículo"
                        onPress={onEdit}
                        color={textColor}
                    />

                    <OptionItem
                        icon="list"
                        label="Ver mantenimientos"
                        onPress={onViewMaintenance}
                        color={textColor}
                    />

                    <OptionItem
                        icon="plus-circle"
                        label="Agregar mantenimiento"
                        onPress={onAddMaintenance}
                        color={textColor}
                    />

                    <OptionItem
                        icon="trash-2"
                        label="Eliminar vehículo"
                        onPress={onDelete}
                        color={dangerColor}
                        style={styles.deleteOption}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

// Componente interno para cada opción del menú
interface OptionItemProps {
    icon: string;
    label: string;
    onPress: () => void;
    color: string;
    style?: object;
}

const OptionItem: React.FC<OptionItemProps> = ({
    icon,
    label,
    onPress,
    color,
    style
}) => {
    return (
        <TouchableOpacity
            style={[styles.optionItem, style]}
            onPress={onPress}
        >
            <Feather name={icon as any} size={18} color={color} />
            <Text style={[styles.optionText, { color }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    optionsMenu: {
        position: 'absolute',
        width: 220,
        borderRadius: 8,
        borderWidth: 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
    },
    optionText: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '500',
    },
    deleteOption: {
        borderBottomWidth: 0,
    },
});

export default OptionsMenu;