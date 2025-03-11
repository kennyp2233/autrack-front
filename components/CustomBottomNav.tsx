import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { HomeIcon, CarIcon, BarChartIcon, SettingsIcon } from '@/components/ui/Icons';
import { useTheme } from '@/contexts/ThemeContext';

const routes = [
    { name: 'index', path: '/' as const, label: 'Inicio', icon: HomeIcon },
    { name: 'vehicles', path: '/vehicles' as const, label: 'Vehículos', icon: CarIcon },
    { name: 'reports', path: '/reports' as const, label: 'Reportes', icon: BarChartIcon },
    { name: 'settings', path: '/settings' as const, label: 'Ajustes', icon: SettingsIcon }
];

// Altura base del navbar (sin contar la SafeArea)
const BASE_NAVBAR_HEIGHT = 65;

const CustomBottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { theme, isDark } = useTheme();

    // Determinar qué ruta está activa
    const getIsActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    // Rutas que no deben mostrar el bottom nav
    const hiddenRoutes = [
        '/profile',
        '/vehicles/add',
        '/vehicles/[id]',
        '/vehicles/[id]/edit',
        '/vehicles/[id]/maintenance',
        '/vehicles/[id]/maintenance/add',
        '/vehicles/[id]/maintenance/[id]',
        '/reports/export'
    ];

    // Verificar si debemos ocultar la barra de navegación
    const shouldHideNav = hiddenRoutes.some(route => {
        if (route.includes('[id]')) {
            const pattern = route.replace(/\[\w+\]/g, '[^/]+');
            const regex = new RegExp(`^${pattern}$`);
            return regex.test(pathname);
        }
        return pathname === route;
    });

    if (shouldHideNav) {
        return null;
    }

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: 'transparent',
            }
        ]}>
            <SafeAreaView style={[
                styles.safeAreaContainer,
                {
                    backgroundColor: theme.card
                }
            ]}>
                <View style={[
                    styles.navContent,
                    {
                        backgroundColor: theme.card,
                    }
                ]}>
                    {routes.map((route) => {
                        const isActive = getIsActive(route.path);
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
                                    {
                                        color: isActive ? theme.tabBarActive : theme.tabBarInactive
                                    }
                                ]}>
                                    {route.label}
                                </Text>
                                {isActive && <View style={[
                                    styles.indicator,
                                    {
                                        backgroundColor: theme.tabBarActive
                                    }
                                ]} />}
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
        // Para asegurar que la SafeArea funcione correctamente en iOS
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