// components/common/headers/BaseHeader.tsx
import React, { ReactNode } from 'react';
import { View, StatusBar, SafeAreaView, StyleSheet, Platform } from 'react-native';

interface BaseHeaderProps {
    children: ReactNode;
    backgroundColor: string;
    statusBarStyle?: 'light-content' | 'dark-content';
    translucent?: boolean;
    rounded?: boolean;
    elevation?: number;
}

/**
 * Componente base para todos los headers de la aplicación
 * Maneja consistentemente la barra de estado y el diseño general
 */
const BaseHeader: React.FC<BaseHeaderProps> = ({
    children,
    backgroundColor,
    statusBarStyle = 'light-content',
    translucent = true,
    rounded = true,
    elevation = 6
}) => {
    return (
        <>
            <StatusBar
                backgroundColor={translucent ? 'transparent' : backgroundColor}
                barStyle={statusBarStyle}
                translucent={translucent}
            />

            <SafeAreaView
                style={[
                    styles.container,
                    {
                        backgroundColor,
                        borderBottomLeftRadius: rounded ? 15 : 0,
                        borderBottomRightRadius: rounded ? 15 : 0,
                        elevation: elevation,
                        shadowOpacity: elevation / 24, // Proporción razonable para sombras iOS
                    }
                ]}
            >
                <View style={styles.content}>
                    {children}
                </View>
            </SafeAreaView>
        </>
    );
};

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        zIndex: 10,
    },
    content: {
        width: '100%',
    }
});

export default BaseHeader;