import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore, useBarbeariasStore } from '../../stores';
import { useDrawer } from './DrawerProvider';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  submenu?: MenuItem[];
  requiresOwner?: boolean;
  requiresColaborador?: boolean;
  requiresPermission?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'view-dashboard',
    route: '/(tabs)',
  },
  {
    id: 'agenda',
    label: 'Agenda',
    icon: 'calendar',
    route: '/(tabs)/agenda',
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    icon: 'folder-multiple',
    submenu: [
      {
        id: 'barbearias',
        label: 'Barbearias',
        icon: 'storefront',
        route: '/barbearias',
        requiresOwner: true,
      },
      {
        id: 'clientes',
        label: 'Clientes',
        icon: 'account-group',
        route: '/(tabs)/clientes',
      },
      {
        id: 'colaboradores',
        label: 'Colaboradores',
        icon: 'account-multiple',
        route: '/colaboradores',
        requiresOwner: true,
      },
      {
        id: 'servicos',
        label: 'Serviços',
        icon: 'content-cut',
        route: '/(tabs)/servicos',
      },
      {
        id: 'produtos',
        label: 'Produtos',
        icon: 'cube',
        route: '/(tabs)/produtos',
      },
      {
        id: 'estoque',
        label: 'Estoque',
        icon: 'archive',
        route: '/estoque',
      },
      {
        id: 'prateleiras',
        label: 'Prateleiras',
        icon: 'grid',
        route: '/prateleiras',
      },
    ],
  },
  {
    id: 'atendimentos',
    label: 'Atendimentos',
    icon: 'clipboard',
    route: '/atendimentos',
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: 'cash',
    route: '/(tabs)/financeiro',
  },
  {
    id: 'comissoes',
    label: 'Minhas Comissões',
    icon: 'wallet',
    route: '/comissoes',
    requiresColaborador: true,
  },
  {
    id: 'metas',
    label: 'Metas',
    icon: 'flag',
    route: '/metas',
    requiresOwner: true,
  },
  {
    id: 'perfil',
    label: 'Perfil',
    icon: 'account',
    route: '/perfil',
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: 'cog',
    route: '/configuracoes',
  },
];

export const DrawerContent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { barbeariaAtual, barbearias } = useBarbeariasStore();
  const { closeDrawer } = useDrawer();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  
  // Força tema claro para corresponder ao resto da aplicação
  const isDark = false;

  const isOwner = user?.tipo === 'proprietario';
  const isColaborador = user?.tipo === 'colaborador';

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleNavigation = (route?: string) => {
    if (route) {
      router.push(route as any);
      closeDrawer();
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const isActive = (route?: string) => {
    if (!route) return false;
    return pathname === route || pathname?.startsWith(route);
  };

  const canShowItem = (item: MenuItem): boolean => {
    if (item.requiresOwner && !isOwner) return false;
    if (item.requiresColaborador && !isColaborador) return false;
    return true;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (!canShowItem(item)) return null;

    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const active = isActive(item.route);

    const menuItemStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: active ? (isDark ? '#1E3A8A' : '#DBEAFE') : 'transparent',
    };

    const menuItemTextStyle = {
      fontSize: 15,
      color: active 
        ? (isDark ? '#93C5FD' : '#2563EB')
        : (isDark ? '#D1D5DB' : '#374151'),
      fontWeight: active ? '600' as const : '500' as const,
    };

    return (
      <View key={item.id}>
        <TouchableOpacity
          style={[
            menuItemStyle,
            level > 0 && styles.submenuItem,
          ]}
          onPress={() => {
            if (hasSubmenu) {
              toggleMenu(item.id);
            } else {
              handleNavigation(item.route);
            }
          }}
        >
          <View style={styles.menuItemContent}>
            {item.icon && (
              <MaterialCommunityIcons
                name={item.icon as any}
                size={20}
                color={active 
                  ? (isDark ? '#93C5FD' : '#2563EB')
                  : (isDark ? '#9CA3AF' : '#6B7280')}
                style={styles.menuIcon}
              />
            )}
            <Text style={menuItemTextStyle}>
              {item.label}
            </Text>
          </View>
          {hasSubmenu && (
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          )}
        </TouchableOpacity>

        {hasSubmenu && isExpanded && (
          <View style={[styles.submenu, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
            {item.submenu
              ?.filter(canShowItem)
              .map((subItem) => renderMenuItem(subItem, level + 1))}
          </View>
        )}
      </View>
    );
  };

  const containerStyle = {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#FFFFFF',
  };

  const headerStyle = {
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
  };

  const logoStyle = {
    fontSize: 20,
    fontWeight: '700' as const,
    color: isDark ? '#F9FAFB' : '#111827',
  };

  const barbeariaNameStyle = {
    fontSize: 14,
    color: isDark ? '#D1D5DB' : '#6B7280',
  };

  return (
    <View style={containerStyle}>
      {/* Header */}
      <View style={headerStyle}>
        <View style={styles.headerContent}>
          <Text style={logoStyle}>Beet Gestão</Text>
          <Text style={barbeariaNameStyle}>
            {isOwner
              ? barbeariaAtual?.nome || 'Selecione uma barbearia'
              : user?.nome_barbearia || 'Barbearia'}
          </Text>
        </View>
      </View>

      {/* Seleção de Barbearia (só proprietários) */}
      {isOwner && barbearias.length > 0 && (
        <View style={[styles.barbeariaSelector, { borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
          <Text style={[styles.selectorLabel, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>Barbearia Atual</Text>
          <TouchableOpacity
            style={[styles.selectorButton, { 
              backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
              borderColor: isDark ? '#374151' : '#E5E7EB',
            }]}
            onPress={() => router.push('/select-barbearia')}
          >
            <Text style={[styles.selectorText, { color: isDark ? '#F9FAFB' : '#111827' }]} numberOfLines={1}>
              {barbeariaAtual?.nome || 'Selecione'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>
      )}

      {/* Menu de Navegação */}
      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => renderMenuItem(item))}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: isDark ? '#374151' : '#E5E7EB' }]}>
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: isDark ? '#7F1D1D' : '#FEE2E2' }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    gap: 4,
  },
  barbeariaSelector: {
    padding: 16,
    borderBottomWidth: 1,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  menu: {
    flex: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  submenu: {
    paddingLeft: 20,
  },
  submenuItem: {
    paddingLeft: 40,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
  },
});

