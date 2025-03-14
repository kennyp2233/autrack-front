import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

interface HomeHeaderProps {
    onNotificationPress?: () => void;
    scrollY: Animated.Value;
    theme: any; // Usamos any por ahora, idealmente definiríamos el tipo ThemeType
}

// Aumentamos la altura máxima para que el contenido se sobreponga
const HEADER_MAX_HEIGHT = 220; // Altura máxima del header, aumentada
const HEADER_MIN_HEIGHT = 80; // Altura mínima del header (contraído), ligeramente aumentada
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HomeHeader: React.FC<HomeHeaderProps> = ({
    onNotificationPress,
    scrollY,
    theme
}) => {
    const { user } = useAuth();

    // Get user's first name for greeting
    const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Usuario';

    // Handle notification press
    const handleNotificationPress = () => {
        if (onNotificationPress) {
            onNotificationPress();
        } else {
            // Default notification handling
            console.log('Notification pressed');
        }
    };

    // Animaciones basadas en el valor de scroll
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
                    backgroundColor: theme.primary,
                }
            ]}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContent}>
                    <View>
                        <Animated.Text
                            style={[
                                styles.greeting,
                                {
                                    opacity: greetingOpacity,
                                    color: textColor
                                }
                            ]}
                        >
                            Buenos días
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
                    </View>

                    <TouchableOpacity
                        style={[styles.notificationButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                        onPress={handleNotificationPress}
                    >
                        <Feather name="bell" size={24} color={textColor} />
                        <View
                            style={[
                                styles.notificationBadge,
                                {
                                    backgroundColor: theme.notification,
                                    borderColor: theme.primary
                                }
                            ]}
                        >
                            <Text style={[styles.notificationBadgeText, { color: textColor }]}>2</Text>
                        </View>
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
        zIndex: 10,
        // Sombra para dar efecto de elevación
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
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
        top: 0,
        right: 0,
        width: 18,
        height: 18,
        borderRadius: 9,
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