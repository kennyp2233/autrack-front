import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeHeaderProps {
    onNotificationPress?: () => void;
    onProfilePress?: () => void;
    scrollY: Animated.Value;
    theme: any; // Idealmente definiríamos un tipo ThemeType específico
}

// Mantenemos las mismas constantes del diseño original
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HomeHeader: React.FC<HomeHeaderProps> = ({
    onNotificationPress,
    onProfilePress,
    scrollY,
    theme
}) => {
    const { user } = useAuth();
    const [notificationCount, setNotificationCount] = useState(2);
    const [timeOfDay, setTimeOfDay] = useState('');

    // Actualizar la hora del día al iniciar
    useEffect(() => {
        updateTimeOfDay();
        // Opcionalmente: Configurar un intervalo para actualizar el saludo durante una sesión larga
        const intervalId = setInterval(updateTimeOfDay, 60000);
        return () => clearInterval(intervalId);
    }, []);

    // Obtener saludo según hora del día
    const updateTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            setTimeOfDay('Buenos días');
        } else if (hour >= 12 && hour < 19) {
            setTimeOfDay('Buenas tardes');
        } else {
            setTimeOfDay('Buenas noches');
        }
    };

    // Get user's first name for greeting
    const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Usuario';

    // Handle notification press
    const handleNotificationPress = () => {
        if (onNotificationPress) {
            onNotificationPress();
        } else {
            console.log('Notification pressed');
        }
    };

    // Handle profile press
    const handleProfilePress = () => {
        if (onProfilePress) {
            onProfilePress();
        } else {
            console.log('Profile pressed');
        }
    };

    // Animaciones basadas en el valor de scroll (manteniendo los originales)
    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp'
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.8, 0.6],
        extrapolate: 'clamp'
    });

    const headerScale = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.95],
        extrapolate: 'clamp'
    });

    const greetingOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp'
    });

    const nameScale = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.85],
        extrapolate: 'clamp'
    });

    const nameTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -5],
        extrapolate: 'clamp'
    });

    // Colores para el gradiente basados en el tema
    const gradientColors: readonly [string, string, string] = theme.isDark
        ? [theme.primary, `${theme.primary}E6`, `${theme.primary}80`]
        : [theme.primary, `${theme.primary}F2`, `${theme.primary}CC`];

    // Aseguramos colores de alto contraste para texto sobre el fondo primario
    const textColor = '#FFFFFF'; // Blanco para garantizar contraste sobre fondos oscuros

    return (
        <Animated.View
            style={[
                styles.headerContainer,
                {
                    height: headerHeight,
                    opacity: headerOpacity,
                    transform: [{ scale: headerScale }],
                }
            ]}
        >
            {/* Gradiente para mejorar la apariencia del header */}
            <LinearGradient
                colors={gradientColors}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleProfilePress}
                        style={styles.profileSection}
                    >
                        <Animated.Text
                            style={[
                                styles.greeting,
                                {
                                    opacity: greetingOpacity,
                                    color: textColor
                                }
                            ]}
                        >
                            {timeOfDay}
                        </Animated.Text>
                        <Animated.Text
                            style={[
                                styles.userName,
                                {
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
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.notificationButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                        onPress={handleNotificationPress}
                        activeOpacity={0.7}
                    >
                        <Feather name="bell" size={24} color={textColor} />
                        {notificationCount > 0 && (
                            <View
                                style={[
                                    styles.notificationBadge,
                                    {
                                        backgroundColor: theme.notification || theme.danger,
                                        borderColor: 'rgba(255, 255, 255, 0.3)'
                                    }
                                ]}
                            >
                                <Text style={[styles.notificationBadgeText, { color: textColor }]}>
                                    {notificationCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1,
        // Sombra para dar efecto de elevación
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
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
        paddingTop: 20,
        paddingBottom: 30,
        flex: 1,
    },
    profileSection: {
        flex: 1,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userName: {
        opacity: 0.9,
        fontSize: 18,
    },
    notificationButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    notificationBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default HomeHeader;