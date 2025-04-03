import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFormikContext } from 'formik';
import { useTheme } from '@/contexts/ThemeContext';

interface FormikButtonProps {
    title: string;
    onPress?: () => void; // Optional custom onPress handler
    type?: 'submit' | 'button' | 'reset';
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

const FormikButton: React.FC<FormikButtonProps> = ({
    title,
    onPress,
    type = 'submit',
    variant = 'primary',
    size = 'medium',
    iconLeft,
    iconRight,
    disabled: externalDisabled = false,
    loading: externalLoading = false,
    fullWidth = false,
    style,
    textStyle
}) => {
    const { theme } = useTheme();
    const { submitForm, isSubmitting, errors, touched } = useFormikContext();

    // Combine Formik states with props
    const formHasErrors = Object.keys(errors).length > 0 && Object.keys(touched).length > 0;
    const isLoading = isSubmitting || externalLoading;
    const isDisabled = formHasErrors || externalDisabled || isLoading;

    // Determine styles based on variant
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

    // Determine size
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

    // Handle button press
    const handlePress = () => {
        if (type === 'submit') {
            submitForm();
        } else if (onPress) {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                variantStyle.button,
                sizeStyle.button,
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style
            ]}
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {isLoading ? (
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

export default FormikButton;