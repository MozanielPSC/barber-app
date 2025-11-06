import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useBarbeariasStore, usePoteStore } from '../../stores';
import { DistribuicaoCompleta } from '../../types';
import { showMessage } from 'react-native-flash-message';
import { ArrowLeftIcon, CurrencyDollarIcon } from 'react-native-heroicons/outline';

export default function DistribuicoesScreen() {
  const { barbeariaSelecionada } = useBarbeariasStore();
  const { distribuicoes, loadDistribuicoes, isLoading } = usePoteStore();

  useEffect(() => {
    if (barbeariaSelecionada?.id) {
      loadDistribuicoes(barbeariaSelecionada.id, 20).catch((error) => {
        showMessage({
          message: 'Erro ao carregar distribuições',
          type: 'danger',
        });
      });
    }
  }, [barbeariaSelecionada?.id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatPeriodo = (periodoStr: string) => {
    // YYYY-MM -> Mês/Ano
    const [ano, mes] = periodoStr.split('-');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[parseInt(mes) - 1]} ${ano}`;
  };

  if (isLoading && distribuicoes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Carregando distribuições...</Text>
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
          <Text style={styles.title}>Distribuições</Text>
          <Text style={styles.subtitle}>Histórico de distribuições do pote processadas</Text>
        </View>
      </View>

      {/* List */}
      {distribuicoes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <CurrencyDollarIcon size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Nenhuma distribuição encontrada</Text>
          <Text style={styles.emptyMessage}>
            Ainda não há distribuições processadas
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {distribuicoes.map((item) => (
            <TouchableOpacity
              key={item.distribuicao.id}
              style={styles.card}
              onPress={() => router.push(`/pote/distribuicoes/${item.distribuicao.id}`)}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.cardTitle}>
                    Distribuição de {formatPeriodo(item.distribuicao.periodo_referencia)}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {item.resumo.total_colaboradores} {item.resumo.total_colaboradores === 1 ? 'colaborador beneficiado' : 'colaboradores beneficiados'}
                  </Text>
                  <Text style={styles.cardDate}>
                    Processada em {formatDate(item.distribuicao.data_distribuicao)}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Processada</Text>
                </View>
              </View>

              {/* Metrics Grid */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Valor Total</Text>
                  <Text style={styles.metricValue}>
                    {formatCurrency(item.resumo.valor_total_pote)}
                  </Text>
                </View>
                
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Valor Casa</Text>
                  <Text style={styles.metricValue}>
                    {formatCurrency(item.resumo.valor_casa)}
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Distribuído</Text>
                  <Text style={[styles.metricValue, { color: '#10B981' }]}>
                    {formatCurrency(item.resumo.valor_distribuido)}
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Total Fichas</Text>
                  <Text style={styles.metricValue}>
                    {item.resumo.total_fichas}
                  </Text>
                </View>
              </View>

              {/* Action */}
              <View style={styles.cardFooter}>
                <Text style={styles.detailsLink}>Ver Detalhes →</Text>
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
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  metricLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
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
  },
});

