import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FormFieldProps {
    label: string;
    value: string | undefined;
    placeholder: string;
    required?: boolean;
    optional?: boolean;
    error?: string;
    onChange: (value: string) => void;
    keyboardType?: 'default' | 'number-pad' | 'email-address' | 'phone-pad';
    multiline?: boolean;
    theme: any;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    value,
    placeholder,
    required = false,
    optional = false,
    error,
    onChange,
    keyboardType = 'default',
    multiline = false,
    theme
}) => {
    // Colores basados en el tema
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const borderColor = theme.border;
    const dangerColor = theme.danger;

    return (
        <View style={styles.formGroup}>
            <Text style={[styles.label, { color: textColor }]}>
                {label} {required && <Text style={[styles.required, { color: dangerColor }]}>*</Text>}
                {optional && <Text style={[styles.optional, { color: secondaryTextColor }]}>(Opcional)</Text>}
            </Text>
            <TextInput
                style={[
                    styles.input,
                    error && { borderColor: dangerColor },
                    multiline && styles.textArea,
                    {
                        color: textColor,
                        borderColor: error ? dangerColor : borderColor
                    }
                ]}
                placeholder={placeholder}
                placeholderTextColor={secondaryTextColor}
                value={value}
                onChangeText={onChange}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
            />
            {error && <Text style={[styles.errorText, { color: dangerColor }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    formGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
    },
    required: {
        color: 'red',
    },
    optional: {
        fontWeight: 'normal',
        fontSize: 12,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        height: 48,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    errorText: {
        marginTop: 4,
        fontSize: 12,
    },
});

export default FormField;