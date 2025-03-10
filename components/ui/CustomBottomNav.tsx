import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { HomeIcon, CarIcon, BarChartIcon, SettingsIcon } from '@/components/ui/Icons';

// Array de rutas de navegación principal
const routes = [
    { name: 'index', path: '/' as const, label: 'Inicio', icon: HomeIcon },
    { name: 'vehicles', path: '/vehicles' as const, label: 'Vehículos', icon: CarIcon },
    { name: 'reports', path: '/reports' as const, label: 'Reportes', icon: BarChartIcon },
    { name: 'settings', path: '/settings' as const, label: 'Ajustes', icon: SettingsIcon }
];

const CustomBottomNav = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

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
                backgroundColor: theme.background,
                borderTopColor: theme.border
            }
        ]}>
            {routes.map((route) => {
                const isActive = getIsActive(route.path);
                const Icon = route.icon;
                return (
                    <TouchableOpacity
                        key={route.name}
                        style={styles.tabButton}
                        onPress={() => router.push(route.path)}
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
                            <View
                                style={[
                                    styles.indicator,
                                    { backgroundColor: theme.tabBarActive }
                                ]}
                            />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5,
        position: 'relative',
    },
    tabLabel: {
        fontSize: 10,
        marginTop: 4,
    },
    indicator: {
        position: 'absolute',
        top: 0,
        width: '50%',
        height: 3,
        borderRadius: 2,
    },
});

export default CustomBottomNav;