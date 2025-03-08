import { Tabs } from 'expo-router';
import { HomeIcon, CarIcon, WrenchIcon, BarChartIcon, SettingsIcon } from '@/components/ui/Icons';

export default function AppLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                paddingBottom: 5,
                height: 60
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="vehicles"
                options={{
                    title: 'Vehículos',
                    tabBarIcon: ({ color }) => <CarIcon size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reportes',
                    tabBarIcon: ({ color }) => <BarChartIcon size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Ajustes',
                    tabBarIcon: ({ color }) => <SettingsIcon size={24} color={color} />
                }}
            />

            {/* Ocultar otras pantallas de la navegación por pestañas */}
            <Tabs.Screen name="profile" options={{ href: null }} />
            <Tabs.Screen name="vehicles/[id]" options={{ href: null }} />
            <Tabs.Screen name="vehicles/add" options={{ href: null }} />
            <Tabs.Screen name="vehicles/[id]/edit" options={{ href: null }} />
            <Tabs.Screen name="vehicles/[id]/maintenance" options={{ href: null }} />
            <Tabs.Screen name="vehicles/[id]/maintenance/add" options={{ href: null }} />
            <Tabs.Screen name="vehicles/[id]/maintenance/[id]" options={{ href: null }} />
            <Tabs.Screen name="reports/export" options={{ href: null }} />
        </Tabs>
    );
}