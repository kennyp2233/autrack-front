import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';

// Define theme colors para coincidir con el diseño mostrado en la imagen
export const lightTheme = {
    primary: '#333333', // Color oscuro para el header
    background: '#F5F5F5', // Color de fondo gris claro
    card: '#FFFFFF',
    text: '#333333', // Texto principal oscuro
    secondaryText: '#666666', // Texto secundario gris
    border: '#E5E7EB',
    notification: '#F24E1E', // Color rojo para notificaciones
    success: '#4CAF50', // Verde para barras de progreso/éxito
    warning: '#FFC107', // Amarillo para alertas moderadas/advertencias
    urgent: '#F24E1E', // Rojo para alertas urgentes
    scheduled: '#FFC107', // Amarillo para eventos programados
    completed: '#4CAF50', // Verde para completados
    iconBackground: '#FFFFFF', // Fondo de iconos blanco
    progressBarBackground: '#E5E7EB', // Fondo de barra de progreso gris claro
    progressBarFill: '#4CAF50', // Relleno de barra de progreso verde
    tabBarActive: '#9D8B70', // Color activo de tab bar beige/marrón claro
    tabBarInactive: '#AEAEAE', // Color inactivo de tab bar gris
    navbarBackground: '#FFFFFF', // Fondo de navbar blanco
    navbarText: '#B5A48A', // Texto de navbar en color beige/marrón más claro
    buttonPrimary: '#9D8B70', // Color de botón primario beige/marrón
    buttonSecondary: '#E5E7EB', // Color de botón secundario gris claro
};

export const darkTheme = {
    primary: '#1A1A24', // Un color más oscuro para el header, menos azulado
    background: '#121218', // Fondo oscuro con un toque gris
    card: '#222230', // Color de tarjeta un poco más claro que el fondo
    text: '#FFFFFF', // Texto principal blanco
    secondaryText: '#B0B0B0', // Texto secundario gris claro
    border: '#2D2D3A', // Bordes sutilmente visibles
    notification: '#FF6B6B', // Rojo vibrante para notificaciones
    success: '#4ECB71', // Verde más vibrante 
    warning: '#FFC857', // Amarillo más vibrante
    urgent: '#FF6B6B', // Rojo para alertas urgentes
    scheduled: '#FFC857', // Amarillo para programados
    completed: '#4ECB71', // Verde para completados
    iconBackground: '#2D2D3A', // Fondo de iconos ligeramente más claro
    progressBarBackground: '#2D2D3A', // Fondo de barra ligeramente visible
    progressBarFill: '#4ECB71', // Verde vibrante para progreso
    tabBarActive: '#D4C5A9', // Versión más clara del beige/marrón para mejor visibilidad
    tabBarInactive: '#8C8C8C', // Gris medio para elementos inactivos
    navbarBackground: '#1A1A24', // Fondo de navbar consistente
    navbarText: '#D4C5A9', // Texto en color beige/marrón más claro
    buttonPrimary: '#D4C5A9', // Color de botón primario más claro
    buttonSecondary: '#2D2D3A', // Color de botón secundario
};

// Create the theme context
type ThemeType = typeof lightTheme;
type ThemeContextType = {
    theme: ThemeType;
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    isDark: false,
    toggleTheme: () => { },
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const deviceTheme = useColorScheme();
    const [isDark, setIsDark] = useState(deviceTheme === 'dark');

    // Set theme based on device theme
    useEffect(() => {
        setIsDark(deviceTheme === 'dark');
    }, [deviceTheme]);

    // Toggle theme function
    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);