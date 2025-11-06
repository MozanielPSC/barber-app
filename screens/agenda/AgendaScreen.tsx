import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Button, Card, CardContent, CardHeader } from '../../components/ui';
import { Agendamento, StatusAgendamento } from '../../types';

interface AgendaScreenProps {
  navigation?: any;
}

export const AgendaScreen: React.FC<AgendaScreenProps> = ({ navigation }) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadAgendamentos();
  }, [selectedDate]);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      // Simular carregamento de agendamentos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data para demonstração
      const mockAgendamentos: Agendamento[] = [
        {
          id: '1',
          cliente_id: '1',
          colaborador_id: '1',
          barbearia_id: '1',
          data_atendimento: '2024-01-20',
          horario_inicio: '09:00:00',
          data_hora: '2024-01-20T09:00:00',
          status: 'agendado',
          observacoes: 'Cliente preferencial',
          cliente: {
            id: '1',
            nome: 'João Silva',
            telefone: '11999999999',
          },
          servicos: [
            {
              id: '1',
              nome: 'Corte + Barba',
              preco: 45.00,
            },
          ],
          colaborador: {
            id: '1',
            nome: 'Carlos Barbeiro',
          },
        },
        {
          id: '2',
          cliente_id: '2',
          colaborador_id: '1',
          barbearia_id: '1',
          data_atendimento: '2024-01-20',
          horario_inicio: '10:30:00',
          data_hora: '2024-01-20T10:30:00',
          status: 'confirmado',
          observacoes: '',
          cliente: {
            id: '2',
            nome: 'Maria Santos',
            telefone: '11777777777',
          },
          servicos: [
            {
              id: '2',
              nome: 'Corte Simples',
              preco: 25.00,
            },
          ],
          colaborador: {
            id: '1',
            nome: 'Carlos Barbeiro',
          },
        },
      ];
      
      setAgendamentos(mockAgendamentos);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAgendamentos();
    setRefreshing(false);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadgeVariant = (status: string | StatusAgendamento) => {
    const statusStr = typeof status === 'string' ? status : status;
    switch (statusStr) {
      case 'agendado':
      case StatusAgendamento.AGENDADO:
        return 'info';
      case 'confirmado':
      case StatusAgendamento.CONFIRMADO:
        return 'success';
      case 'em_andamento':
      case StatusAgendamento.EM_ANDAMENTO:
        return 'warning';
      case 'concluido':
      case StatusAgendamento.CONCLUIDO:
        return 'success';
      case 'cancelado':
      case StatusAgendamento.CANCELADO:
        return 'error';
      case 'nao_compareceu':
      case StatusAgendamento.NAO_COMPARECEU:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string | StatusAgendamento) => {
    const statusStr = typeof status === 'string' ? status : status;
    switch (statusStr) {
      case 'agendado':
      case StatusAgendamento.AGENDADO:
        return 'Agendado';
      case 'confirmado':
      case StatusAgendamento.CONFIRMADO:
        return 'Confirmado';
      case 'em_andamento':
      case StatusAgendamento.EM_ANDAMENTO:
        return 'Em Atendimento';
      case 'concluido':
      case StatusAgendamento.CONCLUIDO:
        return 'Concluído';
      case 'cancelado':
      case StatusAgendamento.CANCELADO:
        return 'Cancelado';
      case 'nao_compareceu':
      case StatusAgendamento.NAO_COMPARECEU:
        return 'Não Compareceu';
      default:
        return String(status);
    }
  };

  const handleAgendamentoPress = (agendamento: Agendamento) => {
    // Navegar para detalhes do agendamento
    console.log('Abrir detalhes do agendamento:', agendamento.id);
  };

  const handleNovoAgendamento = () => {
    // Navegar para criar novo agendamento
    console.log('Criar novo agendamento');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando agenda...</Text>
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
          <Text style={styles.title}>Agenda</Text>
          <Text style={styles.subtitle}>
            {selectedDate.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="+ Novo Agendamento"
            onPress={handleNovoAgendamento}
            style={styles.novoButton}
          />
        </View>

        {agendamentos.length === 0 ? (
          <Card style={styles.emptyCard}>
            <CardContent>
              <Text style={styles.emptyText}>
                Nenhum agendamento para hoje
              </Text>
              <Button
                title="Agendar Cliente"
                onPress={handleNovoAgendamento}
                variant="outline"
                style={styles.emptyButton}
              />
            </CardContent>
          </Card>
        ) : (
          agendamentos.map((agendamento) => {
            const dataHora = agendamento.data_hora || `${agendamento.data_atendimento}T${agendamento.horario_inicio}`;
            const { date, time } = formatDateTime(dataHora);
            const primeiroServico = agendamento.servicos?.[0];
            const precoTotal = agendamento.servicos?.reduce((total, servico) => {
              const preco = typeof servico.preco === 'string' ? parseFloat(servico.preco) : servico.preco;
              return total + (preco || 0);
            }, 0) || 0;
            
            return (
              <Card key={agendamento.id} style={styles.agendamentoCard}>
                <TouchableOpacity 
                  onPress={() => handleAgendamentoPress(agendamento)}
                  activeOpacity={0.7}
                >
                  <CardHeader>
                    <View style={styles.agendamentoHeader}>
                      <View style={styles.agendamentoInfo}>
                        <Text style={styles.clienteNome}>
                          {agendamento.cliente.nome}
                        </Text>
                        {primeiroServico && (
                          <Text style={styles.servicoNome}>
                            {primeiroServico.nome}
                            {agendamento.servicos.length > 1 && ` +${agendamento.servicos.length - 1} mais`}
                          </Text>
                        )}
                      </View>
                      <Badge 
                        variant={getStatusBadgeVariant(agendamento.status)}
                        size="small"
                      >
                        {getStatusText(agendamento.status)}
                      </Badge>
                    </View>
                  </CardHeader>

                  <CardContent>
                    <View style={styles.agendamentoDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Horário:</Text>
                        <Text style={styles.detailValue}>{time}</Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Colaborador:</Text>
                        <Text style={styles.detailValue}>
                          {agendamento.colaborador.nome}
                        </Text>
                      </View>
                      
                      {agendamento.duracao_minutos && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Duração:</Text>
                          <Text style={styles.detailValue}>
                            {agendamento.duracao_minutos} min
                          </Text>
                        </View>
                      )}
                      
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Valor:</Text>
                        <Text style={styles.detailValue}>
                          {formatMoney(precoTotal)}
                        </Text>
                      </View>

                      {agendamento.observacoes && (
                        <View style={styles.observacoes}>
                          <Text style={styles.detailLabel}>Observações:</Text>
                          <Text style={styles.observacoesText}>
                            {agendamento.observacoes}
                          </Text>
                        </View>
                      )}
                    </View>
                  </CardContent>
                </TouchableOpacity>
              </Card>
            );
          })
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
    textTransform: 'capitalize',
  },
  actions: {
    marginBottom: 16,
  },
  novoButton: {
    marginBottom: 8,
  },
  emptyCard: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    minWidth: 200,
  },
  agendamentoCard: {
    marginBottom: 16,
  },
  agendamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  agendamentoInfo: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  servicoNome: {
    fontSize: 14,
    color: '#6B7280',
  },
  agendamentoDetails: {
    marginTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
  },
  observacoes: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  observacoesText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
