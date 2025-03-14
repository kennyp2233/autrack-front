import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Vehicle } from '@/types/Vehicle';

interface DeleteConfirmationModalProps {
    vehicle: Vehicle;
    onCancel: () => void;
    onConfirm: () => void;
    theme: any;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    vehicle,
    onCancel,
    onConfirm,
    theme
}) => {
    const cardColor = theme.card;
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const dangerColor = theme.danger;

    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modal, { backgroundColor: cardColor }]}>
                    <Text style={[styles.modalTitle, { color: textColor }]}>
                        Eliminar vehículo
                    </Text>

                    <Text style={[styles.modalMessage, { color: secondaryTextColor }]}>
                        ¿Estás seguro de que deseas eliminar el {vehicle.brand} {vehicle.model}?
                        Esta acción no se puede deshacer.
                    </Text>

                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={[
                                styles.modalCancelButton,
                                { backgroundColor: theme.isDark ? '#333' : '#f5f5f5' }
                            ]}
                            onPress={onCancel}
                        >
                            <Text style={[styles.modalCancelButtonText, { color: secondaryTextColor }]}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalDeleteButton, { backgroundColor: dangerColor }]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.modalDeleteButtonText}>
                                Eliminar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modal: {
        width: '100%',
        borderRadius: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalMessage: {
        marginBottom: 20,
        lineHeight: 20,
    },
    modalActions: {
        flexDirection: 'row',
    },
    modalCancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    modalCancelButtonText: {
        fontWeight: '500',
    },
    modalDeleteButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 8,
    },
    modalDeleteButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});

export default DeleteConfirmationModal;