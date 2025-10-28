import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Screens
import { AgendaScreen } from '../screens/agenda/AgendaScreen';
import { AuthScreen } from '../screens/auth/AuthScreen';
import { SelectBarbeariaScreen } from '../screens/barbearia/SelectBarbeariaScreen';
import { ClientesScreen } from '../screens/clientes/ClientesScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ServicosScreen } from '../screens/servicos/ServicosScreen';

// Types
export type RootStackParamList = {
  Auth: undefined;
  SelectBarbearia: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Agenda: undefined;
  Clientes: undefined;
  Servicos: undefined;
  Produtos: undefined;
  Financeiro: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Configuracoes: undefined;
  Perfil: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Placeholder screens
const ProdutosScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Produtos</Text>
  </View>
);

const FinanceiroScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Financeiro</Text>
  </View>
);

const ConfiguracoesScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Configurações</Text>
  </View>
);

const PerfilScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Perfil</Text>
  </View>
);

// Main Tabs Navigator
const MainTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>📊</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Agenda" 
        component={AgendaScreen}
        options={{
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>📅</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Clientes" 
        component={ClientesScreen}
        options={{
          tabBarLabel: 'Clientes',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>👥</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Servicos" 
        component={ServicosScreen}
        options={{
          tabBarLabel: 'Serviços',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>✂️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Produtos" 
        component={ProdutosScreen}
        options={{
          tabBarLabel: 'Produtos',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>🛍️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Financeiro" 
        component={FinanceiroScreen}
        options={{
          tabBarLabel: 'Financeiro',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>💰</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
        drawerActiveTintColor: '#3B82F6',
        drawerInactiveTintColor: '#6B7280',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={MainTabsNavigator}
        options={{
          drawerLabel: 'Início',
          drawerIcon: ({ color }) => (
            <Text style={[styles.drawerIcon, { color }]}>🏠</Text>
          ),
        }}
      />
      <Drawer.Screen 
        name="Configuracoes" 
        component={ConfiguracoesScreen}
        options={{
          drawerLabel: 'Configurações',
          drawerIcon: ({ color }) => (
            <Text style={[styles.drawerIcon, { color }]}>⚙️</Text>
          ),
        }}
      />
      <Drawer.Screen 
        name="Perfil" 
        component={PerfilScreen}
        options={{
          drawerLabel: 'Perfil',
          drawerIcon: ({ color }) => (
            <Text style={[styles.drawerIcon, { color }]}>👤</Text>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Root Stack Navigator
const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="SelectBarbearia" component={SelectBarbeariaScreen} />
      <Stack.Screen name="Main" component={DrawerNavigator} />
    </Stack.Navigator>
  );
};

// Main Navigation Component
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  tabIcon: {
    fontSize: 20,
  },
  drawerIcon: {
    fontSize: 20,
  },
});
