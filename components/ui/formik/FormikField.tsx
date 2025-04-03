import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useField } from 'formik';
import { useTheme } from '@/contexts/ThemeContext';

interface FormikFieldProps extends TextInputProps {
    name: string;
    label: string;
    icon?: string;
    required?: boolean;
    optional?: boolean;
}

const FormikField: React.FC<FormikFieldProps> = ({
    name,
    label,
    icon,
    required = false,
    optional = false,
    placeholder,
    secureTextEntry,
    keyboardType,
    multiline = false,
    numberOfLines,
    editable = true,
    ...rest
}) => {
    const [field, meta, helpers] = useField(name);
    const { theme } = useTheme();

    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const borderColor = theme.border;
    const dangerColor = theme.danger;
    const backgroundColor = theme.card;

    const hasError = meta.touched && meta.error;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: textColor }]}>
                {label}
                {required && <Text style={[styles.required, { color: dangerColor }]}>*</Text>}
                {optional && <Text style={[styles.optional, { color: secondaryTextColor }]}> (Opcional)</Text>}
            </Text>

            <View
                style={[
                    styles.inputWrapper,
                    { borderColor: hasError ? dangerColor : borderColor, backgroundColor },
                    !editable && styles.inputDisabled
                ]}
            >
                {icon && (
                    <Feather name={icon as any} size={18} color={secondaryTextColor} style={styles.icon} />
                )}

                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.multilineInput,
                        { color: textColor }
                    ]}
                    value={field.value}
                    onChangeText={value => helpers.setValue(value)}
                    onBlur={() => helpers.setTouched(true)}
                    placeholder={placeholder}
                    placeholderTextColor={secondaryTextColor}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines || 3 : 1}
                    editable={editable}
                    {...rest}
                />
            </View>

            {hasError && <Text style={[styles.errorText, { color: dangerColor }]}>{meta.error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
        fontSize: 14,
    },
    required: {
        fontWeight: '600',
    },
    optional: {
        fontStyle: 'italic',
        fontSize: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        minHeight: 48,
    },
    inputDisabled: {
        opacity: 0.6,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    multilineInput: {
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    icon: {
        marginRight: 8,
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
    }
});

export default FormikField;