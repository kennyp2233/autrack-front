import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

// Tipos predefinidos para badges
type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    icon?: string;
    size?: 'small' | 'medium' | 'large';
    style?: ViewStyle;
    textStyle?: TextStyle;
    outlined?: boolean;
}

/**
 * Componente Badge reutilizable para estados, etiquetas y categorías
 */
const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'default',
    icon,
    size = 'medium',
    style,
    textStyle,
    outlined = false
}) => {
    const { theme, isDark } = useTheme();

    // Determinar colores basados en la variante
    let backgroundColor, textColor, borderColor;

    switch (variant) {
        case 'primary':
            backgroundColor = outlined ? 'transparent' : (isDark ? `${theme.primary}30` : `${theme.primary}15`);
            textColor = theme.primary;
            borderColor = theme.primary;
            break;
        case 'success':
            backgroundColor = outlined ? 'transparent' : (isDark ? `${theme.success}30` : `${theme.success}15`);
            textColor = theme.success || '#4CAF50';
            borderColor = theme.success || '#4CAF50';
            break;
        case 'warning':
            backgroundColor = outlined ? 'transparent' : (isDark ? `${theme.warning}30` : `${theme.warning}15`);
            textColor = theme.warning || '#FFC107';
            borderColor = theme.warning || '#FFC107';
            break;
        case 'danger':
            backgroundColor = outlined ? 'transparent' : (isDark ? `${theme.danger}30` : `${theme.danger}15`);
            textColor = theme.danger || '#F44336';
            borderColor = theme.danger || '#F44336';
            break;
        case 'info':
            backgroundColor = outlined ? 'transparent' : (isDark ? `${theme.info}30` : `${theme.info}15`);
            textColor = theme.info || '#2196F3';
            borderColor = theme.info || '#2196F3';
            break;
        default:
            backgroundColor = outlined ? 'transparent' : (isDark ? '#36363630' : '#EEEEEE');
            textColor = theme.secondaryText;
            borderColor = theme.border;
    }

    // Determinar tamaños basados en la propiedad size
    let paddingVertical, paddingHorizontal, fontSize, iconSize, borderRadius;
    switch (size) {
        case 'small':
            paddingVertical = 2;
            paddingHorizontal = 6;
            fontSize = 10;
            iconSize = 10;
            borderRadius = 4;
            break;
        case 'medium':
            paddingVertical = 4;
            paddingHorizontal = 8;
            fontSize = 12;
            iconSize = 12;
            borderRadius = 6;
            break;
        case 'large':
            paddingVertical = 6;
            paddingHorizontal = 12;
            fontSize = 14;
            iconSize = 14;
            borderRadius = 8;
            break;
    }

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor,
                    paddingVertical,
                    paddingHorizontal,
                    borderRadius,
                    borderWidth: outlined ? 1 : 0,
                    borderColor
                },
                style
            ]}
        >
            {icon && (
                <Feather
                    name={icon as any}
                    size={iconSize}
                    color={textColor}
                    style={styles.icon}
                />
            )}
            <Text
                style={[
                    styles.label,
                    {
                        color: textColor,
                        fontSize
                    },
                    textStyle
                ]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    label: {
        fontWeight: '500',
    },
    icon: {
        marginRight: 4,
    }
});

export default Badge;