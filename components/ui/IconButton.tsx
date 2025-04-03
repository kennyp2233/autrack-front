import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface IconButtonProps {
    icon: string;
    label?: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    style?: ViewStyle;
    labelStyle?: TextStyle;
    iconPosition?: 'left' | 'right' | 'top';
}

/**
 * Componente de botón con icono reutilizable
 */
const IconButton: React.FC<IconButtonProps> = ({
    icon,
    label,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    style,
    labelStyle,
    iconPosition = 'left'
}) => {
    const { theme, isDark } = useTheme();

    // Determinar colores basados en la variante
    let backgroundColor, textColor, borderColor, iconColor;

    switch (variant) {
        case 'primary':
            backgroundColor = theme.primary;
            textColor = '#FFFFFF';
            iconColor = '#FFFFFF';
            borderColor = theme.primary;
            break;
        case 'secondary':
            backgroundColor = theme.secondary;
            textColor = '#FFFFFF';
            iconColor = '#FFFFFF';
            borderColor = theme.secondary;
            break;
        case 'danger':
            backgroundColor = theme.danger;
            textColor = '#FFFFFF';
            iconColor = '#FFFFFF';
            borderColor = theme.danger;
            break;
        case 'outline':
            backgroundColor = 'transparent';
            textColor = theme.primary;
            iconColor = theme.primary;
            borderColor = theme.primary;
            break;
        case 'ghost':
            backgroundColor = 'transparent';
            textColor = theme.text;
            iconColor = theme.secondary;
            borderColor = 'transparent';
            break;
    }

    // Determinar tamaños basados en el tamaño
    let buttonPadding, iconSize, fontSize;

    switch (size) {
        case 'small':
            buttonPadding = 8;
            iconSize = 16;
            fontSize = 12;
            break;
        case 'medium':
            buttonPadding = 12;
            iconSize = 18;
            fontSize = 14;
            break;
        case 'large':
            buttonPadding = 16;
            iconSize = 22;
            fontSize = 16;
            break;
    }

    return (
        <TouchableOpacity
            style={[
                styles.button,
                iconPosition === 'top' ? styles.buttonColumn : styles.buttonRow,
                {
                    backgroundColor,
                    borderColor,
                    borderWidth: variant !== 'ghost' ? 1 : 0,
                    padding: buttonPadding,
                    opacity: disabled ? 0.6 : 1
                },
                style
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            {(iconPosition === 'left' || iconPosition === 'top') && (
                <Feather
                    name={icon as any}
                    size={iconSize}
                    color={iconColor}
                    style={[
                        iconPosition === 'left' && label && styles.iconLeft,
                        iconPosition === 'top' && label && styles.iconTop
                    ]}
                />
            )}

            {label && (
                <Text
                    style={[
                        styles.label,
                        { color: textColor, fontSize },
                        labelStyle
                    ]}
                >
                    {label}
                </Text>
            )}

            {iconPosition === 'right' && (
                <Feather
                    name={icon as any}
                    size={iconSize}
                    color={iconColor}
                    style={styles.iconRight}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
    },
    buttonColumn: {
        flexDirection: 'column',
    },
    label: {
        fontWeight: '500',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    iconTop: {
        marginBottom: 4,
    }
});

export default IconButton;