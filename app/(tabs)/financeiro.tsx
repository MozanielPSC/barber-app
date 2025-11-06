import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceiroStore, useGastosStore, useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';

export default function FinanceiroScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const {
    metricas,
    despesasFixas,
    despesasVariaveis,
    canais,
    isLoading,
    loadMetricasDashboard,
    loadDespesasFixas,
    loadDespesasVariaveis,
    loadCanais,
  } = useFinanceiroStore();
  const { gastos, listarGastos } = useGastosStore();

  const [mesAno, setMesAno] = useState(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadData();
    }
  }, [barbeariaAtual?.id, mesAno]);

  const loadData = async () => {
    if (!barbeariaAtual?.id) return;

    try {
      await Promise.all([
        loadMetricasDashboard(mesAno, barbeariaAtual.id),
        loadDespesasFixas(barbeariaAtual.id),
        loadDespesasVariaveis(barbeariaAtual.id),
        loadCanais(barbeariaAtual.id),
        listarGastos(barbeariaAtual.id),
      ]);
    } catch (error: any) {
      console.error('Erro ao carregar dados financeiros:', error);
      showMessage({
        message: 'Erro',
        description: 'Erro ao carregar dados financeiros',
        type: 'danger',
      });
    }
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarVariacao = (variacao?: number | null) => {
    if (variacao === null || variacao === undefined) return '—';
    const sinal = variacao >= 0 ? '+' : '';
    return `${sinal}${variacao.toFixed(1)}%`;
  };

  const totalDespesasFixas = despesasFixas.reduce((sum, d) => sum + d.valor, 0);
  const totalDespesasVariaveis = despesasVariaveis.reduce((sum, d) => sum + d.valor, 0);
  const totalCanais = canais.reduce((sum, c) => sum + c.gasto, 0);

  const renderCardAcesso = (titulo: string, icon: any, cor: string, valor: number, subtitulo: string, rota: string) => {
    return (
      <TouchableOpacity
        style={styles.cardAcesso}
        onPress={() => router.push(rota as any)}
        activeOpacity={0.7}
      >
        <Card>
          <CardContent>
            <View style={[styles.iconCirculo, { backgroundColor: cor + '20' }]}>
              <Ionicons name={icon} size={24} color={cor} />
            </View>
            <Text style={styles.cardAcessoTitulo}>{titulo}</Text>
            <Text style={[styles.cardAcessoValor, { color: cor }]}>
              {formatarMoeda(valor)}
            </Text>
            <Text style={styles.cardAcessoSubtitulo}>{subtitulo}</Text>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderMetrica = (label: string, metrica: any, inverterCor: boolean = false) => {
    const temVariacao = metrica?.variacao_percentual !== null && metrica?.variacao_percentual !== undefined;
    const isPositivo = metrica?.variacao_percentual >= 0;
    const corVariacao = inverterCor
      ? (isPositivo ? '#EF4444' : '#10B981')
      : (isPositivo ? '#10B981' : '#EF4444');

    return (
      <Card style={styles.metricaCard}>
        <CardContent>
          <Text style={styles.metricaLabel}>{label}</Text>
          <Text style={styles.metricaValor}>
            {metrica ? formatarMoeda(metrica.valor) : '—'}
          </Text>
          {temVariacao && (
            <Text style={[styles.metricaVariacao, { color: corVariacao }]}>
              {formatarVariacao(metrica.variacao_percentual)}
            </Text>
          )}
          {metrica?.margem_percentual !== undefined && (
            <Text style={styles.metricaPercentual}>
              Margem: {metrica.margem_percentual.toFixed(1)}%
            </Text>
          )}
          {metrica?.percentual !== undefined && (
            <Text style={styles.metricaPercentual}>
              {metrica.percentual.toFixed(1)}%
            </Text>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading && !metricas) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Financeiro</Text>
        <Text style={styles.headerSubtitle}>Visão geral do período</Text>
      </View>

      {/* Filtro de Período */}
      <Card style={styles.periodoCard}>
        <CardContent>
          <Text style={styles.periodoLabel}>Período de Análise</Text>
          <Text style={styles.periodoValor}>
            {new Date(mesAno + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </Text>
        </CardContent>
      </Card>

      {/* Cards de Acesso Rápido */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Acesso Rápido</Text>
        <View style={styles.acessoGrid}>
          {renderCardAcesso(
            'Despesas Fixas',
            'calendar',
            '#EF4444',
            totalDespesasFixas,
            `${despesasFixas.length} itens`,
            '/financeiro/despesas-fixas'
          )}
          {renderCardAcesso(
            'Despesas Variáveis',
            'trending-up',
            '#F59E0B',
            totalDespesasVariaveis,
            `${despesasVariaveis.length} itens`,
            '/financeiro/despesas-variaveis'
          )}
          {renderCardAcesso(
            'Canais Marketing',
            'megaphone',
            '#6366F1',
            totalCanais,
            `${canais.length} canais`,
            '/financeiro/canais'
          )}
          {renderCardAcesso(
            'Gastos Colaboradores',
            'people',
            '#9333EA',
            gastos.reduce((sum, g) => sum + parseFloat(g.valor_total.toString()), 0),
            `${gastos.length} gastos`,
            '/financeiro/gastos'
          )}
        </View>
      </View>

      {/* Métricas Principais */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Métricas Principais</Text>
        <View style={styles.metricasGrid}>
          {renderMetrica('FATURAMENTO BRUTO', metricas?.faturamento_bruto)}
          {renderMetrica('LUCRO BRUTO', metricas?.lucro_bruto)}
          {renderMetrica('MARGEM DE CONTRIBUIÇÃO', metricas?.margem_contribuicao)}
          {renderMetrica('EBITDA', metricas?.ebitda)}
          {renderMetrica('CUSTOS E DEDUÇÕES', metricas?.custos_deducoes, true)}
          {renderMetrica('DESPESAS VARIÁVEIS', metricas?.despesas_variaveis, true)}
          {renderMetrica('DESPESAS FIXAS', metricas?.despesas_fixas, true)}
          {renderMetrica('DESPESAS NÃO OPERACIONAIS', metricas?.despesas_nao_operacionais, true)}
        </View>
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
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  periodoCard: {
    margin: 16,
  },
  periodoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  periodoValor: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'capitalize',
  },
  secao: {
    padding: 16,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  acessoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardAcesso: {
    width: '48%',
  },
  iconCirculo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardAcessoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  cardAcessoValor: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardAcessoSubtitulo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metricasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricaCard: {
    width: '48%',
  },
  metricaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  metricaValor: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricaVariacao: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricaPercentual: {
    fontSize: 12,
    color: '#6B7280',
  },
});
