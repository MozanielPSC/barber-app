import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { useAuthStore, useBarbeariasStore } from '@/stores';

export default function MainLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isAuthenticated } = useAuthStore();
  const { barbeariaAtual } = useBarbeariasStore();

  useEffect(() => {
    if (!isAuthenticated) {
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
  }, [isAuthenticated, user, barbeariaAtual]);
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
