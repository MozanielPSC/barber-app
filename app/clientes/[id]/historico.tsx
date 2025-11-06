import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { clientesService } from '../../../services';
import { useBarbeariasStore } from '../../../stores';
import { Card, CardContent } from '../../../components/ui';
import { ClienteHistorico, AtendimentoHistorico } from '../../../types/clientes';

// Função para formatar data e hora
const formatDateTime = (data: string, horario: string) => {
  try {
    const date = new Date(`${data}T${horario}`);
    return {
      date: date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  } catch {
    return { date: data, time: horario };
  }
};

// Função para formatar dinheiro
const formatMoney = (value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num || 0);
};

// Função para obter cor do status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'concluido':
      return '#10B981';
    case 'agendado':
      return '#3B82F6';
    case 'em_andamento':
      return '#F59E0B';
    case 'cancelado':
      return '#EF4444';
    case 'nao_compareceu':
      return '#F97316';
    default:
      return '#6B7280';
  }
};

// Função para obter texto do status
const getStatusText = (status: string) => {
  switch (status) {
    case 'concluido':
      return 'Concluído';
    case 'agendado':
      return 'Agendado';
    case 'em_andamento':
      return 'Em Andamento';
    case 'cancelado':
      return 'Cancelado';
    case 'nao_compareceu':
      return 'Não Compareceu';
    default:
      return status;
  }
};

// Função para obter iniciais do nome
const getIniciais = (nome: string): string => {
  const partes = nome.trim().split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
  return nome.substring(0, 2).toUpperCase();
};

export default function ClienteHistoricoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { barbeariaAtual } = useBarbeariasStore();
  const [historico, setHistorico] = useState<ClienteHistorico | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistorico();
  }, [id, barbeariaAtual]);

  const loadHistorico = async () => {
    if (!id || !barbeariaAtual?.id) return;

    setLoading(true);
    try {
      const data = await clientesService.getHistorico(id, barbeariaAtual.id);
      setHistorico(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar o histórico', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAtendimentoPress = (atendimentoId: string) => {
    // Navegar para detalhes do atendimento
    router.push(`/agenda/${atendimentoId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Carregando histórico...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!historico) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Histórico não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { cliente, estatisticas, atendimentos } = historico;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Histórico do Cliente</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {cliente.nome}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Card de Estatísticas */}
        <Card style={styles.statsCard}>
          <CardContent>
            <Text style={styles.statsTitle}>Estatísticas</Text>
            
            {/* Grid 4 colunas */}
            <View style={styles.statsGrid4}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{estatisticas.total_atendimentos}</Text>
                <Text style={styles.statLabel}>Total de Atendimentos</Text>
              </View>
              <View style={[styles.statItem, styles.statItemSuccess]}>
                <Text style={[styles.statValue, styles.statValueSuccess]}>
                  {estatisticas.atendimentos_concluidos}
                </Text>
                <Text style={styles.statLabel}>Concluídos</Text>
              </View>
              <View style={[styles.statItem, styles.statItemError]}>
                <Text style={[styles.statValue, styles.statValueError]}>
                  {estatisticas.atendimentos_cancelados}
                </Text>
                <Text style={styles.statLabel}>Cancelados</Text>
              </View>
              <View style={[styles.statItem, styles.statItemPurple]}>
                <Text style={[styles.statValue, styles.statValuePurple]}>
                  {formatMoney(estatisticas.total_gasto_geral)}
                </Text>
                <Text style={styles.statLabel}>Total Gasto</Text>
              </View>
            </View>

            {/* Grid 3 colunas */}
            <View style={styles.statsGrid3}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatMoney(estatisticas.total_gasto_servicos)}</Text>
                <Text style={styles.statLabel}>Gasto em Serviços</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatMoney(estatisticas.total_gasto_produtos)}</Text>
                <Text style={styles.statLabel}>Gasto em Produtos</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{estatisticas.colaboradores_que_atenderam}</Text>
                <Text style={styles.statLabel}>Colaboradores</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Timeline de Atendimentos */}
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Atendimentos</Text>
          
          {!atendimentos || atendimentos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>Nenhum atendimento encontrado</Text>
            </View>
          ) : (
            <View style={styles.timeline}>
              {(atendimentos || []).map((atendimento, index) => {
                const { date, time } = formatDateTime(
                  atendimento.data_atendimento,
                  atendimento.horario_inicio
                );
                const statusColor = getStatusColor(atendimento.status);
                const totalServicos = atendimento.servicos.reduce(
                  (sum, s) => sum + parseFloat(s.preco || '0'),
                  0
                );
                const totalProdutos = atendimento.produtos.reduce(
                  (sum, p) => sum + parseFloat(p.preco || '0') * p.quantidade,
                  0
                );
                const totalGeral = totalServicos + totalProdutos;

                return (
                  <View key={atendimento.id} style={styles.timelineItem}>
                    {/* Linha da timeline */}
                    {index < (atendimentos?.length || 0) - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: statusColor }]} />
                    )}
                    
                    {/* Ponto na timeline */}
                    <View style={[styles.timelineDot, { backgroundColor: statusColor }]} />
                    
                    {/* Card do atendimento */}
                    <Card style={styles.atendimentoCard}>
                      <CardContent>
                        {/* Header */}
                        <View style={styles.atendimentoHeader}>
                          <View style={styles.colaboradorInfo}>
                            {atendimento.colaborador.foto_perfil_url_assinada ? (
                              <View style={styles.colaboradorAvatar}>
                                <Ionicons name="person" size={20} color="#FFFFFF" />
                              </View>
                            ) : (
                              <View style={styles.colaboradorAvatar}>
                                <Text style={styles.colaboradorAvatarText}>
                                  {getIniciais(atendimento.colaborador.nome)}
                                </Text>
                              </View>
                            )}
                            <View style={styles.colaboradorDetails}>
                              <Text style={styles.colaboradorNome}>
                                {atendimento.colaborador.nome}
                              </Text>
                              {atendimento.colaborador.funcao && (
                                <Text style={styles.colaboradorFuncao}>
                                  {atendimento.colaborador.funcao}
                                </Text>
                              )}
                            </View>
                          </View>
                          <View style={styles.atendimentoDate}>
                            <Text style={styles.dateText}>{date}</Text>
                            <Text style={styles.timeText}>{time}</Text>
                          </View>
                        </View>

                        {/* Status */}
                        <View style={styles.statusBadge}>
                          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                          <Text style={styles.statusText}>{getStatusText(atendimento.status)}</Text>
                        </View>

                        {/* Serviços */}
                        {atendimento.servicos && atendimento.servicos.length > 0 && (
                          <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Serviços</Text>
                            {atendimento.servicos.map((servico) => (
                              <View key={servico.id} style={styles.itemRow}>
                                <Text style={styles.itemNome}>{servico.nome}</Text>
                                <Text style={styles.itemPreco}>{formatMoney(servico.preco)}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* Produtos */}
                        {atendimento.produtos && atendimento.produtos.length > 0 && (
                          <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Produtos</Text>
                            {atendimento.produtos.map((produto) => (
                              <View key={produto.id} style={styles.itemRow}>
                                <Text style={styles.itemNome}>
                                  {produto.nome} (x{produto.quantidade})
                                </Text>
                                <Text style={styles.itemPreco}>
                                  {formatMoney(parseFloat(produto.preco || '0') * produto.quantidade)}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* Total */}
                        <View style={styles.totalRow}>
                          <Text style={styles.totalLabel}>Total</Text>
                          <Text style={styles.totalValue}>{formatMoney(totalGeral)}</Text>
                        </View>

                        {/* Ação */}
                        <TouchableOpacity
                          style={styles.detailsButton}
                          onPress={() => handleAtendimentoPress(atendimento.id)}
                        >
                          <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
                          <Ionicons name="chevron-forward" size={16} color="#2563EB" />
                        </TouchableOpacity>
                      </CardContent>
                    </Card>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statsGrid3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    width: '48%',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  statItemSuccess: {
    backgroundColor: '#D1FAE5',
  },
  statItemError: {
    backgroundColor: '#FEE2E2',
  },
  statItemPurple: {
    backgroundColor: '#E9D5FF',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statValueSuccess: {
    color: '#059669',
  },
  statValueError: {
    color: '#DC2626',
  },
  statValuePurple: {
    color: '#7C3AED',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  timelineContainer: {
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  timeline: {
    position: 'relative',
  },
  timelineItem: {
    position: 'relative',
    paddingLeft: 24,
    marginBottom: 16,
  },
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 20,
    width: 2,
    height: '100%',
  },
  timelineDot: {
    position: 'absolute',
    left: 4,
    top: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  atendimentoCard: {
    marginLeft: 8,
  },
  atendimentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  colaboradorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colaboradorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  colaboradorAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  colaboradorDetails: {
    flex: 1,
  },
  colaboradorNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  colaboradorFuncao: {
    fontSize: 12,
    color: '#6B7280',
  },
  atendimentoDate: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemNome: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  itemPreco: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#DBEAFE',
    borderRadius: 6,
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
});

