import React, { ReactNode } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Formik, FormikConfig, FormikValues } from 'formik';
import { useTheme } from '@/contexts/ThemeContext';

interface FormikContainerProps<T extends FormikValues> extends FormikConfig<T> {
    children: ReactNode | ((props: any) => ReactNode);
    scrollEnabled?: boolean;
    keyboardOffset?: number;
    contentPadding?: number;
    showsVerticalScrollIndicator?: boolean;
}

const FormikContainer = <T extends FormikValues>({
    children,
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize = false,
    scrollEnabled = true,
    keyboardOffset = 100,
    contentPadding = 16,
    showsVerticalScrollIndicator = false,
    ...rest
}: FormikContainerProps<T>) => {
    const { theme } = useTheme();

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={keyboardOffset}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize={enableReinitialize}
                validateOnChange={false}
                validateOnBlur={true}
                {...rest}
            >
                {(formikProps) => (
                    <ScrollView
                        contentContainerStyle={[
                            styles.scrollContent,
                            { paddingHorizontal: contentPadding }
                        ]}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                        scrollEnabled={scrollEnabled}
                    >
                        <View style={styles.formContent}>
                            {typeof children === 'function' ? children(formikProps) : children}
                        </View>
                    </ScrollView>
                )}
            </Formik>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },
    formContent: {
        flex: 1,
        marginVertical: 16,
    },
});

export default FormikContainer;