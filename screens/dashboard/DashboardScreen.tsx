import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Card, CardContent, CardHeader } from '../../components/ui';
import { DashboardKPIs } from '../../types';

interface DashboardScreenProps {
  navigation?: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    try {
      setLoading(true);
      // Simular carregamento de KPIs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data para demonstração
      const mockKPIs: DashboardKPIs = {
        receita_total: 15420.50,
        ticket_medio: 85.30,
        clientes_atendidos: 180,
        taxa_conversao: 78.5,
        clientes_em_risco: [
          {
            cliente_id: 1,
            cliente_nome: 'João Silva',
            ultima_visita: '2024-01-15',
            dias_sem_visitar: 15,
          },
          {
            cliente_id: 2,
            cliente_nome: 'Maria Santos',
            ultima_visita: '2024-01-10',
            dias_sem_visitar: 20,
          },
        ],
        estatisticas_canais: [
          {
            canal_id: 1,
            canal_nome: 'Instagram',
            total_agendamentos: 45,
            total_receita: 3825.00,
          },
          {
            canal_id: 2,
            canal_nome: 'WhatsApp',
            total_agendamentos: 32,
            total_receita: 2720.00,
          },
        ],
      };
      
      setKpis(mockKPIs);
    } catch (error) {
      console.error('Erro ao carregar KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadKPIs();
    setRefreshing(false);
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Visão geral do seu negócio</Text>
        </View>

        {kpis && (
          <>
            {/* KPIs Principais */}
            <View style={styles.kpisGrid}>
              <Card style={styles.kpiCard}>
                <CardContent>
                  <Text style={styles.kpiValue}>{formatMoney(kpis.receita_total)}</Text>
                  <Text style={styles.kpiLabel}>Receita Total</Text>
                </CardContent>
              </Card>

              <Card style={styles.kpiCard}>
                <CardContent>
                  <Text style={styles.kpiValue}>{formatMoney(kpis.ticket_medio)}</Text>
                  <Text style={styles.kpiLabel}>Ticket Médio</Text>
                </CardContent>
              </Card>

              <Card style={styles.kpiCard}>
                <CardContent>
                  <Text style={styles.kpiValue}>{kpis.clientes_atendidos}</Text>
                  <Text style={styles.kpiLabel}>Clientes Atendidos</Text>
                </CardContent>
              </Card>

              <Card style={styles.kpiCard}>
                <CardContent>
                  <Text style={styles.kpiValue}>{formatPercentage(kpis.taxa_conversao)}</Text>
                  <Text style={styles.kpiLabel}>Taxa de Conversão</Text>
                </CardContent>
              </Card>
            </View>

            {/* Clientes em Risco */}
            <Card style={styles.sectionCard}>
              <CardHeader>
                <Text style={styles.sectionTitle}>Clientes em Risco</Text>
                <Badge variant="warning" size="small">
                  {kpis.clientes_em_risco.length} clientes
                </Badge>
              </CardHeader>
              <CardContent>
                {kpis.clientes_em_risco.map((cliente) => (
                  <View key={cliente.cliente_id} style={styles.clienteRiscoItem}>
                    <View style={styles.clienteInfo}>
                      <Text style={styles.clienteNome}>{cliente.cliente_nome}</Text>
                      <Text style={styles.clienteUltimaVisita}>
                        Última visita: {formatDate(cliente.ultima_visita)}
                      </Text>
                    </View>
                    <Badge variant="error" size="small">
                      {cliente.dias_sem_visitar} dias
                    </Badge>
                  </View>
                ))}
              </CardContent>
            </Card>

            {/* Estatísticas por Canal */}
            <Card style={styles.sectionCard}>
              <CardHeader>
                <Text style={styles.sectionTitle}>Estatísticas por Canal</Text>
              </CardHeader>
              <CardContent>
                {kpis.estatisticas_canais.map((canal) => (
                  <View key={canal.canal_id} style={styles.canalItem}>
                    <View style={styles.canalInfo}>
                      <Text style={styles.canalNome}>{canal.canal_nome}</Text>
                      <Text style={styles.canalAgendamentos}>
                        {canal.total_agendamentos} agendamentos
                      </Text>
                    </View>
                    <Text style={styles.canalReceita}>
                      {formatMoney(canal.total_receita)}
                    </Text>
                  </View>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  kpisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  clienteRiscoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  clienteUltimaVisita: {
    fontSize: 14,
    color: '#6B7280',
  },
  canalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  canalInfo: {
    flex: 1,
  },
  canalNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  canalAgendamentos: {
    fontSize: 14,
    color: '#6B7280',
  },
  canalReceita: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
});
