import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: 'white' }
    }}>
      <Stack.Screen name="login" options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="register" options={{ title: 'Registrarse' }} />
      <Stack.Screen name="recovery" options={{ title: 'Recuperar Contraseña' }} />
    </Stack>
  );
}