import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

interface StaticHeaderProps {
    title: string;
    showBackButton?: boolean;
    rightIcon?: string;
    onRightIconPress?: () => void;
    theme?: any; // Idealmente definiríamos un tipo ThemeType
}

const StaticHeader: React.FC<StaticHeaderProps> = ({
    title,
    showBackButton = true,
    rightIcon,
    onRightIconPress,
    theme
}) => {
    const router = useRouter();

    // Si no se proporciona un tema, usamos valores predeterminados
    const headerBg = theme?.primary || '#333333';
    const textColor = theme?.navbarText || '#FFFFFF';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: headerBg }]}>
            <View style={styles.statusBarPlaceholder} />
            <View style={styles.headerContent}>
                {showBackButton ? (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Feather name="arrow-left" size={24} color={textColor} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholderWidth} />
                )}

                <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
                    {title}
                </Text>

                {rightIcon ? (
                    <TouchableOpacity
                        style={styles.rightButton}
                        onPress={onRightIconPress}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Feather name={rightIcon as any} size={24} color={textColor} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholderWidth} />
                )}
            </View>
        </SafeAreaView>
    );
};

const HEADER_HEIGHT = 56;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        // Sombra para dar efecto de elevación
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
    },
    statusBarPlaceholder: {
        height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerContent: {
        height: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 8,
    },
    rightButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    placeholderWidth: {
        width: 40, // Aproximadamente el ancho del botón
    },
});

export default StaticHeader;