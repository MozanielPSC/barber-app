import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { useBarbeariasStore, usePoteStore } from '../../stores';
import { Cog6ToothIcon, GiftIcon, UsersIcon, CurrencyDollarIcon } from 'react-native-heroicons/outline';

export default function PoteScreen() {
  const { barbeariaSelecionada } = useBarbeariasStore();
  const { 
    configuracoes, 
    planos, 
    assinaturas, 
    distribuicoes,
    loadConfiguracoes,
    loadPlanos,
    loadAssinaturas,
    loadDistribuicoes,
    isLoading,
    configuracoesAtivas,
    planosAtivos,
    assinaturasAtivas,
  } = usePoteStore();

  useEffect(() => {
    if (barbeariaSelecionada?.id) {
      loadConfiguracoes(barbeariaSelecionada.id);
      loadPlanos(barbeariaSelecionada.id);
      loadAssinaturas(barbeariaSelecionada.id);
      loadDistribuicoes(barbeariaSelecionada.id, 10);
    }
  }, [barbeariaSelecionada?.id]);

  const totalConfiguracoesAtivas = configuracoesAtivas().length;
  const totalPlanosAtivos = planosAtivos().length;
  const totalAssinaturasAtivas = assinaturasAtivas().length;
  const totalDistribuicoes = distribuicoes.length;

  if (isLoading && configuracoes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Carregando dados do pote...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pote & Assinaturas</Text>
        <Text style={styles.subtitle}>Sistema de gestão de assinaturas e distribuição</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Cog6ToothIcon size={24} color="#3B82F6" />
          </View>
          <Text style={styles.summaryValue}>{totalConfiguracoesAtivas}</Text>
          <Text style={styles.summaryLabel}>Configurações Ativas</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <GiftIcon size={24} color="#10B981" />
          </View>
          <Text style={styles.summaryValue}>{totalPlanosAtivos}</Text>
          <Text style={styles.summaryLabel}>Planos Ativos</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <UsersIcon size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.summaryValue}>{totalAssinaturasAtivas}</Text>
          <Text style={styles.summaryLabel}>Assinaturas Ativas</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <CurrencyDollarIcon size={24} color="#F59E0B" />
          </View>
          <Text style={styles.summaryValue}>{totalDistribuicoes}</Text>
          <Text style={styles.summaryLabel}>Distribuições</Text>
        </View>
      </View>

      {/* Navigation Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gerenciamento</Text>
        
        <Link href="/pote/configuracoes" asChild>
          <TouchableOpacity style={styles.navCard}>
            <View style={styles.navCardHeader}>
              <View style={[styles.navIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Cog6ToothIcon size={28} color="#3B82F6" />
              </View>
              <View style={styles.navCardContent}>
                <Text style={styles.navCardTitle}>Configurações do Pote</Text>
                <Text style={styles.navCardDescription}>
                  Gerencie configurações de distribuição e pesos de serviços
                </Text>
                <Text style={styles.navCardBadge}>{configuracoes.length} configurações</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/pote/planos" asChild>
          <TouchableOpacity style={styles.navCard}>
            <View style={styles.navCardHeader}>
              <View style={[styles.navIconContainer, { backgroundColor: '#D1FAE5' }]}>
                <GiftIcon size={28} color="#10B981" />
              </View>
              <View style={styles.navCardContent}>
                <Text style={styles.navCardTitle}>Planos de Assinatura</Text>
                <Text style={styles.navCardDescription}>
                  Crie e gerencie planos disponíveis para venda
                </Text>
                <Text style={styles.navCardBadge}>{planos.length} planos</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/pote/assinaturas" asChild>
          <TouchableOpacity style={styles.navCard}>
            <View style={styles.navCardHeader}>
              <View style={[styles.navIconContainer, { backgroundColor: '#EDE9FE' }]}>
                <UsersIcon size={28} color="#8B5CF6" />
              </View>
              <View style={styles.navCardContent}>
                <Text style={styles.navCardTitle}>Assinaturas</Text>
                <Text style={styles.navCardDescription}>
                  Gerencie assinaturas de clientes e consumo de fichas
                </Text>
                <Text style={styles.navCardBadge}>{assinaturas.length} assinaturas</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/pote/distribuicoes" asChild>
          <TouchableOpacity style={styles.navCard}>
            <View style={styles.navCardHeader}>
              <View style={[styles.navIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <CurrencyDollarIcon size={28} color="#F59E0B" />
              </View>
              <View style={styles.navCardContent}>
                <Text style={styles.navCardTitle}>Distribuições</Text>
                <Text style={styles.navCardDescription}>
                  Histórico de distribuições do pote processadas
                </Text>
                <Text style={styles.navCardBadge}>{distribuicoes.length} distribuições</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  navCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  navCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  navIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  navCardContent: {
    flex: 1,
  },
  navCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  navCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  navCardBadge: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3B82F6',
  },
});

