import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface HomeHeaderProps {
    onNotificationPress?: () => void;
    scrollY: Animated.Value;
    theme: any;
}

// Constantes para la animación del header
const HEADER_MAX_HEIGHT = 220;
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HomeHeader: React.FC<HomeHeaderProps> = ({
    onNotificationPress,
    scrollY,
    theme
}) => {
    const { user } = useAuth();
    const router = useRouter();
    const [notificationCount, setNotificationCount] = useState(2);
    const [greeting, setGreeting] = useState('');
    const bellShakeAnim = useRef(new Animated.Value(0)).current;

    // Actualizar saludo y hora al iniciar
    useEffect(() => {
        updateGreetingAndTime();
        const intervalId = setInterval(updateGreetingAndTime, 60000);

        // Animar el icono de notificación si hay notificaciones
        if (notificationCount > 0) {
            startBellAnimation();
        }

        return () => clearInterval(intervalId);
    }, [notificationCount]);

    // Obtener saludo según hora del día y formatear hora actual
    const updateGreetingAndTime = () => {
        const now = new Date();
        const hour = now.getHours();

        // Establecer saludo
        if (hour >= 5 && hour < 12) {
            setGreeting('Buenos días');
        } else if (hour >= 12 && hour < 19) {
            setGreeting('Buenas tardes');
        } else {
            setGreeting('Buenas noches');
        }

    };

    // Animar el icono de campana
    const startBellAnimation = () => {
        Animated.sequence([
            Animated.timing(bellShakeAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.bounce,
                useNativeDriver: true
            }),
            Animated.timing(bellShakeAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.bounce,
                useNativeDriver: true
            })
        ]).start();
    };

    // Obtener nombre del usuario
    const firstName = user?.fullName
        ? user.fullName.split(' ')[0]
        : 'Usuario';

    // Manejar click en notificaciones
    const handleNotificationPress = () => {
        if (onNotificationPress) {
            onNotificationPress();
        } else {
            // Simulación: limpiar notificaciones
            setNotificationCount(0);
        }
    };

    // Manejar click en perfil
    const handleProfilePress = () => {
        router.push('/profile');
    };

    // Animaciones basadas en el scroll
    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp'
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.9, 0.8],
        extrapolate: 'clamp'
    });

    const greetingOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    const greetingTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -20],
        extrapolate: 'clamp'
    });

    const nameOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 1.5, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1, 0.8],
        extrapolate: 'clamp'
    });

    const nameScale = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.85],
        extrapolate: 'clamp'
    });

    const nameTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -10],
        extrapolate: 'clamp'
    });

    // Animación de vibración para el icono de notificación
    const bellShake = bellShakeAnim.interpolate({
        inputRange: [0, 0.3, 0.5, 0.7, 1],
        outputRange: [0, -3, 0, 3, 0]
    });

    // Colores para el gradiente basados en el tema
    const gradientColors: readonly [string, string, string] = theme.isDark
        ? [theme.primary, `${theme.primary}E6`, `${theme.primary}80`]
        : [theme.primary, `${theme.primary}F2`, `${theme.primary}CC`];

    // Color de texto (siempre blanco para garantizar contraste)
    const textColor = '#FFFFFF';

    return (
        <Animated.View
            style={[
                styles.headerContainer,
                {
                    height: headerHeight,
                    opacity: headerOpacity,
                }
            ]}
        >
            {/* Gradiente de fondo con efecto de profundidad */}
            <LinearGradient
                colors={gradientColors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContent}>
                    {/* Sección de información del usuario */}
                    <View style={styles.profileSection}>

                        {/* Saludo según hora del día */}
                        <Animated.Text
                            style={[
                                styles.greeting,
                                {
                                    opacity: greetingOpacity,
                                    transform: [{ translateY: greetingTranslateY }],
                                    color: textColor
                                }
                            ]}
                        >
                            {greeting}
                        </Animated.Text>

                        {/* Nombre del usuario */}
                        <Animated.Text
                            style={[
                                styles.userName,
                                {
                                    opacity: nameOpacity,
                                    transform: [
                                        { scale: nameScale },
                                        { translateY: nameTranslateY }
                                    ],
                                    color: textColor
                                }
                            ]}
                        >
                            {firstName}
                        </Animated.Text>
                    </View>

                    {/* Botones de acciones */}
                    <View style={styles.actionsContainer}>
                        {/* Botón de perfil */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                            onPress={handleProfilePress}
                            activeOpacity={0.7}
                        >
                            <Feather name="user" size={22} color={textColor} />
                        </TouchableOpacity>

                        {/* Botón de notificaciones con animación */}
                        <TouchableOpacity
                            style={[styles.actionButton,
                            { backgroundColor: 'rgba(255, 255, 255, 0.2)', marginLeft: 12 }
                            ]}
                            onPress={handleNotificationPress}
                            activeOpacity={0.7}
                        >
                            <Animated.View
                                style={{
                                    transform: [{ translateX: bellShake }]
                                }}
                            >
                                <Feather name="bell" size={22} color={textColor} />
                                {notificationCount > 0 && (
                                    <View
                                        style={[
                                            styles.notificationBadge,
                                            {
                                                backgroundColor: theme.notification || theme.danger,
                                            }
                                        ]}
                                    >
                                        <Text style={styles.notificationBadgeText}>
                                            {notificationCount}
                                        </Text>
                                    </View>
                                )}
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Indicador visual para scroll */}
                <Animated.View
                    style={[
                        styles.scrollIndicator,
                        {
                            opacity: greetingOpacity,
                        }
                    ]}
                >
                    <View style={styles.scrollIndicatorLine} />
                </Animated.View>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 10,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        flex: 1,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 12 : 16,
        flex: 1,
    },
    profileSection: {
        flex: 1,
    },

    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    userName: {
        fontSize: 20,
        fontWeight: '600',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        minWidth: 18,
        height: 18,
        paddingHorizontal: 4,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.9)',
    },
    notificationBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollIndicator: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    scrollIndicatorLine: {
        width: 36,
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    }
});

export default HomeHeader;