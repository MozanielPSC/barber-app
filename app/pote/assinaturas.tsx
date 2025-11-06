import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useBarbeariasStore, usePoteStore } from '../../stores';
import { Assinatura } from '../../types';
import { showMessage } from 'react-native-flash-message';
import { ArrowLeftIcon, PlusIcon, GiftIcon } from 'react-native-heroicons/outline';

export default function AssinaturasScreen() {
  const { barbeariaSelecionada } = useBarbeariasStore();
  const { assinaturas, loadAssinaturas, isLoading } = usePoteStore();
  
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativa' | 'cancelada' | 'expirada'>('ativa');

  useEffect(() => {
    if (barbeariaSelecionada?.id) {
      const filtros = filtroStatus === 'todas' ? {} : { status: filtroStatus };
      loadAssinaturas(barbeariaSelecionada.id, filtros).catch((error) => {
        showMessage({
          message: 'Erro ao carregar assinaturas',
          type: 'danger',
        });
      });
    }
  }, [barbeariaSelecionada?.id, filtroStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return '#10B981';
      case 'cancelada': return '#EF4444';
      case 'expirada': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'cancelada': return 'Cancelada';
      case 'expirada': return 'Expirada';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularProgressoFichas = (assinatura: Assinatura) => {
    if (!assinatura.fichas_iniciais) return 0;
    const consumidas = assinatura.fichas_consumidas || 0;
    return (consumidas / assinatura.fichas_iniciais) * 100;
  };

  if (isLoading && assinaturas.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Carregando assinaturas...</Text>
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
          <Text style={styles.title}>Assinaturas</Text>
          <Text style={styles.subtitle}>Gerencie as assinaturas dos clientes</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <TouchableOpacity
            style={[styles.filterChip, filtroStatus === 'todas' && styles.filterChipActive]}
            onPress={() => setFiltroStatus('todas')}
          >
            <Text style={[styles.filterChipText, filtroStatus === 'todas' && styles.filterChipTextActive]}>
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filtroStatus === 'ativa' && styles.filterChipActive]}
            onPress={() => setFiltroStatus('ativa')}
          >
            <Text style={[styles.filterChipText, filtroStatus === 'ativa' && styles.filterChipTextActive]}>
              Ativas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filtroStatus === 'cancelada' && styles.filterChipActive]}
            onPress={() => setFiltroStatus('cancelada')}
          >
            <Text style={[styles.filterChipText, filtroStatus === 'cancelada' && styles.filterChipTextActive]}>
              Canceladas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filtroStatus === 'expirada' && styles.filterChipActive]}
            onPress={() => setFiltroStatus('expirada')}
          >
            <Text style={[styles.filterChipText, filtroStatus === 'expirada' && styles.filterChipTextActive]}>
              Expiradas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* New Button */}
      <View style={styles.actionContainer}>
        <Link href="/pote/assinaturas/novo" asChild>
          <TouchableOpacity style={styles.newButton}>
            <PlusIcon size={20} color="#FFFFFF" />
            <Text style={styles.newButtonText}>Nova Assinatura</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* List */}
      {assinaturas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <GiftIcon size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Nenhuma assinatura encontrada</Text>
          <Text style={styles.emptyMessage}>
            {filtroStatus === 'todas' 
              ? 'Crie a primeira assinatura para começar'
              : `Nenhuma assinatura com status "${getStatusLabel(filtroStatus)}"`
            }
          </Text>
          <Link href="/pote/assinaturas/novo" asChild>
            <TouchableOpacity style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Criar Primeira Assinatura</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {assinaturas.map((assinatura) => (
            <TouchableOpacity
              key={assinatura.id}
              style={styles.card}
              onPress={() => router.push(`/pote/assinaturas/${assinatura.id}`)}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.cardClientName}>
                    {assinatura.cliente?.nome || assinatura.cliente?.name || 'Cliente não identificado'}
                  </Text>
                  <Text style={styles.cardPlanName}>{assinatura.plano?.nome || 'Plano não identificado'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(assinatura.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(assinatura.status) }]}>
                    {getStatusLabel(assinatura.status)}
                  </Text>
                </View>
              </View>

              {/* Info */}
              <View style={styles.cardContent}>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueLabel}>Valor Pago</Text>
                  <Text style={styles.valueText}>{formatCurrency(assinatura.valor_pago)}</Text>
                </View>

                <View style={styles.periodContainer}>
                  <Text style={styles.periodLabel}>Período</Text>
                  <Text style={styles.periodText}>
                    {formatDate(assinatura.data_inicio)} - {formatDate(assinatura.data_fim)}
                  </Text>
                </View>

                {/* Fichas Progress (se aplicável) */}
                {assinatura.tipo_plano === 'fichas_fixas' && assinatura.fichas_iniciais && (
                  <View style={styles.fichasContainer}>
                    <View style={styles.fichasHeader}>
                      <Text style={styles.fichasLabel}>Fichas</Text>
                      <Text style={styles.fichasCount}>
                        {assinatura.fichas_consumidas || 0} / {assinatura.fichas_iniciais}
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${calcularProgressoFichas(assinatura)}%`,
                            backgroundColor: assinatura.status === 'ativa' ? '#8B5CF6' : '#6B7280'
                          }
                        ]} 
                      />
                    </View>
                  </View>
                )}

                {/* Tipo Ilimitado */}
                {assinatura.tipo_plano === 'ilimitado' && (
                  <View style={styles.ilimitadoContainer}>
                    <Text style={styles.ilimitadoText}>✨ Assinatura Ilimitada</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
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
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
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
    backgroundColor: '#8B5CF6',
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardClientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardPlanName: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    gap: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  valueText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  fichasContainer: {
    marginTop: 4,
  },
  fichasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fichasLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  fichasCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  ilimitadoContainer: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  ilimitadoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
    textAlign: 'center',
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
    backgroundColor: '#8B5CF6',
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

