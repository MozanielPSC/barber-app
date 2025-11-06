import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAgendamentosStore, useColaboradoresStore, useBarbeariasStore } from '../../stores';
import { Card, CardContent } from '../../components/ui';
import { Agendamento } from '../../types';
import { StatusAgendamento } from '../../types/enums';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = 120;
const TIME_SLOT_HEIGHT = 60;
const START_HOUR = 8;
const END_HOUR = 20;

type ViewMode = 'dia' | 'semana' | 'mes';

// Gera slots de horário de 30 em 30 minutos
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

// Função para obter início da semana
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Segunda-feira
  return new Date(d.setDate(diff));
};

// Função para obter início do mês
const getMonthStart = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Função para formatar range
const formatDateRange = (start: Date, end: Date, mode: ViewMode): string => {
  if (mode === 'dia') {
    return start.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  
  const startStr = start.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  const endStr = end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startStr} - ${endStr}`;
};

// Função para formatar data
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
};

export default function AgendaScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { colaboradores, loadColaboradores } = useColaboradoresStore();
  const { agendamentos, isLoading, loadAgendamentos } = useAgendamentosStore();
  const [viewMode, setViewMode] = useState<ViewMode>('semana');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const timeSlots = generateTimeSlots();

  // Calcula as datas baseado no modo de visualização
  const getDatesForView = () => {
    if (viewMode === 'dia') {
      return [new Date(currentDate)];
    } else if (viewMode === 'semana') {
      const weekStart = getWeekStart(currentDate);
      return Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        return date;
      });
    } else {
      // Mês
      const monthStart = getMonthStart(currentDate);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      const daysInMonth = monthEnd.getDate();
      return Array.from({ length: daysInMonth }).map((_, i) => {
        const date = new Date(monthStart);
        date.setDate(date.getDate() + i);
        return date;
      });
    }
  };

  const dates = getDatesForView();
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadColaboradores({ barbearia_id: barbeariaAtual.id }).catch(() => {});
    }
  }, [barbeariaAtual]);

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadAgendamentosForView();
    }
  }, [barbeariaAtual, currentDate, viewMode]);

  const loadAgendamentosForView = async () => {
    if (!barbeariaAtual?.id) return;
    
    const dataInicio = startDate.toISOString().split('T')[0];
    const dataFim = endDate.toISOString().split('T')[0];

    await loadAgendamentos({
      barbearia_id: barbeariaAtual.id,
      data_inicio: dataInicio,
      data_fim: dataFim,
    }).catch(() => {});
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAgendamentosForView();
    setRefreshing(false);
  };

  const previousPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'dia') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'semana') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'dia') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'semana') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Encontra agendamento para um horário e colaborador específicos
  const findAgendamento = (timeSlot: string, colaboradorId: number | string, dayIndex: number): Agendamento | null => {
    const day = dates[dayIndex];
    const [hour, minute] = timeSlot.split(':').map(Number);
    
    const dayString = day.toISOString().split('T')[0]; // YYYY-MM-DD
    const colabIdStr = String(colaboradorId);

    const found = agendamentos.find((ag) => {
      // Compara data
      if (ag.data_atendimento !== dayString) return false;
      
      // Compara horário (formato pode ser "09:00:00" ou "09:00")
      const agTimeParts = ag.horario_inicio.split(':');
      const agHour = parseInt(agTimeParts[0], 10);
      const agMinute = parseInt(agTimeParts[1], 10);
      if (agHour !== hour || agMinute !== minute) return false;
      
      // Compara colaborador - ambos como string para garantir match
      const agColabId = String(ag.colaborador_id || '');
      if (agColabId !== colabIdStr) return false;
      
      return true;
    });

    return found || null;
  };

  // Encontra todos os agendamentos de um dia e colaborador
  const findAgendamentosForDay = (day: Date, colaboradorId: number | string): Agendamento[] => {
    const dayString = day.toISOString().split('T')[0];
    const colabIdStr = colaboradorId.toString();
    
    return agendamentos.filter((ag) => {
      const sameDay = ag.data_atendimento === dayString;
      const agColabId = ag.colaborador_id?.toString() || '';
      const sameColab = agColabId === colabIdStr || agColabId === colaboradorId.toString();
      return sameDay && sameColab;
    });
  };

  const handleAgendamentoPress = (agendamento: Agendamento) => {
    router.push(`/agenda/${agendamento.id}`);
  };

  const handleNovoAgendamento = () => {
    router.push('/agenda/novo');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
      case StatusAgendamento.AGENDADO:
        return '#3B82F6';
      case 'confirmado':
      case StatusAgendamento.CONFIRMADO:
        return '#10B981';
      case 'em_andamento':
      case StatusAgendamento.EM_ANDAMENTO:
        return '#F59E0B';
      case 'concluido':
      case StatusAgendamento.CONCLUIDO:
        return '#10B981';
      case 'cancelado':
      case StatusAgendamento.CANCELADO:
        return '#EF4444';
      case 'nao_compareceu':
      case StatusAgendamento.NAO_COMPARECEU:
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (isLoading && (!agendamentos || agendamentos.length === 0)) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Carregando agenda...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Agenda</Text>
          <Text style={styles.subtitle}>Visualize e gerencie os agendamentos</Text>
        </View>
        <TouchableOpacity style={styles.novoButton} onPress={handleNovoAgendamento}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.novoButtonText}>Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Seletor de Visualização */}
      <View style={styles.viewModeSelector}>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'dia' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('dia')}
        >
          <Text style={[styles.viewModeText, viewMode === 'dia' && styles.viewModeTextActive]}>
            Dia
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'semana' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('semana')}
        >
          <Text style={[styles.viewModeText, viewMode === 'semana' && styles.viewModeTextActive]}>
            Semana
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'mes' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('mes')}
        >
          <Text style={[styles.viewModeText, viewMode === 'mes' && styles.viewModeTextActive]}>
            Mês
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navegação */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={previousPeriod} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToToday} style={styles.dateRange}>
          <Text style={styles.dateRangeText}>
            {formatDateRange(startDate, endDate, viewMode)}
          </Text>
          <Text style={styles.todayText}>Hoje</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextPeriod} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <ScrollView
        horizontal
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        <ScrollView
          style={styles.verticalScroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
        >
          <View style={styles.grid}>
            {/* Header com colaboradores */}
            <View style={styles.gridHeader}>
              <View style={[styles.timeColumn, styles.headerCell]}>
                <Text style={styles.headerText}>Horário</Text>
              </View>
              {(colaboradores || []).map((colab) => (
                <View key={colab.id} style={[styles.colaboradorColumn, styles.headerCell]}>
                  <Text style={styles.headerText} numberOfLines={2}>
                    {colab.nome}
                  </Text>
                </View>
              ))}
            </View>

            {/* Linhas de dias */}
            {dates.map((day, dayIndex) => (
              <View key={dayIndex}>
                {/* Header do dia */}
                <View style={styles.dayHeader}>
                  <View style={styles.timeColumn}>
                    <Text style={styles.dayHeaderText}>
                      {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </Text>
                    <Text
                      style={[
                        styles.dayHeaderDate,
                        isToday(day) && styles.dayHeaderDateToday,
                      ]}
                    >
                      {formatDate(day)}
                    </Text>
                  </View>
                  {(colaboradores || []).map((colab) => (
                    <View key={colab.id} style={styles.colaboradorColumn}>
                      <View
                        style={[
                          styles.dayCell,
                          isToday(day) && styles.dayCellToday,
                        ]}
                      />
                    </View>
                  ))}
                </View>

                {/* Conteúdo do dia */}
                {viewMode === 'mes' ? (
                  // Visualização compacta para mês - mostra apenas lista de agendamentos
                  <View style={styles.gridRow}>
                    <View style={styles.timeColumn}>
                      <View style={styles.emptyCell} />
                    </View>
                    {(colaboradores || []).map((colab) => {
                      const agendamentosDoDia = findAgendamentosForDay(day, colab.id);
                      return (
                        <View key={colab.id} style={styles.monthCell}>
                          {agendamentosDoDia.length > 0 ? (
                            <View style={styles.monthAgendamentosList}>
                              {agendamentosDoDia.slice(0, 3).map((ag) => (
                                <TouchableOpacity
                                  key={ag.id}
                                  style={[
                                    styles.monthAgendamentoItem,
                                    { borderLeftColor: getStatusColor(ag.status) },
                                  ]}
                                  onPress={() => handleAgendamentoPress(ag)}
                                >
                                  <Text style={styles.monthAgendamentoTime} numberOfLines={1}>
                                    {ag.horario_inicio.split(':').slice(0, 2).join(':')}
                                  </Text>
                                  <Text style={styles.monthAgendamentoCliente} numberOfLines={1}>
                                    {ag.cliente?.nome || ag.cliente_nome || 'Cliente'}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                              {agendamentosDoDia.length > 3 && (
                                <Text style={styles.monthAgendamentoMore}>
                                  +{agendamentosDoDia.length - 3} mais
                                </Text>
                              )}
                            </View>
                          ) : (
                            <View style={styles.emptyCell} />
                          )}
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  // Visualização detalhada para dia e semana
                  timeSlots.map((timeSlot) => (
                    <View key={`${dayIndex}-${timeSlot}`} style={styles.gridRow}>
                      <View style={styles.timeColumn}>
                        <Text style={styles.timeCell}>{timeSlot}</Text>
                      </View>
                      {(colaboradores || []).map((colab) => {
                        const agendamento = findAgendamento(timeSlot, colab.id, dayIndex);
                        return (
                          <TouchableOpacity
                            key={colab.id}
                            style={[
                              styles.cell,
                              agendamento && {
                                backgroundColor: getStatusColor(agendamento.status),
                              },
                            ]}
                            onPress={() => agendamento && handleAgendamentoPress(agendamento)}
                            disabled={!agendamento}
                          >
                            {agendamento && (
                              <View style={styles.agendamentoCard}>
                                <Text style={styles.agendamentoCliente} numberOfLines={1}>
                                  {agendamento.cliente?.nome || agendamento.cliente_nome || 'Cliente'}
                                </Text>
                                <Text style={styles.agendamentoTime} numberOfLines={1}>
                                  {agendamento.horario_inicio.split(':').slice(0, 2).join(':')}
                                </Text>
                                {agendamento.servicos && agendamento.servicos.length > 0 && (
                                  <Text style={styles.agendamentoServico} numberOfLines={1}>
                                    {agendamento.servicos[0].nome}
                                  </Text>
                                )}
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))
                )}
              </View>
            ))}
          </View>
        </ScrollView>
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
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  novoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  novoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewModeSelector: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 8,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  viewModeTextActive: {
    color: '#2563EB',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navButton: {
    padding: 8,
  },
  dateRange: {
    alignItems: 'center',
    flex: 1,
  },
  dateRangeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  todayText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  horizontalScroll: {
    flex: 1,
  },
  horizontalScrollContent: {
    minWidth: width,
  },
  verticalScroll: {
    flex: 1,
  },
  grid: {
    minWidth: width,
  },
  gridHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  headerCell: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  timeColumn: {
    width: 80,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  colaboradorColumn: {
    width: COLUMN_WIDTH,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  dayHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    padding: 8,
  },
  dayHeaderDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  dayHeaderDateToday: {
    color: '#2563EB',
  },
  dayCell: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dayCellToday: {
    backgroundColor: '#DBEAFE',
  },
  gridRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeCell: {
    fontSize: 12,
    color: '#6B7280',
    padding: 8,
    textAlign: 'center',
  },
  cell: {
    width: COLUMN_WIDTH,
    minHeight: TIME_SLOT_HEIGHT,
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
    padding: 4,
  },
  agendamentoCard: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  agendamentoCliente: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  agendamentoTime: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  agendamentoServico: {
    fontSize: 10,
    color: '#6B7280',
  },
  // Estilos para visualização mensal
  monthCell: {
    width: COLUMN_WIDTH,
    minHeight: 100,
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    padding: 4,
  },
  monthAgendamentosList: {
    gap: 4,
  },
  monthAgendamentoItem: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    marginBottom: 2,
  },
  monthAgendamentoTime: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  monthAgendamentoCliente: {
    fontSize: 11,
    color: '#374151',
  },
  monthAgendamentoMore: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
  emptyCell: {
    flex: 1,
    minHeight: 100,
  },
});
