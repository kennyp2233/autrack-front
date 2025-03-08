import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/contexts/AuthContext';
// Mantener visible la pantalla de splash hasta que la app esté lista
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Ocultar la pantalla de splash cuando la app esté lista
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplash();
  }, []);

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </AuthProvider>
  );
}