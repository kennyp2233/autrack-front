import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'medium' | 'large';
    iconLeft?: string;
    iconRight?: string;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    iconLeft,
    iconRight,
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
    textStyle
}) => {
    const { theme } = useTheme();

    // Determinar estilos basados en variante
    const getButtonStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    button: { backgroundColor: theme.primary },
                    text: { color: '#FFFFFF' },
                    icon: '#FFFFFF'
                };
            case 'secondary':
                return {
                    button: { backgroundColor: theme.secondary },
                    text: { color: '#FFFFFF' },
                    icon: '#FFFFFF'
                };
            case 'outline':
                return {
                    button: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.primary },
                    text: { color: theme.primary },
                    icon: theme.primary
                };
            case 'danger':
                return {
                    button: { backgroundColor: theme.danger },
                    text: { color: '#FFFFFF' },
                    icon: '#FFFFFF'
                };
        }
    };

    // Determinar tamaño
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    button: { paddingVertical: 8, paddingHorizontal: 16 },
                    text: { fontSize: 14 },
                    icon: 16
                };
            case 'medium':
                return {
                    button: { paddingVertical: 12, paddingHorizontal: 24 },
                    text: { fontSize: 16 },
                    icon: 18
                };
            case 'large':
                return {
                    button: { paddingVertical: 16, paddingHorizontal: 32 },
                    text: { fontSize: 18 },
                    icon: 20
                };
        }
    };

    const variantStyle = getButtonStyles();
    const sizeStyle = getSizeStyles();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                variantStyle.button,
                sizeStyle.button,
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variantStyle.text.color}
                    size={sizeStyle.icon as number}
                />
            ) : (
                <>
                    {iconLeft && (
                        <Feather
                            name={iconLeft as any}
                            size={sizeStyle.icon as number}
                            color={variantStyle.icon}
                            style={styles.iconLeft}
                        />
                    )}

                    <Text
                        style={[
                            styles.text,
                            variantStyle.text,
                            sizeStyle.text,
                            textStyle
                        ]}
                    >
                        {title}
                    </Text>

                    {iconRight && (
                        <Feather
                            name={iconRight as any}
                            size={sizeStyle.icon as number}
                            color={variantStyle.icon}
                            style={styles.iconRight}
                        />
                    )}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    text: {
        fontWeight: '600',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
    }
});

export default Button;