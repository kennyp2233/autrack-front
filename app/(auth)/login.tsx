import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const { login, isLoading } = useAuth();
    const { theme } = useTheme(); // Usar el tema

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
        router.replace('/(app)');
        return true;

        if (!validateForm()) return;
        try {
            await login({ email, password, rememberMe });
        } catch (error) {
            // El error ya se maneja en el contexto, no es necesario hacer nada aquí
            console.log("Error capturado en pantalla de login:", error);
        }
    };

    // Definir colores del tema
    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const primaryColor = theme.primary;
    const cardColor = theme.card;
    const backgroundColor = theme.background;
    const errorColor = theme.danger || '#EF4444';
    const borderColor = theme.border;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: primaryColor }]}>
                    <Feather name="truck" size={32} color="white" />
                </View>
                <Text style={[styles.appName, { color: textColor }]}>Mi Garaje</Text>
                <Text style={[styles.appDescription, { color: secondaryTextColor }]}>Gestiona el mantenimiento de tus vehículos</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                <Text style={[styles.title, { color: textColor }]}>Iniciar sesión</Text>

                {/* Email */}
                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Correo electrónico</Text>
                    <View style={[
                        styles.inputWrapper,
                        { borderColor: errors.email ? errorColor : borderColor },
                        { backgroundColor: cardColor }
                    ]}>
                        <Feather name="mail" size={18} color={secondaryTextColor} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: textColor }]}
                            placeholder="tu@email.com"
                            placeholderTextColor={secondaryTextColor}
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
                    {errors.email && <Text style={[styles.errorText, { color: errorColor }]}>{errors.email}</Text>}
                </View>

                {/* Password */}
                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: textColor }]}>Contraseña</Text>
                    <View style={[
                        styles.inputWrapper,
                        { borderColor: errors.password ? errorColor : borderColor },
                        { backgroundColor: cardColor }
                    ]}>
                        <Feather name="lock" size={18} color={secondaryTextColor} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: textColor }]}
                            placeholder="••••••••"
                            placeholderTextColor={secondaryTextColor}
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
                            <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={secondaryTextColor} />
                        </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={[styles.errorText, { color: errorColor }]}>{errors.password}</Text>}
                </View>

                {/* Remember Me and Forgot Password */}
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setRememberMe(!rememberMe)}
                        disabled={isLoading}
                    >
                        <View style={[
                            styles.checkbox,
                            {
                                borderColor: rememberMe ? primaryColor : borderColor,
                                backgroundColor: rememberMe ? primaryColor : 'transparent'
                            }
                        ]}>
                            {rememberMe && <Feather name="check" size={12} color="white" />}
                        </View>
                        <Text style={{ color: textColor }}>Recordarme</Text>
                    </TouchableOpacity>

                    <Link href="/(auth)/recovery" asChild>
                        <TouchableOpacity disabled={isLoading}>
                            <Text style={[styles.forgotPassword, { color: primaryColor }]}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={[
                        styles.loginButton,
                        { backgroundColor: isLoading ? `${primaryColor}80` : primaryColor }
                    ]}
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
                    <Text style={{ color: secondaryTextColor }}>¿No tienes una cuenta? </Text>
                    <Link href="/(auth)/register" asChild>
                        <TouchableOpacity disabled={isLoading}>
                            <Text style={[styles.registerLink, { color: primaryColor }]}>Regístrate</Text>
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
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 48,
    },
    errorText: {
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
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotPassword: {
        fontWeight: '500',
    },
    loginButton: {
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
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
        fontWeight: '500',
    },
});