import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDashboardStore, useColaboradoresStore, useAuthStore, useBarbeariasStore } from '../../stores';
import { Card, CardContent } from '../../components/ui';
import { ProgressBar } from '../../components/ui/ProgressBar';

const { width } = Dimensions.get('window');

interface MetricCard {
  id: string;
  type: 'services' | 'products' | 'indications';
  title: string;
  value: number;
  period: string;
  progress: number;
  commission?: number;
  icon: string;
  color: string;
  bgColor: string;
}

export default function DashboardScreen() {
  const { kpis, isLoading, filters, loadKPIs, setFilter, clearFilters } = useDashboardStore();
  const { colaboradores, loadColaboradores } = useColaboradoresStore();
  const { user } = useAuthStore();
  const { barbeariaAtual } = useBarbeariasStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [showMesModal, setShowMesModal] = useState(false);
  const [showAnoModal, setShowAnoModal] = useState(false);

  useEffect(() => {
    // Só carrega colaboradores se tiver barbearia selecionada
    if (barbeariaAtual?.id) {
      loadColaboradores({ barbearia_id: barbeariaAtual.id }).catch(() => {
        // Erro silencioso
      });
    }
    loadKPIs().catch(() => {
      // Erro silencioso
    });
  }, [barbeariaAtual]);

  useEffect(() => {
    // Recarrega KPIs quando filtros mudam
    loadKPIs().catch(() => {
      // Erro silencioso
    });
  }, [filters]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadKPIs();
    setRefreshing(false);
  };

  const handlePeriodFilter = (periodo: 'hoje' | 'semana' | 'mes' | 'ano') => {
    setFilter({ periodo, mes: null, ano: null });
  };

  const formatMoney = (value: number | null | undefined) => {
    const numValue = value ?? 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);
  };

  // Prepara os cards de métricas
  const metricCards: MetricCard[] = kpis
    ? [
        {
          id: 'services',
          type: 'services',
          title: 'Serviços',
          value: filters.periodo === 'hoje' 
            ? (kpis.servicesToday ?? 0) 
            : (kpis.servicesMonth ?? 0),
          period: filters.periodo === 'hoje' ? 'Hoje' : 'Este Mês',
          progress: kpis.servicesProgress ?? 0,
          commission: filters.periodo === 'hoje' 
            ? (kpis.commissionToday ?? 0) 
            : (kpis.commissionMonth ?? 0),
          icon: 'cut',
          color: '#2563EB',
          bgColor: '#DBEAFE',
        },
        {
          id: 'products',
          type: 'products',
          title: 'Produtos',
          value: filters.periodo === 'hoje' 
            ? (kpis.productsToday ?? 0) 
            : (kpis.productsMonth ?? 0),
          period: filters.periodo === 'hoje' ? 'Hoje' : 'Este Mês',
          progress: kpis.productsProgress ?? 0,
          icon: 'cube',
          color: '#9333EA',
          bgColor: '#F3E8FF',
        },
        {
          id: 'indications',
          type: 'indications',
          title: 'Indicações',
          value: kpis.indicationsCount ?? 0,
          period: 'Total',
          progress: 0,
          icon: 'people',
          color: '#10B981',
          bgColor: '#D1FAE5',
        },
      ]
    : [];

  const renderMetricCard = (item: MetricCard) => (
    <Card style={styles.metricCard}>
      <CardContent>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconContainer, { backgroundColor: item.bgColor }]}>
            {item.type === 'services' && (
              <MaterialCommunityIcons name="content-cut" size={28} color={item.color} />
            )}
            {item.type === 'products' && (
              <Ionicons name="cube" size={28} color={item.color} />
            )}
            {item.type === 'indications' && (
              <Ionicons name="people" size={28} color={item.color} />
            )}
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardPeriod}>{item.period}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.cardValue, { color: item.color }]}>
            {(item.value ?? 0).toLocaleString('pt-BR')}
          </Text>

          {item.progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Meta</Text>
                <Text style={[styles.progressPercent, { color: item.color }]}>
                  {item.progress}%
                </Text>
              </View>
              <ProgressBar progress={item.progress} color={item.color} height={8} />
            </View>
          )}

          {item.commission !== undefined && item.commission !== null && item.commission > 0 && (
            <View style={styles.commissionContainer}>
              <Ionicons name="cash-outline" size={16} color="#059669" />
              <View style={styles.commissionText}>
                <Text style={styles.commissionLabel}>Comissão</Text>
                <Text style={styles.commissionValue}>{formatMoney(item.commission)}</Text>
              </View>
            </View>
          )}
        </View>
      </CardContent>
    </Card>
  );

  if (isLoading && !kpis) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Carregando dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
      >
        {/* Filtros Avançados */}
        <Card style={styles.filtersCard}>
          <CardContent>
            <Text style={styles.filtersTitle}>Filtros</Text>

            {/* Filtros Rápidos */}
            <View style={styles.quickFilters}>
              <Text style={styles.filtersLabel}>Período:</Text>
              <View style={styles.quickFiltersRow}>
                {(['hoje', 'semana', 'mes', 'ano'] as const).map((periodo) => (
                  <TouchableOpacity
                    key={periodo}
                    style={[
                      styles.quickFilterButton,
                      filters.periodo === periodo && styles.quickFilterButtonActive,
                    ]}
                    onPress={() => handlePeriodFilter(periodo)}
                  >
                    <Text
                      style={[
                        styles.quickFilterText,
                        filters.periodo === periodo && styles.quickFilterTextActive,
                      ]}
                    >
                      {periodo === 'hoje'
                        ? 'Hoje'
                        : periodo === 'semana'
                        ? 'Semana'
                        : periodo === 'mes'
                        ? 'Mês'
                        : 'Ano'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtros Detalhados */}
            <View style={styles.detailedFilters}>
              {user?.tipo === 'proprietario' && (
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Colaborador:</Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => setShowColaboradorModal(true)}
                  >
                    <Text style={styles.selectText}>
                      {filters.colaborador_id
                        ? (colaboradores || []).find((c) => c.id === filters.colaborador_id)?.nome ||
                          'Selecione'
                        : 'Todos'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Mês:</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowMesModal(true)}
                >
                  <Text style={styles.selectText}>
                    {filters.mes
                      ? new Date(`${filters.mes}-01`).toLocaleString('pt-BR', { month: 'long' })
                      : 'Selecione'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Ano:</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowAnoModal(true)}
                >
                  <Text style={styles.selectText}>
                    {filters.ano || new Date().getFullYear()}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão Limpar Filtros */}
            {(filters.periodo ||
              filters.colaborador_id ||
              filters.mes ||
              filters.ano) && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Ionicons name="close-circle" size={16} color="#EF4444" />
                <Text style={styles.clearButtonText}>Limpar Filtros</Text>
              </TouchableOpacity>
            )}
          </CardContent>
        </Card>

        {/* Cards de Métricas */}
        {kpis && (
          <View style={styles.metricsContainer}>
            {metricCards.map((item) => (
              <View key={item.id} style={styles.metricCardWrapper}>
                {renderMetricCard(item)}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal de Seleção de Colaborador */}
      <Modal
        visible={showColaboradorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowColaboradorModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowColaboradorModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Selecione o Colaborador</Text>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setFilter({ colaborador_id: null });
                  setShowColaboradorModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    !filters.colaborador_id && styles.modalItemTextActive,
                  ]}
                >
                  Todos
                </Text>
              </TouchableOpacity>
              {colaboradores && colaboradores.length > 0 ? (
                colaboradores.map((colab) => (
                  <TouchableOpacity
                    key={colab.id}
                    style={styles.modalItem}
                    onPress={() => {
                      setFilter({ colaborador_id: colab.id });
                      setShowColaboradorModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        filters.colaborador_id === colab.id && styles.modalItemTextActive,
                      ]}
                    >
                      {colab.nome || colab.nome_colaborador || 'Sem nome'}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.modalItem}>
                  <Text style={styles.modalItemText}>
                    Nenhum colaborador encontrado
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Seleção de Mês */}
      <Modal
        visible={showMesModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMesModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMesModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Selecione o Mês</Text>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setFilter({ mes: null });
                  setShowMesModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    !filters.mes && styles.modalItemTextActive,
                  ]}
                >
                  Todo o Ano
                </Text>
              </TouchableOpacity>
              {Array.from({ length: 12 }).map((_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                const monthValue = `${new Date().getFullYear()}-${month}`;
                const monthName = new Date(2000, i, 1).toLocaleString('pt-BR', {
                  month: 'long',
                });
                return (
                  <TouchableOpacity
                    key={month}
                    style={styles.modalItem}
                    onPress={() => {
                      setFilter({ mes: monthValue });
                      setShowMesModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        filters.mes === monthValue && styles.modalItemTextActive,
                      ]}
                    >
                      {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Seleção de Ano */}
      <Modal
        visible={showAnoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAnoModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAnoModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Selecione o Ano</Text>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setFilter({ ano: null });
                  setShowAnoModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    !filters.ano && styles.modalItemTextActive,
                  ]}
                >
                  Todos os Anos
                </Text>
              </TouchableOpacity>
              {Array.from({ length: 5 }).map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <TouchableOpacity
                    key={year}
                    style={styles.modalItem}
                    onPress={() => {
                      setFilter({ ano: year });
                      setShowAnoModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        filters.ano === year && styles.modalItemTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
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
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  filtersCard: {
    marginBottom: 24,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  quickFilters: {
    marginBottom: 16,
  },
  filtersLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  quickFiltersRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickFilterButtonActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  quickFilterTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  detailedFilters: {
    gap: 12,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    minWidth: 100,
  },
  selectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectText: {
    fontSize: 14,
    color: '#111827',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
  },
  metricsContainer: {
    marginBottom: 24,
    gap: 16,
  },
  metricCardWrapper: {
    width: '100%',
  },
  metricCard: {
    width: '100%',
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardPeriod: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardBody: {
    gap: 16,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  progressContainer: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
  },
  commissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    gap: 12,
  },
  commissionText: {
    flex: 1,
  },
  commissionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '500',
  },
  commissionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '80%',
    maxHeight: '70%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
  },
  modalItemTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
