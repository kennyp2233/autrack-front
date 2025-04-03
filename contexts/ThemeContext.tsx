import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';

// Base colors
const baseColors = {
    primary: '#333333',
    secondary: '#9D8B70',
    success: '#4CAF50',
    warning: '#E6A700',  // Más oscuro que el original para mejor contraste
    danger: '#F24E1E',
    info: '#2196F3',
    background: '#F5F5F5',
    cardBackground: '#FFFFFF',
    textPrimary: '#333333',
    textSecondary: '#555555', // Más oscuro que el original para mejor contraste
    border: '#D1D5DB',        // Más oscuro que el original

}

// Light theme
export const lightTheme = {
    // Base colors
    primary: baseColors.primary,
    secondary: baseColors.secondary,
    success: baseColors.success,
    warning: baseColors.warning,
    danger: baseColors.danger,
    info: baseColors.info,

    // Backgrounds
    background: baseColors.background,
    card: baseColors.cardBackground,

    // Text
    text: baseColors.textPrimary,
    secondaryText: baseColors.textSecondary,

    // UI Elements
    border: baseColors.border,
    notification: baseColors.danger,
    progressBarBackground: baseColors.border,
    progressBarFill: baseColors.success,

    // Navigation
    tabBarActive: baseColors.secondary,
    tabBarInactive: '#888888',   // Más oscuro para mejor contraste
    navbarBackground: baseColors.cardBackground,
    navbarText: '#A28B69',        // Tono medio para mantener estética con mejor contraste

    // States
    scheduled: baseColors.warning,
    completed: baseColors.success,
}

// Dark theme - derivado de los mismos colores base pero ajustado para modo oscuro
export const darkTheme = {
    // Base colors (ajustados para modo oscuro)
    primary: '#1A1A24',
    secondary: '#D4C5A9',  // Versión más clara para mejor contraste en oscuro
    success: '#4ECB71',
    warning: '#FFC857',
    danger: '#FF6B6B',
    info: '#2196F3',

    // Backgrounds
    background: '#121218',
    card: '#222230',

    // Text
    text: '#FFFFFF',
    secondaryText: '#CCCCCC',  // Más claro para mejor contraste

    // UI Elements
    border: '#2D2D3A',
    notification: '#FF6B6B',
    progressBarBackground: '#2D2D3A',
    progressBarFill: '#4ECB71',

    // Navigation
    tabBarActive: '#D4C5A9',
    tabBarInactive: '#8C8C8C',
    navbarBackground: '#1A1A24',
    navbarText: '#D4C5A9',

    // States
    scheduled: '#FFC857',
    completed: '#4ECB71',
}

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