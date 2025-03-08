import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function RecoveryScreen() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{ email?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { forgotPassword } = useAuth();
    const router = useRouter();

    // Validar email
    const isValidEmail = (email: string) => {
        const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return re.test(email);
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors: { email?: string } = {};

        if (!email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Ingrese un correo electrónico válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar recuperación de contraseña
    const handleRecovery = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await forgotPassword(email);
            Alert.alert(
                'Correo enviado',
                'Se ha enviado un correo con instrucciones para recuperar tu contraseña.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error al enviar correo de recuperación:', error);
            Alert.alert('Error', 'No se pudo enviar el correo de recuperación. Inténtelo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Recuperar contraseña</Text>
            </View>

            <Text style={styles.description}>
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo electrónico</Text>
                <View style={styles.inputWrapper}>
                    <Feather name="mail" size={18} color="#999" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="tu@email.com"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (errors.email) {
                                setErrors({});
                            }
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleRecovery}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>
                    {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    description: {
        marginBottom: 24,
        color: '#666',
    },
    inputContainer: {
        marginBottom: 24,
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
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 48,
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: 12,
    },
    button: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
    },
});