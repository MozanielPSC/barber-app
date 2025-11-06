import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useBarbeariasStore, usePoteStore } from '../../stores';
import { PlanoAssinatura } from '../../types';
import { showMessage } from 'react-native-flash-message';
import { ArrowLeftIcon, PlusIcon, GiftIcon, TrashIcon } from 'react-native-heroicons/outline';

export default function PlanosScreen() {
  const { barbeariaSelecionada } = useBarbeariasStore();
  const { planos, loadPlanos, deletarPlano, isLoading } = usePoteStore();
  
  const [apenasAtivos, setApenasAtivos] = useState(false);

  useEffect(() => {
    if (barbeariaSelecionada?.id) {
      loadPlanos(barbeariaSelecionada.id, apenasAtivos).catch((error) => {
        showMessage({
          message: 'Erro ao carregar planos',
          type: 'danger',
        });
      });
    }
  }, [barbeariaSelecionada?.id, apenasAtivos]);

  const handleDelete = async (planoId: string, planoNome: string) => {
    if (!barbeariaSelecionada?.id) return;
    
    const confirmed = confirm(`Tem certeza que deseja excluir o plano "${planoNome}"? Esta ação não pode ser desfeita.`);
    if (!confirmed) return;

    try {
      await deletarPlano(barbeariaSelecionada.id, planoId);
      showMessage({
        message: 'Plano excluído com sucesso',
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Erro ao excluir plano',
        type: 'danger',
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTipoPlanoLabel = (tipo: string) => {
    switch (tipo) {
      case 'ilimitado': return 'Ilimitado';
      case 'fichas_fixas': return 'Fichas Fixas';
      case 'valor_manual': return 'Valor Manual';
      default: return tipo;
    }
  };

  if (isLoading && planos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Carregando planos...</Text>
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
          <Text style={styles.title}>Planos de Assinatura</Text>
          <Text style={styles.subtitle}>Gerencie os planos disponíveis para venda</Text>
        </View>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setApenasAtivos(!apenasAtivos)}
        >
          <View style={[styles.checkbox, apenasAtivos && styles.checkboxActive]}>
            {apenasAtivos && <Text style={styles.checkboxCheck}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Apenas ativos</Text>
        </TouchableOpacity>
      </View>

      {/* New Button */}
      <View style={styles.actionContainer}>
        <Link href="/pote/planos/novo" asChild>
          <TouchableOpacity style={styles.newButton}>
            <PlusIcon size={20} color="#FFFFFF" />
            <Text style={styles.newButtonText}>Novo Plano</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* List */}
      {planos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <GiftIcon size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Nenhum plano encontrado</Text>
          <Text style={styles.emptyMessage}>
            {apenasAtivos 
              ? 'Nenhum plano ativo encontrado'
              : 'Crie o primeiro plano para começar'
            }
          </Text>
          <Link href="/pote/planos/novo" asChild>
            <TouchableOpacity style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Criar Primeiro Plano</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <View style={styles.grid}>
            {planos.map((plano) => (
              <View key={plano.id} style={styles.card}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{plano.nome}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: plano.ativo ? '#D1FAE5' : '#FEE2E2' }]}>
                    <Text style={[styles.statusText, { color: plano.ativo ? '#10B981' : '#EF4444' }]}>
                      {plano.ativo ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>

                {/* Info */}
                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Valor</Text>
                    <Text style={styles.infoValue}>{formatCurrency(plano.valor)}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Duração</Text>
                    <Text style={styles.infoValue}>{plano.duracao_meses} {plano.duracao_meses === 1 ? 'mês' : 'meses'}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tipo</Text>
                    <Text style={styles.infoValue}>{getTipoPlanoLabel(plano.tipo_plano)}</Text>
                  </View>

                  {plano.tipo_plano === 'fichas_fixas' && plano.fichas_iniciais !== undefined && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Fichas</Text>
                      <Text style={styles.infoValue}>{plano.fichas_iniciais}</Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/pote/planos/${plano.id}`)}
                  >
                    <Text style={styles.actionButtonTextPrimary}>Ver Detalhes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push(`/pote/planos/${plano.id}`)}
                  >
                    <Text style={styles.actionButtonTextSecondary}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButtonDanger}
                    onPress={() => handleDelete(plano.id, plano.nome)}
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
    backgroundColor: '#10B981',
    borderColor: '#10B981',
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
    backgroundColor: '#10B981',
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
    backgroundColor: '#10B981',
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

