import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cadastros"
        options={{
          title: 'Cadastros',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="financeiro"
        options={{
          title: 'Financeiro',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash" size={size} color={color} />
          ),
        }}
      />
      {/* Rotas ocultas */}
      <Tabs.Screen
        name="clientes"
        options={{
          href: null, // Esconde da tab bar
        }}
      />
      <Tabs.Screen
        name="servicos"
        options={{
          href: null, // Esconde da tab bar
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          href: null, // Esconde da tab bar
        }}
      />
    </Tabs>
  );
}

