// components/common/headers/NavigationHeader.tsx
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import BaseHeader from './BaseHeader';

interface NavigationHeaderProps {
    title: string;
    showBackButton?: boolean;
    rightIcon?: string;
    onRightIconPress?: () => void;
    theme: any; // Idealmente definiríamos un tipo ThemeType
}

/**
 * Header estándar de navegación con título y opcionalmente botón de regreso y acción derecha
 */
const NavigationHeader: React.FC<NavigationHeaderProps> = ({
    title,
    showBackButton = true,
    rightIcon,
    onRightIconPress,
    theme
}) => {
    const router = useRouter();
    const headerBg = theme?.primary || '#333333';
    const textColor = '#FFFFFF';

    const determineStatusBarStyle = () => {
        // Determinar automáticamente si usar texto claro u oscuro basado en el color de fondo
        // Esta es una lógica simple, puedes usar una función más sofisticada que calcule luminosidad
        return theme?.isDark || headerBg.includes('#33') ? 'light-content' : 'dark-content';
    };

    return (
        <BaseHeader
            backgroundColor={headerBg}
            statusBarStyle={determineStatusBarStyle()}
        >
            <View style={styles.headerContent}>
                {showBackButton ? (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        accessibilityRole="button"
                        accessibilityLabel="Volver atrás"
                    >
                        <Feather name="arrow-left" size={24} color={textColor} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholderWidth} />
                )}

                <Text
                    style={[styles.title, { color: textColor }]}
                    numberOfLines={1}
                    accessibilityRole="header"
                >
                    {title}
                </Text>

                {rightIcon ? (
                    <TouchableOpacity
                        style={styles.rightButton}
                        onPress={onRightIconPress}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        accessibilityRole="button"
                    >
                        <Feather name={rightIcon as any} size={24} color={textColor} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholderWidth} />
                )}
            </View>
        </BaseHeader>
    );
};

const styles = StyleSheet.create({
    headerContent: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
    },
    rightButton: {
        padding: 8,
        borderRadius: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    placeholderWidth: {
        width: 40,
    },
});

export default NavigationHeader;