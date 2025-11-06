import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Header } from '@/components/navigation/Header';
import { useAuthStore, useBarbeariasStore } from '@/stores';
import { useStoreHydration } from '@/hooks/use-store-hydration';

export default function MainLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isAuthenticated, token } = useAuthStore();
  const { barbeariaAtual } = useBarbeariasStore();
  const isHydrated = useStoreHydration();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Configura barbearia do colaborador assim que possível
  useEffect(() => {
    if (!isHydrated || !user || barbeariaAtual) return;

    // Se for colaborador, configura barbearia automaticamente do user
    if (user.tipo === 'colaborador' && user.barbearia_id) {
      const { useBarbeariasStore } = require('@/stores');
      const { setBarbeariaAtual } = useBarbeariasStore.getState();
        setBarbeariaAtual({
          id: user.barbearia_id,
          nome: user.nome_barbearia || 'Barbearia',
          endereco: '',
          telefone: '',
          horario_funcionamento: '',
          dias_funcionamento: [],
          ativa: true,
          proprietario_id: 0,
          created_at: '',
          updated_at: '',
        });
      }
  }, [user, barbeariaAtual, isHydrated]);

  // Verifica autenticação e redireciona se necessário
  useEffect(() => {
    // Só verifica após hidratação
    if (!isHydrated) return;

    const inTabsRoute = segments[0] === '(tabs)';
    
    // Se não está autenticado e está em rota de tabs, redireciona para login UMA VEZ
    if ((!isAuthenticated || !token) && inTabsRoute && !hasRedirected) {
      setHasRedirected(true);
      router.replace('/login');
      return;
    }

    // Se está autenticado como proprietário sem barbearia, redireciona para seleção
    if (isAuthenticated && user?.tipo === 'proprietario' && !barbeariaAtual && inTabsRoute && !hasRedirected) {
      setHasRedirected(true);
      router.replace('/select-barbearia');
      return;
    }

    // Reseta o flag quando volta a estar autenticado (caso tenha feito logout e login novamente)
    if (isAuthenticated && token && hasRedirected) {
      setHasRedirected(false);
    }
  }, [isAuthenticated, user, barbeariaAtual, isHydrated, token, router, segments, hasRedirected]);

  // Mostra loading enquanto não está hidratado
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: ({ route }) => {
          const titles: Record<string, string> = {
            index: 'Dashboard',
            agenda: 'Agenda',
            cadastros: 'Cadastros',
            financeiro: 'Financeiro',
            clientes: 'Clientes',
            servicos: 'Serviços',
            produtos: 'Produtos',
            colaboradores: 'Colaboradores',
          };
          return <Header title={titles[route.name] || route.name} />;
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Dashboard',
        }}
      />
      <Stack.Screen
        name="agenda"
        options={{
          title: 'Agenda',
        }}
      />
      <Stack.Screen
        name="cadastros"
        options={{
          title: 'Cadastros',
        }}
      />
      <Stack.Screen
        name="financeiro"
        options={{
          title: 'Financeiro',
        }}
      />
      <Stack.Screen
        name="clientes"
        options={{
          title: 'Clientes',
        }}
      />
      <Stack.Screen
        name="servicos"
        options={{
          title: 'Serviços',
        }}
      />
      <Stack.Screen
        name="produtos"
        options={{
          title: 'Produtos',
        }}
      />
      <Stack.Screen
        name="colaboradores"
        options={{
          title: 'Colaboradores',
        }}
      />
    </Stack>
  );
}
