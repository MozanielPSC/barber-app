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

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = 120;
const TIME_SLOT_HEIGHT = 60;
const START_HOUR = 8;
const END_HOUR = 20;

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

// Função para formatar range da semana
const formatWeekRange = (weekStart: Date): string => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const startStr = weekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  const endStr = weekEnd.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
  
  return `${startStr} - ${endStr}`;
};

// Função para obter dia da semana
const getDayOfWeek = (date: Date): number => {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1; // Segunda = 0, Domingo = 6
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
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [refreshing, setRefreshing] = useState(false);
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadColaboradores({ barbearia_id: barbeariaAtual.id }).catch(() => {});
      loadWeekAgendamentos();
    }
  }, [barbeariaAtual, weekStart]);

  const loadWeekAgendamentos = async () => {
    if (!barbeariaAtual?.id) return;
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59);

    const dataInicio = weekStart.toISOString().split('T')[0];
    const dataFim = weekEnd.toISOString().split('T')[0];

    await loadAgendamentos({
      barbearia_id: barbeariaAtual.id,
      data_inicio: dataInicio,
      data_fim: dataFim,
    }).catch(() => {});
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWeekAgendamentos();
    setRefreshing(false);
  };

  const previousWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStart(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(weekStart);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStart(newDate);
  };

  const goToToday = () => {
    setWeekStart(getWeekStart(new Date()));
  };

  // Gera array de dias da semana
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Encontra agendamento para um horário e colaborador específicos
  const findAgendamento = (timeSlot: string, colaboradorId: number, dayIndex: number): Agendamento | null => {
    const day = weekDays[dayIndex];
    const [hour, minute] = timeSlot.split(':').map(Number);
    
    const dayString = day.toISOString().split('T')[0]; // YYYY-MM-DD

    return agendamentos.find((ag) => {
      // Compara data
      const sameDay = ag.data_atendimento === dayString;
      
      // Compara horário (formato pode ser "09:00:00" ou "09:00")
      const [agHour, agMinute] = ag.horario_inicio.split(':').map(Number);
      const sameTime = agHour === hour && agMinute === minute;
      
      // Compara colaborador
      const sameColab = ag.colaborador_id === colaboradorId.toString() || Number(ag.colaborador_id) === colaboradorId;
      
      return sameDay && sameTime && sameColab;
    }) || null;
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

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (isLoading && agendamentos.length === 0) {
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
          <Text style={styles.title}>Agenda Semanal</Text>
          <Text style={styles.subtitle}>Visualize e gerencie os agendamentos dos colaboradores</Text>
        </View>
        <TouchableOpacity style={styles.novoButton} onPress={handleNovoAgendamento}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.novoButtonText}>Novo Agendamento</Text>
        </TouchableOpacity>
      </View>

      {/* Navegação de Semana */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity onPress={previousWeek} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToToday} style={styles.weekRange}>
          <Text style={styles.weekRangeText}>{formatWeekRange(weekStart)}</Text>
          <Text style={styles.todayText}>Hoje</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextWeek} style={styles.navButton}>
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
              {colaboradores.map((colab) => (
                <View key={colab.id} style={[styles.colaboradorColumn, styles.headerCell]}>
                  <Text style={styles.headerText} numberOfLines={2}>
                    {colab.nome}
                  </Text>
                </View>
              ))}
            </View>

            {/* Linhas de dias da semana */}
            {weekDays.map((day, dayIndex) => (
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
                  {colaboradores.map((colab) => (
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

                {/* Linhas de horário para este dia */}
                {timeSlots.map((timeSlot) => (
                  <View key={`${dayIndex}-${timeSlot}`} style={styles.gridRow}>
                    <View style={styles.timeColumn}>
                      <Text style={styles.timeCell}>{timeSlot}</Text>
                    </View>
                    {colaboradores.map((colab) => {
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
                                  {agendamento.servicos.map((s) => s.nome).join(', ')}
                                </Text>
                              )}
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
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
  },
  headerContent: {
    marginBottom: 12,
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
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  novoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  weekNavigation: {
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
  weekRange: {
    alignItems: 'center',
  },
  weekRangeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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
    position: 'sticky',
    top: 0,
    zIndex: 10,
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
  },
  dayHeaderDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
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
});
