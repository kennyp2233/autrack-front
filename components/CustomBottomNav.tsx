import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { HomeIcon, CarIcon, BarChartIcon, SettingsIcon } from '@/components/ui/Icons';
import { useTheme } from '@/contexts/ThemeContext';

// Definición mejorada de rutas con patrones para identificar pantallas hijas
const routes = [
    {
        name: 'home',
        path: '/',
        label: 'Inicio',
        icon: HomeIcon,
        // Patrón para identificar cuando esta ruta está activa
        pattern: /^\/$/
    },
    {
        name: 'vehicles',
        path: '/vehicles',
        label: 'Vehículos',
        icon: CarIcon,
        // Patrón para identificar cuando cualquier subruta de vehículos está activa
        pattern: /^\/vehicles($|\/)/
    },
    {
        name: 'reports',
        path: '/reports',
        label: 'Reportes',
        icon: BarChartIcon,
        pattern: /^\/reports($|\/)/
    },
    {
        name: 'settings',
        path: '/settings',
        label: 'Ajustes',
        icon: SettingsIcon,
        pattern: /^\/settings($|\/)/
    }
];

// Altura base del navbar
const BASE_NAVBAR_HEIGHT = 65;

const CustomBottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
            <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: theme.card }]}>
                <View style={[styles.navContent, { backgroundColor: theme.card }]}>
                    {routes.map((route) => {
                        // Comprobar si la ruta actual coincide con el patrón de esta pestaña
                        const isActive = route.pattern.test(pathname);
                        const Icon = route.icon;

                        return (
                            <TouchableOpacity
                                key={route.name}
                                style={styles.tabButton}
                                onPress={() => router.push(route.path as any)}
                                accessibilityRole="button"
                                accessibilityLabel={route.label}
                                accessibilityState={{ selected: isActive }}
                            >
                                <Icon
                                    size={24}
                                    color={isActive ? theme.tabBarActive : theme.tabBarInactive}
                                />
                                <Text style={[
                                    styles.tabLabel,
                                    { color: isActive ? theme.tabBarActive : theme.tabBarInactive }
                                ]}>
                                    {route.label}
                                </Text>
                                {isActive && (
                                    <View style={[
                                        styles.indicator,
                                        { backgroundColor: theme.tabBarActive }
                                    ]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    safeAreaContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    navContent: {
        flexDirection: 'row',
        height: BASE_NAVBAR_HEIGHT,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        width: 24,
        height: 3,
        borderRadius: 1.5,
        marginBottom: 5,
    },
});

export default CustomBottomNav;