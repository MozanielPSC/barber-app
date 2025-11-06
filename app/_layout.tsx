import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStoreHydration } from '@/hooks/use-store-hydration';
import { DrawerProvider } from '@/components/navigation/DrawerProvider';
import { useAuthStore } from '@/stores';

// Removido initialRouteName para permitir que a lógica de autenticação
// determine a rota inicial correta após a hidratação

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, token, user } = useAuthStore();
  const isHydrated = useStoreHydration();
  const [hasInitialRedirect, setHasInitialRedirect] = useState(false);

  // Reseta o flag de redirecionamento quando o estado de autenticação muda
  useEffect(() => {
    setHasInitialRedirect(false);
  }, [isAuthenticated, token]);

  // Gerencia redirecionamento inicial baseado em autenticação
  useEffect(() => {
    if (!isHydrated) return;

    const currentSegment = segments[0];
    
    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['login', 'login-colaborador', 'registro', 'auth'];
    const isPublicRoute = publicRoutes.includes(currentSegment);
    const isNotFoundRoute = currentSegment === '+not-found';
    
    // Se está autenticado
    if (isAuthenticated && token) {
      // Se está em rota pública, redireciona para tabs
      if (isPublicRoute && !hasInitialRedirect) {
        setHasInitialRedirect(true);
        router.replace('/(tabs)');
      }
      // Se acabou de hidratar e não tem rota definida, vai para tabs
      else if (!currentSegment && !hasInitialRedirect) {
        setHasInitialRedirect(true);
        router.replace('/(tabs)');
      }
      return;
    }
    
    // Se não está autenticado
    if (!isAuthenticated || !token) {
      // Se está tentando acessar rota protegida, redireciona para login
      if (!isPublicRoute && !isNotFoundRoute && !hasInitialRedirect) {
        setHasInitialRedirect(true);
        router.replace('/login');
      }
      // Se acabou de hidratar e não tem rota definida, vai para login
      else if (!currentSegment && !hasInitialRedirect) {
        setHasInitialRedirect(true);
        router.replace('/login');
      }
      return;
    }
  }, [isAuthenticated, token, isHydrated, segments, hasInitialRedirect, router]);

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
          <Stack.Screen name="barbearias/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="barbearias/novo" options={{ headerShown: false }} />
          <Stack.Screen name="colaboradores/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="colaboradores/novo" options={{ headerShown: false }} />
          <Stack.Screen name="servicos/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="servicos/novo" options={{ headerShown: false }} />
          <Stack.Screen name="produtos/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="produtos/novo" options={{ headerShown: false }} />
          <Stack.Screen name="estoque/movimentacoes" options={{ headerShown: false }} />
          <Stack.Screen name="estoque/entrada" options={{ headerShown: false }} />
          <Stack.Screen name="estoque/saida" options={{ headerShown: false }} />
          <Stack.Screen name="estoque/ajuste" options={{ headerShown: false }} />
          <Stack.Screen name="estoque/transferencia" options={{ headerShown: false }} />
          <Stack.Screen name="estoque/prateleiras/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="estoque/prateleiras/novo" options={{ headerShown: false }} />
          <Stack.Screen name="atendimentos/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="atendimentos/novo" options={{ headerShown: false }} />
          <Stack.Screen name="financeiro/despesas-fixas" options={{ headerShown: false }} />
          <Stack.Screen name="financeiro/despesas-variaveis" options={{ headerShown: false }} />
          <Stack.Screen name="financeiro/canais" options={{ headerShown: false }} />
          <Stack.Screen name="financeiro/gastos" options={{ headerShown: false }} />
          <Stack.Screen name="pote/configuracoes" options={{ headerShown: false }} />
          <Stack.Screen name="pote/configuracoes/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="pote/configuracoes/novo" options={{ headerShown: false }} />
          <Stack.Screen name="pote/planos" options={{ headerShown: false }} />
          <Stack.Screen name="pote/planos/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="pote/planos/novo" options={{ headerShown: false }} />
          <Stack.Screen name="pote/assinaturas" options={{ headerShown: false }} />
          <Stack.Screen name="pote/assinaturas/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="pote/assinaturas/novo" options={{ headerShown: false }} />
          <Stack.Screen name="pote/distribuicoes" options={{ headerShown: false }} />
          <Stack.Screen name="pote/distribuicoes/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DrawerProvider>
  );
}
