import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';

// Define theme colors
export const lightTheme = {
    primary: '#3B82F6', // Blue color from the app
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1F2937',
    secondaryText: '#6B7280',
    border: '#E5E7EB',
    notification: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    urgent: '#EF4444',
    scheduled: '#F59E0B',
    completed: '#10B981',
    iconBackground: '#EBF5FF',
    progressBarBackground: '#E5E7EB',
    progressBarFill: '#10B981',
    tabBarActive: '#3B82F6',
    tabBarInactive: '#9CA3AF',
    navbarBackground: '#1F2937',
    navbarText: '#FFFFFF',
};

export const darkTheme = {
    primary: '#60A5FA', // Lighter blue for dark theme
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    secondaryText: '#9CA3AF',
    border: '#374151',
    notification: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    urgent: '#F87171',
    scheduled: '#FBBF24',
    completed: '#34D399',
    iconBackground: '#374151',
    progressBarBackground: '#374151',
    progressBarFill: '#34D399',
    tabBarActive: '#60A5FA',
    tabBarInactive: '#6B7280',
    navbarBackground: '#111827',
    navbarText: '#F9FAFB',
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