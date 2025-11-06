import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Header } from '@/components/navigation/Header';
import { useAuthStore, useBarbeariasStore } from '@/stores';
import { apiClient } from '@/services';

export default function MainLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isAuthenticated, token } = useAuthStore();
  const { barbeariaAtual } = useBarbeariasStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Aguarda a hidratação do persist antes de verificar autenticação
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

  useEffect(() => {
    // Só verifica autenticação após hidratação
    if (!isHydrated) return;

    if (!isAuthenticated || !token) {
      router.replace('/login');
      return;
    }

    // Se for proprietário e não tem barbearia selecionada, redireciona
    if (user?.tipo === 'proprietario' && !barbeariaAtual) {
      router.replace('/select-barbearia');
      return;
    }

    // Se for colaborador, verifica se tem barbearia (deve ter)
    if (user?.tipo === 'colaborador' && !barbeariaAtual) {
      // Tenta carregar do user
      const { useBarbeariasStore } = require('@/stores');
      const { setBarbeariaAtual } = useBarbeariasStore.getState();
      if (user.barbearia_id) {
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
    }
  }, [isAuthenticated, user, barbeariaAtual, isHydrated, token, router]);

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
    </Stack>
  );
}
