// components/common/LoadingErrorIndicator.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface LoadingErrorIndicatorProps {
    isLoading: boolean;
    error: string | null;
    onRetry?: () => void;
    loadingMessage?: string;
    theme: any; // Idealmente definir un tipo más específico para el tema
}

const LoadingErrorIndicator: React.FC<LoadingErrorIndicatorProps> = ({
    isLoading,
    error,
    onRetry,
    loadingMessage = 'Cargando...',
    theme
}) => {
    // No mostrar nada si no hay carga ni error
    if (!isLoading && !error) {
        return null;
    }

    const backgroundColor = theme.background || '#f5f5f5';
    const textColor = theme.text || '#333333';
    const secondaryTextColor = theme.secondaryText || '#666666';
    const primaryColor = theme.primary || '#3B82F6';
    const errorColor = theme.danger || '#EF4444';

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={primaryColor} />
                    <Text style={[styles.loadingText, { color: textColor }]}>
                        {loadingMessage}
                    </Text>
                </View>
            )}

            {error && (
                <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={24} color={errorColor} />
                    <Text style={[styles.errorText, { color: textColor }]}>
                        {error}
                    </Text>

                    {onRetry && (
                        <TouchableOpacity
                            style={[styles.retryButton, { backgroundColor: primaryColor }]}
                            onPress={onRetry}
                        >
                            <Text style={styles.retryButtonText}>Reintentar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    loadingText: {
        marginTop: 8,
        fontSize: 16,
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    errorText: {
        marginTop: 8,
        marginBottom: 16,
        fontSize: 16,
        textAlign: 'center',
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});

export default LoadingErrorIndicator;