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
          id: 1,
          cliente_id: 1,
          servico_id: 1,
          colaborador_id: 1,
          barbearia_id: 1,
          data_hora: '2024-01-20T09:00:00',
          status: StatusAgendamento.AGENDADO,
          observacoes: 'Cliente preferencial',
          cliente: {
            id: 1,
            nome: 'João Silva',
            telefone: '11999999999',
            email: 'joao@email.com',
            barbearia_id: 1,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00',
          },
          servico: {
            id: 1,
            nome: 'Corte + Barba',
            descricao: 'Corte completo com barba',
            duracao_minutos: 60,
            preco: 45.00,
            ativo: true,
            barbearia_id: 1,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00',
          },
          colaborador: {
            id: 1,
            nome: 'Carlos Barbeiro',
            email: 'carlos@email.com',
            telefone: '11888888888',
            ativo: true,
            barbearia_id: 1,
            permissoes: [],
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00',
          },
          created_at: '2024-01-15T00:00:00',
          updated_at: '2024-01-15T00:00:00',
        },
        {
          id: 2,
          cliente_id: 2,
          servico_id: 2,
          colaborador_id: 1,
          barbearia_id: 1,
          data_hora: '2024-01-20T10:30:00',
          status: StatusAgendamento.CONFIRMADO,
          observacoes: '',
          cliente: {
            id: 2,
            nome: 'Maria Santos',
            telefone: '11777777777',
            email: 'maria@email.com',
            barbearia_id: 1,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00',
          },
          servico: {
            id: 2,
            nome: 'Corte Simples',
            descricao: 'Corte básico',
            duracao_minutos: 30,
            preco: 25.00,
            ativo: true,
            barbearia_id: 1,
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00',
          },
          colaborador: {
            id: 1,
            nome: 'Carlos Barbeiro',
            email: 'carlos@email.com',
            telefone: '11888888888',
            ativo: true,
            barbearia_id: 1,
            permissoes: [],
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00',
          },
          created_at: '2024-01-16T00:00:00',
          updated_at: '2024-01-16T00:00:00',
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

  const getStatusBadgeVariant = (status: StatusAgendamento) => {
    switch (status) {
      case StatusAgendamento.AGENDADO:
        return 'info';
      case StatusAgendamento.CONFIRMADO:
        return 'success';
      case StatusAgendamento.EM_ATENDIMENTO:
        return 'warning';
      case StatusAgendamento.CONCLUIDO:
        return 'success';
      case StatusAgendamento.CANCELADO:
        return 'error';
      case StatusAgendamento.FALTOU:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: StatusAgendamento) => {
    switch (status) {
      case StatusAgendamento.AGENDADO:
        return 'Agendado';
      case StatusAgendamento.CONFIRMADO:
        return 'Confirmado';
      case StatusAgendamento.EM_ATENDIMENTO:
        return 'Em Atendimento';
      case StatusAgendamento.CONCLUIDO:
        return 'Concluído';
      case StatusAgendamento.CANCELADO:
        return 'Cancelado';
      case StatusAgendamento.FALTOU:
        return 'Faltou';
      default:
        return status;
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
            const { date, time } = formatDateTime(agendamento.data_hora);
            
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
                        <Text style={styles.servicoNome}>
                          {agendamento.servico.nome}
                        </Text>
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
                      
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Duração:</Text>
                        <Text style={styles.detailValue}>
                          {agendamento.servico.duracao_minutos} min
                        </Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Valor:</Text>
                        <Text style={styles.detailValue}>
                          {formatMoney(agendamento.servico.preco)}
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
