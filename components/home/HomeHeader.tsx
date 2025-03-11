import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

interface HomeHeaderProps {
    onNotificationPress?: () => void;
    scrollY: Animated.Value;
}

const HEADER_MAX_HEIGHT = 150; // Altura máxima del header
const HEADER_MIN_HEIGHT = 70; // Altura mínima del header (contraído)
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HomeHeader: React.FC<HomeHeaderProps> = ({
    onNotificationPress,
    scrollY
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
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp'
    });

    const greetingOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp'
    });

    const nameScale = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 0.8],
        extrapolate: 'clamp'
    });

    const nameTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -10],
        extrapolate: 'clamp'
    });

    return (
        <Animated.View
            style={[
                styles.headerContainer,
                {
                    height: headerHeight,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    zIndex: 100,
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
                                    opacity: greetingOpacity
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
                                    ]
                                }
                            ]}
                        >
                            {firstName}
                        </Animated.Text>
                    </View>

                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={handleNotificationPress}
                    >
                        <Feather name="bell" size={24} color="white" />
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationBadgeText}>2</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#333',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        flex: 1,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        flex: 1,
    },
    greeting: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    userName: {
        color: 'white',
        opacity: 0.9,
        fontSize: 16,
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#ff3b30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default HomeHeader;