import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface EmptyStateProps {
    icon?: string;
    title: string;
    message: string;
    buttonText?: string;
    onButtonPress?: () => void;
    style?: ViewStyle;
    iconSize?: number;
}

/**
 * Componente reutilizable para mostrar estados vacíos en listas o secciones
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'inbox',
    title,
    message,
    buttonText,
    onButtonPress,
    style,
    iconSize = 60
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, style]}>
            <Feather
                name={icon as any}
                size={iconSize}
                color={theme.secondaryText}
                style={styles.icon}
            />

            <Text style={[styles.title, { color: theme.text }]}>
                {title}
            </Text>

            <Text style={[styles.message, { color: theme.secondaryText }]}>
                {message}
            </Text>

            {buttonText && onButtonPress && (
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={onButtonPress}
                >
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    icon: {
        marginBottom: 16,
        opacity: 0.5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    }
});

export default EmptyState;