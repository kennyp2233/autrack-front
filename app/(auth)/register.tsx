import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

// Importar componentes Formik unificados
import {
    FormikContainer,
    FormikField,
    FormikButton,
    FormikButtonGroup
} from '@/components/ui/formik';

// Importar esquema de validación
import { registerSchema } from '@/utils/validations';

// Definir tipo para los valores del formulario
interface RegisterFormValues {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading } = useAuth();
    const { theme } = useTheme();

    // Estados para controlar la visibilidad de las contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Valores iniciales del formulario
    const initialValues: RegisterFormValues = {
        fullName: 'Kenny',
        email: 'kennyp41234@gmail.com',
        password: 'Agente50@',
        confirmPassword: 'Agente50@',
        acceptTerms: false
    };

    // Manejar envío del formulario
    const handleSubmit = async (values: RegisterFormValues) => {
        try {
            await register(values);
            // La navegación se maneja en el contexto de autenticación
        } catch (error) {
            console.log("Error capturado en pantalla de registro:", error);
            // El error ya se maneja en el contexto, no es necesario hacer nada aquí
        }
    };

    // Obtener colores del tema
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const errorColor = theme.danger;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    disabled={isLoading}
                >
                    <Feather name="chevron-left" size={24} color={textColor} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: textColor }]}>Crear cuenta</Text>
            </View>

            {/* Formulario con Formik */}
            <FormikContainer
                initialValues={initialValues}
                validationSchema={registerSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <>
                        {/* Campo de nombre completo */}
                        <FormikField
                            name="fullName"
                            label="Nombre completo"
                            placeholder="Nombre y apellido"
                            icon="user"
                            required
                            editable={!isLoading}
                        />

                        {/* Campo de email */}
                        <FormikField
                            name="email"
                            label="Correo electrónico"
                            placeholder="tu@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon="mail"
                            required
                            editable={!isLoading}
                        />

                        {/* Campo de contraseña con toggle para mostrar/ocultar */}
                        <View style={styles.passwordContainer}>
                            <FormikField
                                name="password"
                                label="Contraseña"
                                placeholder="Mínimo 6 caracteres"
                                secureTextEntry={!showPassword}
                                icon="lock"
                                required
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={styles.passwordToggle}
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                <Feather
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color={secondaryTextColor}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Campo de confirmación de contraseña */}
                        <View style={styles.passwordContainer}>
                            <FormikField
                                name="confirmPassword"
                                label="Confirmar contraseña"
                                placeholder="Repetir contraseña"
                                secureTextEntry={!showConfirmPassword}
                                icon="lock"
                                required
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={styles.passwordToggle}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                <Feather
                                    name={showConfirmPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color={secondaryTextColor}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Términos y condiciones */}
                        <View style={styles.termsContainer}>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setFieldValue('acceptTerms', !values.acceptTerms)}
                                disabled={isLoading}
                            >
                                <View style={[
                                    styles.checkbox,
                                    {
                                        borderColor: values.acceptTerms ? primaryColor : theme.border,
                                        backgroundColor: values.acceptTerms ? primaryColor : 'transparent'
                                    }
                                ]}>
                                    {values.acceptTerms && <Feather name="check" size={12} color="white" />}
                                </View>
                            </TouchableOpacity>

                            <View style={styles.termsTextContainer}>
                                <Text style={[styles.termsText, { color: secondaryTextColor }]}>
                                    Acepto los{' '}
                                    <Text style={[styles.termsLink, { color: primaryColor }]}>términos y condiciones</Text> y la{' '}
                                    <Text style={[styles.termsLink, { color: primaryColor }]}>política de privacidad</Text>
                                </Text>
                            </View>
                        </View>

                        {/* Botones de acción */}
                        <FormikButtonGroup
                            submitLabel="Crear cuenta"
                            cancelLabel="Volver"
                            onCancel={() => router.back()}
                            externalLoading={isLoading}
                            submitIcon="arrow-right"
                        />

                        {/* Enlace para inicio de sesión */}
                        <View style={styles.loginContainer}>
                            <Text style={[styles.loginText, { color: secondaryTextColor }]}>
                                ¿Ya tienes una cuenta?{' '}
                            </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity disabled={isLoading}>
                                    <Text style={[styles.loginLink, { color: primaryColor }]}>
                                        Inicia sesión
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </>
                )}
            </FormikContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordToggle: {
        position: 'absolute',
        right: 12,
        top: 40,
        padding: 8,
    },
    termsContainer: {
        flexDirection: 'row',
        marginVertical: 16,
    },
    checkboxContainer: {
        padding: 4,
        marginRight: 8,
        alignSelf: 'flex-start',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsTextContainer: {
        flex: 1,
    },
    termsText: {
        fontSize: 14,
        flexWrap: 'wrap',
    },
    termsLink: {
        fontWeight: '500',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    loginText: {
        fontSize: 14,
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '500',
    },
});