import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClientesStore, useBarbeariasStore } from '../../stores';
import { Card, CardContent } from '../../components/ui';
import { Cliente } from '../../types/clientes';

const ORIGENS = [
  'Walk-in',
  'Indicação',
  'Instagram',
  'Facebook',
  'Google',
  'Parceria',
  'Outro',
];

// Função para obter iniciais do nome
const getIniciais = (nome: string): string => {
  const partes = nome.trim().split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
  return nome.substring(0, 2).toUpperCase();
};

// Função para formatar data
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Nunca';
  try {
    // Tenta parsear a data
    const date = new Date(dateString);
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return 'Nunca';
    }
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Nunca';
  }
};

export default function ClienteDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { barbeariaAtual } = useBarbeariasStore();
  const { getCliente, loadClientes, updateCliente, isLoading } = useClientesStore();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [origem, setOrigem] = useState<string>('');
  const [quemIndicou, setQuemIndicou] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [showOrigemModal, setShowOrigemModal] = useState(false);

  useEffect(() => {
    loadClienteData();
  }, [id, barbeariaAtual]);

  const loadClienteData = async () => {
    if (!id || !barbeariaAtual?.id) return;

    setLoading(true);
    try {
      // Carrega todos os clientes e busca pelo ID
      await loadClientes({
        barbearia_id: barbeariaAtual.id,
      });
      const clienteEncontrado = getCliente(id);
      if (clienteEncontrado) {
        setCliente(clienteEncontrado);
        setNome(clienteEncontrado.nome);
        setTelefone(clienteEncontrado.telefone);
        setOrigem(clienteEncontrado.origem || '');
        setQuemIndicou(clienteEncontrado.quem_indicou || '');
        setObservacoes(clienteEncontrado.observacoes || '');
      } else {
        Alert.alert('Erro', 'Cliente não encontrado', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar o cliente', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !telefone.trim()) {
      Alert.alert('Erro', 'Nome e telefone são obrigatórios');
      return;
    }

    if (!barbeariaAtual?.id || !id) {
      Alert.alert('Erro', 'Dados inválidos');
      return;
    }

    try {
      await updateCliente(id, {
        nome: nome.trim(),
        telefone: telefone.trim(),
        origem: origem || undefined,
        quem_indicou: quemIndicou.trim() || null,
        observacoes: observacoes.trim() || null,
        barbearia_id: barbeariaAtual.id,
      });
      Alert.alert('Sucesso', 'Cliente atualizado com sucesso!', [
        { text: 'OK', onPress: () => setIsEditing(false) },
      ]);
      await loadClienteData();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível atualizar o cliente');
    }
  };

  const handleCancelar = () => {
    if (cliente) {
      setNome(cliente.nome);
      setTelefone(cliente.telefone);
      setOrigem(cliente.origem || '');
      setQuemIndicou(cliente.quem_indicou || '');
      setObservacoes(cliente.observacoes || '');
    }
    setIsEditing(false);
  };

  const handleVerHistorico = () => {
    router.push(`/clientes/${id}/historico`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Carregando cliente...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cliente) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cliente não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {isEditing ? 'Editar Cliente' : 'Detalhes do Cliente'}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {cliente.nome}
          </Text>
        </View>
        {!isEditing && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleVerHistorico}
            >
              <Ionicons name="time-outline" size={20} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil-outline" size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isEditing ? (
          /* Modo Edição */
          <Card style={styles.formCard}>
            <CardContent>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dados Básicos</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nome Completo *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o nome completo"
                    value={nome}
                    onChangeText={setNome}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Telefone *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Como nos Conheceu</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Origem</Text>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setShowOrigemModal(true)}
                  >
                    <Text style={[styles.selectText, !origem && styles.selectPlaceholder]}>
                      {origem || 'Selecione a origem'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {origem === 'Indicação' && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Quem Indicou?</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nome de quem indicou"
                      value={quemIndicou}
                      onChangeText={setQuemIndicou}
                      autoCapitalize="words"
                    />
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Observações</Text>
                <TextInput
                  style={styles.textarea}
                  placeholder="Observações sobre o cliente..."
                  value={observacoes}
                  onChangeText={setObservacoes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </CardContent>
          </Card>
        ) : (
          /* Modo Visualização */
          <>
            <Card style={styles.infoCard}>
              <CardContent>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getIniciais(cliente.nome)}</Text>
                  </View>
                  <Text style={styles.nome}>{cliente.nome}</Text>
                  <View style={styles.telefoneRow}>
                    <Ionicons name="call-outline" size={18} color="#6B7280" />
                    <Text style={styles.telefone}>{cliente.telefone}</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <Card style={styles.dataCard}>
              <CardContent>
                <View style={styles.dataGrid}>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>ORIGEM</Text>
                    <Text style={styles.dataValue}>{cliente.origem || 'Não informado'}</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>INDICADO POR</Text>
                    <Text style={styles.dataValue} numberOfLines={1}>
                      {cliente.quem_indicou || 'Não informado'}
                    </Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>ÚLTIMA VISITA</Text>
                    <Text style={styles.dataValue}>{formatDate(cliente.ultima_visita)}</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={styles.dataLabel}>TOTAL DE VISITAS</Text>
                    <Text style={styles.dataValue}>
                      {cliente.total_visitas || 0}
                    </Text>
                  </View>
                  {cliente.observacoes && (
                    <View style={[styles.dataItem, styles.dataItemFull]}>
                      <Text style={styles.dataLabel}>OBSERVAÇÕES</Text>
                      <Text style={styles.dataValueObservacoes}>{cliente.observacoes}</Text>
                    </View>
                  )}
                </View>
              </CardContent>
            </Card>
          </>
        )}

        {/* Botões de Ação */}
        {isEditing && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancelar}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, isLoading && styles.buttonDisabled]}
              onPress={handleSalvar}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal de Origem */}
      {showOrigemModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a Origem</Text>
              <TouchableOpacity onPress={() => setShowOrigemModal(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {ORIGENS.map((orig) => (
                <TouchableOpacity
                  key={orig}
                  style={styles.modalOption}
                  onPress={() => {
                    setOrigem(orig);
                    setShowOrigemModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{orig}</Text>
                  {origem === orig && (
                    <Ionicons name="checkmark" size={20} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  telefoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  telefone: {
    fontSize: 16,
    color: '#6B7280',
  },
  dataCard: {
    marginBottom: 16,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  dataItem: {
    width: '48%',
    marginBottom: 16,
  },
  dataItemFull: {
    width: '100%',
  },
  dataLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  dataValueObservacoes: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
    lineHeight: 20,
  },
  formCard: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  selectText: {
    fontSize: 16,
    color: '#111827',
  },
  selectPlaceholder: {
    color: '#9CA3AF',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    minHeight: 100,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#2563EB',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
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
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#111827',
  },
});
