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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Usaremos modais customizados para data e hora
import { useAgendamentosStore, useColaboradoresStore, useClientesStore, useServicosStore, useBarbeariasStore } from '../../stores';
import { Card, CardContent } from '../../components/ui';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface ServicoSelecionado {
  id: number;
  nome: string;
  preco: number;
}

export default function NovoAgendamentoScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { colaboradores, loadColaboradores } = useColaboradoresStore();
  const { clientes, loadClientes } = useClientesStore();
  const { servicos, loadServicos } = useServicosStore();
  const { createAgendamento, isLoading } = useAgendamentosStore();

  const [clienteId, setClienteId] = useState<number | null>(null);
  const [colaboradorId, setColaboradorId] = useState<number | null>(null);
  const [dataHora, setDataHora] = useState(new Date());
  const [servicosSelecionados, setServicosSelecionados] = useState<ServicoSelecionado[]>([]);
  const [observacoes, setObservacoes] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState({ hour: 9, minute: 0 });
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showColaboradorModal, setShowColaboradorModal] = useState(false);
  const [showServicosModal, setShowServicosModal] = useState(false);
  const [buscaCliente, setBuscaCliente] = useState('');

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadColaboradores({ barbearia_id: barbeariaAtual.id }).catch(() => {});
      loadClientes({ barbearia_id: barbeariaAtual.id }).catch(() => {});
      loadServicos({ barbearia_id: barbeariaAtual.id }).catch(() => {});
    }
  }, [barbeariaAtual]);

  const handleSubmit = async () => {
    if (!clienteId) {
      Alert.alert('Erro', 'Selecione um cliente');
      return;
    }
    if (!colaboradorId) {
      Alert.alert('Erro', 'Selecione um colaborador');
      return;
    }
    if (servicosSelecionados.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um serviço');
      return;
    }
    if (!barbeariaAtual?.id) {
      Alert.alert('Erro', 'Barbearia não selecionada');
      return;
    }

    try {
      const dataFormatada = dataHora.toISOString().split('T')[0];
      const horarioFormatado = dataHora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Para múltiplos serviços, cria um agendamento por serviço ou envia o primeiro
      // A API espera servico_id (singular), então vamos usar o primeiro serviço
      if (servicosSelecionados.length === 0) {
        Alert.alert('Erro', 'Selecione pelo menos um serviço');
        return;
      }

      await createAgendamento({
        cliente_id: clienteId,
        colaborador_id: colaboradorId,
        servico_id: servicosSelecionados[0].id, // API espera servico_id singular
        data: dataFormatada,
        horario_inicio: horarioFormatado,
        observacoes: observacoes || undefined,
        barbearia_id: barbeariaAtual.id,
      });
      Alert.alert('Sucesso', 'Agendamento criado com sucesso', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível criar o agendamento');
    }
  };

  const toggleServico = (servico: ServicoSelecionado) => {
    setServicosSelecionados((prev) => {
      const exists = prev.find((s) => s.id === servico.id);
      if (exists) {
        return prev.filter((s) => s.id !== servico.id);
      }
      return [...prev, servico];
    });
  };

  const clientesFiltrados = buscaCliente
    ? clientes.filter((c) =>
        c.nome.toLowerCase().includes(buscaCliente.toLowerCase())
      )
    : clientes;

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Novo Agendamento</Text>

        {/* Cliente */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.label}>Cliente *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowClienteModal(true)}
            >
              <Text style={[styles.selectText, !clienteId && styles.selectTextPlaceholder]}>
                {clienteId
                  ? clientes.find((c) => c.id === clienteId)?.nome || 'Selecione'
                  : 'Selecione o cliente'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Colaborador */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.label}>Colaborador *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowColaboradorModal(true)}
            >
              <Text style={[styles.selectText, !colaboradorId && styles.selectTextPlaceholder]}>
                {colaboradorId
                  ? colaboradores.find((c) => c.id === colaboradorId)?.nome || 'Selecione'
                  : 'Selecione o colaborador'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Data e Hora */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.label}>Data e Hora *</Text>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => {
                  setTempDate(dataHora);
                  setShowDateModal(true);
                }}
              >
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <Text style={styles.dateTimeText}>
                  {dataHora.toLocaleDateString('pt-BR')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => {
                  setTempTime({
                    hour: dataHora.getHours(),
                    minute: dataHora.getMinutes(),
                  });
                  setShowTimeModal(true);
                }}
              >
                <Ionicons name="time-outline" size={20} color="#6B7280" />
                <Text style={styles.dateTimeText}>
                  {dataHora.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* Serviços */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.label}>Serviços *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowServicosModal(true)}
            >
              <Text style={[styles.selectText, servicosSelecionados.length === 0 && styles.selectTextPlaceholder]}>
                {servicosSelecionados.length > 0
                  ? `${servicosSelecionados.length} serviço(s) selecionado(s)`
                  : 'Selecione os serviços'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
            {servicosSelecionados.length > 0 && (
              <View style={styles.servicosList}>
                {servicosSelecionados.map((servico) => (
                  <View key={servico.id} style={styles.servicoChip}>
                    <Text style={styles.servicoChipText}>{servico.nome}</Text>
                    <TouchableOpacity onPress={() => toggleServico(servico)}>
                      <Ionicons name="close-circle" size={18} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </Card>

        {/* Observações */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.label}>Observações</Text>
            <Input
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Observações sobre o agendamento (opcional)"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </CardContent>
        </Card>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title="Criar Agendamento"
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitButton}
            disabled={isLoading}
          />
          <Button
            title="Cancelar"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
            disabled={isLoading}
          />
        </View>
      </ScrollView>

      {/* Modal Data */}
      {showDateModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a Data</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {Array.from({ length: 30 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const isSelected = tempDate.toDateString() === date.toDateString();
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.modalItem, isSelected && styles.modalItemActive]}
                    onPress={() => {
                      const newDate = new Date(date);
                      newDate.setHours(dataHora.getHours(), dataHora.getMinutes());
                      setDataHora(newDate);
                      setTempDate(date);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        isSelected && styles.modalItemTextActive,
                      ]}
                    >
                      {date.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#2563EB" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.modalActions}>
              <Button
                title="Confirmar"
                onPress={() => setShowDateModal(false)}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      )}

      {/* Modal Hora */}
      {showTimeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Horário</Text>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.timePickerContainer}>
              <ScrollView style={styles.timePickerColumn}>
                {Array.from({ length: 24 }).map((_, hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timePickerItem,
                      tempTime.hour === hour && styles.timePickerItemActive,
                    ]}
                    onPress={() => setTempTime({ ...tempTime, hour })}
                  >
                    <Text
                      style={[
                        styles.timePickerText,
                        tempTime.hour === hour && styles.timePickerTextActive,
                      ]}
                    >
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.timePickerSeparator}>:</Text>
              <ScrollView style={styles.timePickerColumn}>
                {[0, 30].map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timePickerItem,
                      tempTime.minute === minute && styles.timePickerItemActive,
                    ]}
                    onPress={() => setTempTime({ ...tempTime, minute })}
                  >
                    <Text
                      style={[
                        styles.timePickerText,
                        tempTime.minute === minute && styles.timePickerTextActive,
                      ]}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.modalActions}>
              <Button
                title="Confirmar"
                onPress={() => {
                  const newDate = new Date(dataHora);
                  newDate.setHours(tempTime.hour, tempTime.minute);
                  setDataHora(newDate);
                  setShowTimeModal(false);
                }}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      )}

      {/* Modal Cliente */}
      {showClienteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Cliente</Text>
              <TouchableOpacity onPress={() => setShowClienteModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Input
              value={buscaCliente}
              onChangeText={setBuscaCliente}
              placeholder="Buscar cliente..."
              style={styles.searchInput}
            />
            <ScrollView style={styles.modalList}>
              {clientesFiltrados.map((cliente) => (
                <TouchableOpacity
                  key={cliente.id}
                  style={[
                    styles.modalItem,
                    clienteId === cliente.id && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    setClienteId(cliente.id);
                    setShowClienteModal(false);
                    setBuscaCliente('');
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      clienteId === cliente.id && styles.modalItemTextActive,
                    ]}
                  >
                    {cliente.nome}
                  </Text>
                  {clienteId === cliente.id && (
                    <Ionicons name="checkmark" size={20} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Modal Colaborador */}
      {showColaboradorModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Colaborador</Text>
              <TouchableOpacity onPress={() => setShowColaboradorModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {colaboradores.map((colab) => (
                <TouchableOpacity
                  key={colab.id}
                  style={[
                    styles.modalItem,
                    colaboradorId === colab.id && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    setColaboradorId(colab.id);
                    setShowColaboradorModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      colaboradorId === colab.id && styles.modalItemTextActive,
                    ]}
                  >
                    {colab.nome}
                  </Text>
                  {colaboradorId === colab.id && (
                    <Ionicons name="checkmark" size={20} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Modal Serviços */}
      {showServicosModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione os Serviços</Text>
              <TouchableOpacity onPress={() => setShowServicosModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {servicos.map((servico) => {
                const isSelected = servicosSelecionados.some((s) => s.id === servico.id);
                return (
                  <TouchableOpacity
                    key={servico.id}
                    style={[
                      styles.modalItem,
                      isSelected && styles.modalItemActive,
                    ]}
                    onPress={() => toggleServico(servico)}
                  >
                    <View style={styles.servicoModalItem}>
                      <Text
                        style={[
                          styles.modalItemText,
                          isSelected && styles.modalItemTextActive,
                        ]}
                      >
                        {servico.nome}
                      </Text>
                      <Text style={styles.servicoPreco}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(servico.preco)}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#2563EB" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  selectTextPlaceholder: {
    color: '#9CA3AF',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#111827',
  },
  servicosList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  servicoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  servicoChipText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actions: {
    marginTop: 8,
    gap: 12,
  },
  submitButton: {
    marginBottom: 0,
  },
  cancelButton: {
    marginBottom: 0,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  searchInput: {
    marginBottom: 16,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  modalItemActive: {
    backgroundColor: '#DBEAFE',
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  modalItemTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  servicoModalItem: {
    flex: 1,
  },
  servicoPreco: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  modalActions: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalButton: {
    marginBottom: 0,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  timePickerColumn: {
    maxHeight: 200,
    width: 80,
  },
  timePickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  timePickerItemActive: {
    backgroundColor: '#DBEAFE',
  },
  timePickerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
  },
  timePickerTextActive: {
    color: '#2563EB',
  },
  timePickerSeparator: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 8,
  },
});

