import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const { login, isLoading } = useAuth();

    // Validar email
    const isValidEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Ingrese un correo electrónico válido';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar inicio de sesión
    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            await login({ email, password, rememberMe });
        } catch (error) {
            // El error ya se maneja en el contexto, no es necesario hacer nada aquí
            console.log("Error capturado en pantalla de login:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Feather name="truck" size={32} color="white" />
                </View>
                <Text style={styles.appName}>Mi Garaje</Text>
                <Text style={styles.appDescription}>Gestiona el mantenimiento de tus vehículos</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                <Text style={styles.title}>Iniciar sesión</Text>

                {/* Email */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <View style={[
                        styles.inputWrapper,
                        errors.email ? styles.inputWrapperError : null
                    ]}>
                        <Feather name="mail" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="tu@email.com"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) setErrors({ ...errors, email: undefined });
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                    </View>
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                {/* Password */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={[
                        styles.inputWrapper,
                        errors.password ? styles.inputWrapperError : null
                    ]}>
                        <Feather name="lock" size={18} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) setErrors({ ...errors, password: undefined });
                            }}
                            secureTextEntry={!showPassword}
                            editable={!isLoading}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#999" />
                        </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                {/* Remember Me and Forgot Password */}
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setRememberMe(!rememberMe)}
                        disabled={isLoading}
                    >
                        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                            {rememberMe && <Feather name="check" size={12} color="white" />}
                        </View>
                        <Text>Recordarme</Text>
                    </TouchableOpacity>

                    <Link href="/(auth)/recovery" asChild>
                        <TouchableOpacity disabled={isLoading}>
                            <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                    )}
                </TouchableOpacity>

                {/* Register Link */}
                <View style={styles.registerContainer}>
                    <Text>¿No tienes una cuenta? </Text>
                    <Link href="/(auth)/register" asChild>
                        <TouchableOpacity disabled={isLoading}>
                            <Text style={styles.registerLink}>Regístrate</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#3B82F6',
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
        color: '#666',
    },
    formContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    inputWrapperError: {
        borderColor: '#ff3b30',
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 48,
    },
    errorText: {
        color: '#ff3b30',
        marginTop: 4,
        fontSize: 12,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    forgotPassword: {
        color: '#3B82F6',
    },
    loginButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonDisabled: {
        backgroundColor: '#a8c7fa',
    },
    loginButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerLink: {
        color: '#3B82F6',
        fontWeight: '500',
    },
});