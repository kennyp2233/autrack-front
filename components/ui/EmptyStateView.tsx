// components/ui/EmptyStateView.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import Button from '@/components/ui/Button';

interface EmptyStateViewProps {
    icon: string;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    style?: ViewStyle;
}

/**
 * Componente reutilizable para mostrar estados vacíos en la aplicación
 */
const EmptyStateView: React.FC<EmptyStateViewProps> = ({
    icon,
    title,
    message,
    actionLabel,
    onAction,
    style
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
                <Feather name={icon as any} size={36} color={theme.primary} />
            </View>

            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

            <Text style={[styles.message, { color: theme.secondaryText }]}>
                {message}
            </Text>

            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    variant="primary"
                    onPress={onAction}
                    style={styles.actionButton}
                />
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
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    actionButton: {
        paddingHorizontal: 24,
    }
});

export default EmptyStateView;