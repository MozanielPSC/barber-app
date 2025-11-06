import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { DrawerProvider } from '@/components/navigation/DrawerProvider';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/services';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Aguarda a hidratação do persist
  useEffect(() => {
    // Verifica se já está hidratado
    const checkHydration = async () => {
      // Aguarda um pouco para garantir que o persist terminou
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const state = useAuthStore.getState();
      if (state.token) {
        await apiClient.setToken(state.token);
      }
      setIsHydrated(true);
    };

    checkHydration();
  }, []);

  // Redireciona para login se não estiver autenticado (após hidratação)
  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !token) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, token, router]);

  // Mostra loading enquanto não está hidratado
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <DrawerProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="login-colaborador" options={{ headerShown: false }} />
          <Stack.Screen name="registro" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="select-barbearia" options={{ headerShown: false }} />
          <Stack.Screen name="barbearias" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DrawerProvider>
  );
}
