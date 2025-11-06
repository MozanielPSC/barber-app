import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useBarbeariasStore, usePoteStore } from '../../stores';
import { ConfiguracaoPote } from '../../types';
import { showMessage } from 'react-native-flash-message';
import { ArrowLeftIcon, PlusIcon, Cog6ToothIcon, TrashIcon } from 'react-native-heroicons/outline';

export default function ConfiguracoesScreen() {
  const { barbeariaSelecionada } = useBarbeariasStore();
  const { configuracoes, loadConfiguracoes, deleteConfiguracao, isLoading } = usePoteStore();
  
  const [apenasAtivas, setApenasAtivas] = useState(false);

  useEffect(() => {
    if (barbeariaSelecionada?.id) {
      loadConfiguracoes(barbeariaSelecionada.id).catch((error) => {
        showMessage({
          message: 'Erro ao carregar configurações',
          type: 'danger',
        });
      });
    }
  }, [barbeariaSelecionada?.id]);

  const handleDelete = async (configuracaoId: string, configuracaoNome: string) => {
    if (!barbeariaSelecionada?.id) return;
    
    const confirmed = confirm(`Tem certeza que deseja excluir a configuração "${configuracaoNome}"? Esta ação não pode ser desfeita.`);
    if (!confirmed) return;

    try {
      await deleteConfiguracao(barbeariaSelecionada.id, configuracaoId);
      showMessage({
        message: 'Configuração excluída com sucesso',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Erro ao excluir configuração',
        type: 'danger',
      });
    }
  };

  const formatPercentual = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  const getPeriodicidadeLabel = (periodicidade: string) => {
    switch (periodicidade) {
      case 'mensal': return 'Mensal';
      case 'semanal': return 'Semanal';
      case 'quinzenal': return 'Quinzenal';
      default: return periodicidade;
    }
  };

  const getTipoPlanoLabel = (tipo: string) => {
    switch (tipo) {
      case 'ilimitado': return 'Ilimitado';
      case 'fichas_fixas': return 'Fichas Fixas';
      case 'valor_manual': return 'Valor Manual';
      default: return tipo;
    }
  };

  const configuracoesExibir = apenasAtivas 
    ? configuracoes.filter(c => c.ativo) 
    : configuracoes;

  if (isLoading && configuracoes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Carregando configurações...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeftIcon size={24} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Configurações do Pote</Text>
          <Text style={styles.subtitle}>Gerencie as configurações de distribuição</Text>
        </View>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setApenasAtivas(!apenasAtivas)}
        >
          <View style={[styles.checkbox, apenasAtivas && styles.checkboxActive]}>
            {apenasAtivas && <Text style={styles.checkboxCheck}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Apenas ativas</Text>
        </TouchableOpacity>
      </View>

      {/* New Button */}
      <View style={styles.actionContainer}>
        <Link href="/pote/configuracoes/novo" asChild>
          <TouchableOpacity style={styles.newButton}>
            <PlusIcon size={20} color="#FFFFFF" />
            <Text style={styles.newButtonText}>Nova Configuração</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* List */}
      {configuracoesExibir.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Cog6ToothIcon size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Nenhuma configuração encontrada</Text>
          <Text style={styles.emptyMessage}>
            {apenasAtivas 
              ? 'Nenhuma configuração ativa encontrada'
              : 'Crie a primeira configuração para começar'
            }
          </Text>
          <Link href="/pote/configuracoes/novo" asChild>
            <TouchableOpacity style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Criar Primeira Configuração</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <View style={styles.grid}>
            {configuracoesExibir.map((config) => (
              <View key={config.id} style={styles.card}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{config.nome}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: config.ativo ? '#DBEAFE' : '#FEE2E2' }]}>
                    <Text style={[styles.statusText, { color: config.ativo ? '#3B82F6' : '#EF4444' }]}>
                      {config.ativo ? 'Ativa' : 'Inativa'}
                    </Text>
                  </View>
                </View>

                {/* Info */}
                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>% Casa</Text>
                    <Text style={styles.infoValue}>{formatPercentual(config.percentual_casa)}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Periodicidade</Text>
                    <Text style={styles.infoValue}>{getPeriodicidadeLabel(config.periodicidade_distribuicao)}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tipo</Text>
                    <Text style={styles.infoValue}>{getTipoPlanoLabel(config.tipo_plano)}</Text>
                  </View>

                  {config.valor_ficha_padrao && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Valor Ficha</Text>
                      <Text style={styles.infoValue}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(config.valor_ficha_padrao)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/pote/configuracoes/${config.id}`)}
                  >
                    <Text style={styles.actionButtonTextPrimary}>Ver Detalhes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/pote/configuracoes/${config.id}`)}
                  >
                    <Text style={styles.actionButtonTextSecondary}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButtonDanger}
                    onPress={() => handleDelete(config.id, config.nome)}
                  >
                    <TrashIcon size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#374151',
  },
  actionContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    gap: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonTextPrimary: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3B82F6',
  },
  actionButtonTextSecondary: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  actionButtonDanger: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

