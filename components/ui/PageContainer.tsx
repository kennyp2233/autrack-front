// components/ui/PageContainer.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface PageContainerProps {
    children: ReactNode;
    style?: ViewStyle;
    statusBarStyle?: 'light-content' | 'dark-content';
}

/**
 * Componente base para todas las páginas de la aplicación
 * Proporciona un contenedor con estilos consistentes y StatusBar configurado
 */
const PageContainer: React.FC<PageContainerProps> = ({
    children,
    style,
    statusBarStyle
}) => {
    const { theme, isDark } = useTheme();

    // Si no se especifica el estilo de StatusBar, usar automático según tema
    const barStyle = statusBarStyle || (isDark ? 'light-content' : 'dark-content');

    return (
        <View style={[
            styles.container,
            { backgroundColor: theme.background },
            style
        ]}>
            <StatusBar barStyle={barStyle} backgroundColor={theme.background} />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default PageContainer;