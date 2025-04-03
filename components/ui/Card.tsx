import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    elevation?: number;
    noPadding?: boolean;
}

/**
 * Componente Card reutilizable para envolver contenido en un contenedor con estilo consistente
 */
const Card: React.FC<CardProps> = ({
    children,
    style,
    elevation = 2,
    noPadding = false
}) => {
    const { theme } = useTheme();

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: theme.card,
                borderColor: theme.border
            },
            elevation > 0 && {
                shadowOpacity: 0.1 * elevation,
                shadowRadius: elevation,
                elevation: elevation
            },
            noPadding && styles.noPadding,
            style
        ]}>
            {children}
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
    },
    noPadding: {
        padding: 0
    }
});

export default Card;