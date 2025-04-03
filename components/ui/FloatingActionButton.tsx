// components/ui/FloatingActionButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface FloatingActionButtonProps {
    icon: string;
    onPress: () => void;
    size?: number;
    style?: ViewStyle;
    position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft' | 'center';
}

/**
 * Componente de botón de acción flotante reutilizable
 */
const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    icon,
    onPress,
    size = 56,
    style,
    position = 'bottomRight'
}) => {
    const { theme } = useTheme();

    // Definir la posición del FAB
    let positionStyle: ViewStyle = {};

    switch (position) {
        case 'bottomRight':
            positionStyle = { bottom: 24, right: 24 };
            break;
        case 'bottomLeft':
            positionStyle = { bottom: 24, left: 24 };
            break;
        case 'topRight':
            positionStyle = { top: 24, right: 24 };
            break;
        case 'topLeft':
            positionStyle = { top: 24, left: 24 };
            break;
        case 'center':
            positionStyle = { bottom: 24, alignSelf: 'center' };
            break;
    }

    const buttonSize = {
        width: size,
        height: size,
        borderRadius: size / 2
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: theme.primary },
                buttonSize,
                positionStyle,
                style
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Feather name={icon as any} size={size / 2} color="#FFFFFF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});

export default FloatingActionButton;