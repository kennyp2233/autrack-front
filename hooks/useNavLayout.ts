// hooks/useNavLayout.ts
import { usePathname } from 'expo-router';

// Lista de rutas donde NO queremos mostrar la barra de navegación
const noNavBarRoutes = [
    '/vehicles/add',
    '/vehicles/[id]',
    '/vehicles/[id]/edit',
    '/vehicles/[id]/maintenance',
    '/reports/export',
    '/profile',
    // Añade aquí cualquier otra ruta que no deba mostrar la navegación
];

export function useNavLayout() {
    const pathname = usePathname();

    // Verificar si el path actual está en la lista de exclusión
    const hideNavBar = noNavBarRoutes.some(route => {
        // Convertir [id] a expresión regular para coincidir con números
        const routePattern = route.replace(/\[(\w+)\]/g, '\\d+');
        const regex = new RegExp(`^${routePattern}`);
        return regex.test(pathname);
    });

    // Retorna true si debe mostrar navbar, false si no
    return {
        showNavBar: !hideNavBar,
        needsBottomPadding: !hideNavBar
    };
}