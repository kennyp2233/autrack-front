import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface SectionCardProps {
    children: ReactNode;
    style?: object;
}

const SectionCard: React.FC<SectionCardProps> = ({ children, style }) => {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        borderRadius: 16,
        padding: 16,
        // Sombra mejorada para dar mejor profundidad y funcionar mejor en ambos modos
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12, // Ligeramente aumentada para mejor visibilidad
        shadowRadius: 4,
        elevation: 3,
        // Añadimos un borde por defecto para garantizar visibilidad en temas claros
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.05)',
    },
});

export default SectionCard;