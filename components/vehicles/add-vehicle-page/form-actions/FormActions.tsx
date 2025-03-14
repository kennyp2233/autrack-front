import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FormActionsProps {
    onCancel: () => void;
    onSave: () => void;
    saveLabel?: string;
    cancelLabel?: string;
    theme: any;
}

const FormActions: React.FC<FormActionsProps> = ({
    onCancel,
    onSave,
    saveLabel = 'Guardar',
    cancelLabel = 'Cancelar',
    theme
}) => {
    // Colores basados en el tema
    const cardColor = theme.card;
    const textColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const borderColor = theme.border;

    return (
        <View style={[styles.footer, { backgroundColor: cardColor, borderTopColor: borderColor }]}>
            <TouchableOpacity
                style={[
                    styles.cancelButton,
                    { backgroundColor: theme.isDark ? '#333' : '#f5f5f5' }
                ]}
                onPress={onCancel}
            >
                <Text style={[styles.cancelButtonText, { color: textColor }]}>
                    {cancelLabel}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: primaryColor }]}
                onPress={onSave}
            >
                <Text style={styles.saveButtonText}>
                    {saveLabel}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10,
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        fontWeight: '500',
    },
    saveButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 8,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});

export default FormActions;