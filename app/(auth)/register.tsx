import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{
        fullName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        acceptTerms?: string;
    }>({});

    const { register, isLoading } = useAuth();
    const router = useRouter();

    // Validar email
    const isValidEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors: {
            fullName?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
            acceptTerms?: string;
        } = {};

        if (!fullName) {
            newErrors.fullName = 'El nombre completo es requerido';
        }

        if (!email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Ingrese un correo electrónico válido';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirme su contraseña';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!acceptTerms) {
            newErrors.acceptTerms = 'Debe aceptar los términos y condiciones';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar registro
    const handleRegister = async () => {
        if (!validateForm()) return;

        try {
            await register({
                fullName,
                email,
                password,
                confirmPassword,
                acceptTerms
            });
            // La navegación se maneja dentro del AuthContext si el registro es exitoso
        } catch (error) {
            // El error ya se maneja en el contexto, no es necesario hacer nada aquí
            console.log("Error capturado en pantalla de registro:", error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        disabled={isLoading}
                    >
                        <Feather name="chevron-left" size={24} color="#4B5563" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Crear cuenta</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    {/* Full Name Field */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Nombre completo</Text>
                        <View style={[
                            styles.inputWrapper, 
                            errors.fullName ? styles.inputError : null
                        ]}>
                            <Feather name="user" size={18} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre y apellido"
                                value={fullName}
                                onChangeText={(text) => {
                                    setFullName(text);
                                    if (errors.fullName) {
                                        setErrors({ ...errors, fullName: undefined });
                                    }
                                }}
                                editable={!isLoading}
                            />
                        </View>
                        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                    </View>

                    {/* Email Field */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Correo electrónico</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.email ? styles.inputError : null
                        ]}>
                            <Feather name="mail" size={18} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="tu@email.com"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (errors.email) {
                                        setErrors({ ...errors, email: undefined });
                                    }
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    {/* Password Field */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Contraseña</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.password ? styles.inputError : null
                        ]}>
                            <Feather name="lock" size={18} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) {
                                        setErrors({ ...errors, password: undefined });
                                    }
                                }}
                                secureTextEntry={!showPassword}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={styles.passwordToggle}
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    {/* Confirm Password Field */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Confirmar contraseña</Text>
                        <View style={[
                            styles.inputWrapper,
                            errors.confirmPassword ? styles.inputError : null
                        ]}>
                            <Feather name="lock" size={18} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Repetir contraseña"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (errors.confirmPassword) {
                                        setErrors({ ...errors, confirmPassword: undefined });
                                    }
                                }}
                                secureTextEntry={!showConfirmPassword}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={styles.passwordToggle}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    {/* Terms and Conditions */}
                    <View style={styles.termsContainer}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => {
                                setAcceptTerms(!acceptTerms);
                                if (errors.acceptTerms) {
                                    setErrors({ ...errors, acceptTerms: undefined });
                                }
                            }}
                            disabled={isLoading}
                        >
                            <View style={[styles.checkbox, acceptTerms ? styles.checkboxChecked : null]}>
                                {acceptTerms && <Feather name="check" size={12} color="white" />}
                            </View>
                        </TouchableOpacity>

                        <View style={styles.termsTextContainer}>
                            <Text style={styles.termsText}>
                                Acepto los{' '}
                                <Text style={styles.termsLink}>términos y condiciones</Text> y la{' '}
                                <Text style={styles.termsLink}>política de privacidad</Text>
                            </Text>
                            {errors.acceptTerms && <Text style={styles.errorText}>{errors.acceptTerms}</Text>}
                        </View>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text style={styles.registerButtonText}>Crear cuenta</Text>
                                <Feather name="arrow-right" size={18} color="white" style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity disabled={isLoading}>
                                <Text style={styles.loginLink}>Inicia sesión</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    backButton: {
        padding: 4,
        marginRight: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
    },
    formContainer: {
        paddingHorizontal: 24,
        flex: 1,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },
    passwordToggle: {
        padding: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    termsContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    checkboxContainer: {
        padding: 4,
        marginRight: 4,
    },
    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    termsTextContainer: {
        flex: 1,
    },
    termsText: {
        fontSize: 14,
        color: '#4B5563',
        flexWrap: 'wrap',
    },
    termsLink: {
        color: '#3B82F6',
        fontWeight: '500',
    },
    registerButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        height: 48,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    registerButtonDisabled: {
        backgroundColor: '#a8c7fa',
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#6B7280',
    },
    loginLink: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '500',
    },
});