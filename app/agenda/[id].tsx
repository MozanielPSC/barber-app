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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAgendamentosStore, useBarbeariasStore } from '../../stores';
import { Card, CardContent } from '../../components/ui';
import { Button } from '../../components/ui/Button';

export default function AgendamentoDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agendamentoAtual, isLoading, getAgendamento, deleteAgendamento, iniciarAtendimento, cancelarAgendamento } = useAgendamentosStore();
  const { barbeariaAtual } = useBarbeariasStore();
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getAgendamento(id).catch(() => {
        // Erro silencioso
      });
    }
  }, [id]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'em_andamento':
        return 'Em Atendimento';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return '#3B82F6';
      case 'em_andamento':
        return '#F59E0B';
      case 'concluido':
        return '#10B981';
      case 'cancelado':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const handleIniciarAtendimento = async () => {
    if (!id) return;
    
    Alert.alert(
      'Iniciar Atendimento',
      'Deseja iniciar o atendimento deste agendamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar',
          style: 'default',
          onPress: async () => {
            setActionLoading(true);
            try {
              if (!barbeariaAtual?.id) {
                Alert.alert('Erro', 'Barbearia não selecionada');
                return;
              }
              await iniciarAtendimento(id, barbeariaAtual.id);
              router.back();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível iniciar o atendimento');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancelar = async () => {
    if (!id) return;
    
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              if (!barbeariaAtual?.id) {
                Alert.alert('Erro', 'Barbearia não selecionada');
                return;
              }
              await cancelarAgendamento(id, barbeariaAtual.id);
              router.back();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível cancelar o agendamento');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditar = () => {
    if (id) {
      router.push(`/agenda/${id}/editar`);
    }
  };

  const handleExcluir = async () => {
    if (!id) return;
    
    Alert.alert(
      'Excluir Agendamento',
      'Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              if (!barbeariaAtual?.id) {
                Alert.alert('Erro', 'Barbearia não selecionada');
                return;
              }
              await deleteAgendamento(id, barbeariaAtual.id);
              router.back();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível excluir o agendamento');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading || !agendamentoAtual) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Carregando agendamento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Formata data e hora
  const horarioFormatado = agendamentoAtual.horario_inicio.split(':').slice(0, 2).join(':');
  const dataHora = agendamentoAtual.data_hora 
    ? new Date(agendamentoAtual.data_hora)
    : new Date(`${agendamentoAtual.data_atendimento}T${horarioFormatado}`);
  const { date, time } = formatDateTime(dataHora.toISOString());
  
  const totalPreco = agendamentoAtual.servicos?.reduce((sum, s) => {
    const preco = typeof s.preco === 'string' ? parseFloat(s.preco) : s.preco;
    return sum + preco;
  }, 0) || 0;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header com Status */}
        <Card style={styles.statusCard}>
          <CardContent>
            <View style={styles.statusHeader}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(agendamentoAtual.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(agendamentoAtual.status)}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Informações do Agendamento */}
        <Card style={styles.infoCard}>
          <CardContent>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cliente</Text>
              <Text style={styles.sectionValue}>
                {agendamentoAtual.cliente?.nome || agendamentoAtual.cliente_nome || 'N/A'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Colaborador</Text>
              <Text style={styles.sectionValue}>
                {agendamentoAtual.colaborador?.nome || agendamentoAtual.colaborador_nome || 'N/A'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data e Horário</Text>
              <Text style={styles.sectionValue}>
                {dataHora.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.sectionSubValue}>
                {horarioFormatado}
              </Text>
            </View>

            {agendamentoAtual.servicos && agendamentoAtual.servicos.length > 0 && (
              <>
                <View style={styles.divider} />
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Serviços</Text>
                  {agendamentoAtual.servicos.map((servico, index) => {
                    const preco = typeof servico.preco === 'string' ? parseFloat(servico.preco) : servico.preco;
                    return (
                      <View key={index} style={styles.servicoItem}>
                        <Text style={styles.servicoNome}>{servico.nome}</Text>
                        <Text style={styles.servicoPreco}>{formatMoney(preco)}</Text>
                      </View>
                    );
                  })}
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>{formatMoney(totalPreco)}</Text>
                  </View>
                </View>
              </>
            )}

            {agendamentoAtual.observacoes && (
              <>
                <View style={styles.divider} />
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Observações</Text>
                  <Text style={styles.observacoesText}>{agendamentoAtual.observacoes}</Text>
                </View>
              </>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        <View style={styles.actions}>
          {agendamentoAtual.status === 'agendado' && (
            <Button
              title="Iniciar Atendimento"
              onPress={handleIniciarAtendimento}
              variant="primary"
              style={styles.actionButton}
              disabled={actionLoading}
            />
          )}

          {agendamentoAtual.status === 'agendado' && (
            <Button
              title="Editar"
              onPress={handleEditar}
              variant="outline"
              style={styles.actionButton}
              disabled={actionLoading}
            />
          )}

          {agendamentoAtual.status === 'agendado' && (
            <Button
              title="Cancelar"
              onPress={handleCancelar}
              variant="outline"
              style={[styles.actionButton, styles.cancelButton]}
              disabled={actionLoading}
            />
          )}

          <TouchableOpacity
            style={[styles.deleteButton, actionLoading && styles.deleteButtonDisabled]}
            onPress={handleExcluir}
            disabled={actionLoading}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Excluir Agendamento</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  infoCard: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sectionSubValue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  servicoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  servicoNome: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  servicoPreco: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  observacoesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
  cancelButton: {
    borderColor: '#EF4444',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});

