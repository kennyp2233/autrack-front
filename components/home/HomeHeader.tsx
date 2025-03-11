import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

interface HomeHeaderProps {
    onNotificationPress?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
    onNotificationPress,
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

    return (
        <View style={styles.headerContainer}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>Buenos días</Text>
                        <Text style={styles.userName}>{firstName}</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',  // Absolute position to be behind everything
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#333',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 60, // Extra space at the bottom for content overlap
        zIndex: 1, // Lower zIndex to ensure it stays behind other components
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    greeting: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    userName: {
        color: 'white',
        opacity: 0.9,
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2, // Higher zIndex to ensure the button is clickable
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