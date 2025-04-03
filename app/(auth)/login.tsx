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
    FormikButtonGroup
} from '@/components/ui/formik';

// Importar esquema de validación
import { loginSchema } from '@/utils/validations';

// Definir tipo para los valores del formulario
interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const { theme } = useTheme();

    // Estado para controlar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);

    // Valores iniciales del formulario
    const initialValues: LoginFormValues = {
        email: '',
        password: '',
        rememberMe: false
    };

    // Manejar envío del formulario
    const handleSubmit = async (values: LoginFormValues) => {
        try {
            await login(values);
            // La navegación se maneja en el contexto de autenticación
        } catch (error) {
            console.log("Error capturado en pantalla de login:", error);
            // El error ya se maneja en el contexto, no es necesario hacer nada aquí
        }
    };

    // Obtener colores del tema
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const backgroundColor = theme.background;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Header con logo */}
            <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: primaryColor }]}>
                    <Feather name="truck" size={32} color="white" />
                </View>
                <Text style={[styles.appName, { color: textColor }]}>Mi Garaje</Text>
                <Text style={[styles.appDescription, { color: secondaryTextColor }]}>
                    Gestiona el mantenimiento de tus vehículos
                </Text>
            </View>

            {/* Formulario con Formik */}
            <FormikContainer
                initialValues={initialValues}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <>
                        <Text style={[styles.title, { color: textColor }]}>Iniciar sesión</Text>

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
                                placeholder="••••••••"
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

                        {/* Opciones adicionales */}
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setFieldValue('rememberMe', !values.rememberMe)}
                                disabled={isLoading}
                            >
                                <View style={[
                                    styles.checkbox,
                                    {
                                        borderColor: values.rememberMe ? primaryColor : theme.border,
                                        backgroundColor: values.rememberMe ? primaryColor : 'transparent'
                                    }
                                ]}>
                                    {values.rememberMe && <Feather name="check" size={12} color="white" />}
                                </View>
                                <Text style={{ color: textColor }}>Recordarme</Text>
                            </TouchableOpacity>

                            <Link href="/(auth)/recovery" asChild>
                                <TouchableOpacity disabled={isLoading}>
                                    <Text style={[styles.forgotPassword, { color: primaryColor }]}>
                                        ¿Olvidaste tu contraseña?
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>

                        {/* Botones de acción */}
                        <FormikButtonGroup
                            submitLabel="Iniciar sesión"
                            cancelLabel="Cancelar"
                            onCancel={() => router.back()}
                            externalLoading={isLoading}
                            submitVariant="primary"
                            cancelVariant="outline"
                        />

                        {/* Enlace para registro */}
                        <View style={styles.registerContainer}>
                            <Text style={{ color: secondaryTextColor }}>¿No tienes una cuenta? </Text>
                            <Link href="/(auth)/register" asChild>
                                <TouchableOpacity disabled={isLoading}>
                                    <Text style={[styles.registerLink, { color: primaryColor }]}>Regístrate</Text>
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
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    appDescription: {
        marginTop: 8,
        textAlign: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
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
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotPassword: {
        fontWeight: '500',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    registerLink: {
        fontWeight: '500',
    }
});