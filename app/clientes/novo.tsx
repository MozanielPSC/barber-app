import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useClientesStore, useBarbeariasStore } from '../../stores';
import { Card, CardContent } from '../../components/ui';

const ORIGENS = [
  'Walk-in',
  'Indicação',
  'Instagram',
  'Facebook',
  'Google',
  'Parceria',
  'Outro',
];

export default function NovoClienteScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { createCliente, createClienteAudio, isLoading } = useClientesStore();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [origem, setOrigem] = useState<string>('');
  const [quemIndicou, setQuemIndicou] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [showOrigemModal, setShowOrigemModal] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  const handleSalvar = async () => {
    if (!nome.trim() || !telefone.trim()) {
      Alert.alert('Erro', 'Nome e telefone são obrigatórios');
      return;
    }

    if (!barbeariaAtual?.id) {
      Alert.alert('Erro', 'Barbearia não selecionada');
      return;
    }

    try {
      await createCliente({
        nome: nome.trim(),
        telefone: telefone.trim(),
        origem: origem || undefined,
        quem_indicou: quemIndicou.trim() || null,
        observacoes: observacoes.trim() || null,
        barbearia_id: barbeariaAtual.id,
      });
      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível cadastrar o cliente');
    }
  };

  const handleCancelar = () => {
    router.back();
  };

  const handleSelecionarAudio = async () => {
    if (!barbeariaAtual?.id) {
      Alert.alert('Erro', 'Barbearia não selecionada');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setUploadingAudio(true);

      await createClienteAudio(file, barbeariaAtual.id);
      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso via áudio!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível processar o áudio');
    } finally {
      setUploadingAudio(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancelar} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Novo Cliente</Text>
          <Text style={styles.subtitle}>Cadastre um novo cliente manualmente</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Formulário */}
        <Card style={styles.formCard}>
          <CardContent>
            {/* Seção Dados Básicos */}
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

            {/* Seção Como nos Conheceu */}
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

            {/* Seção Observações */}
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

        {/* Separador */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>ou cadastre por áudio</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Cadastro por Áudio */}
        <Card style={styles.audioCard}>
          <CardContent>
            <View style={styles.audioContainer}>
              <View style={styles.audioIconContainer}>
                <Ionicons name="mic" size={32} color="#2563EB" />
              </View>
              <Text style={styles.audioTitle}>Cadastro por Áudio</Text>
              <Text style={styles.audioDescription}>
                Selecione um arquivo de áudio com as informações do cliente. Nossa IA processará
                automaticamente e extrairá os dados necessários.
              </Text>
              <TouchableOpacity
                style={[styles.audioButton, uploadingAudio && styles.buttonDisabled]}
                onPress={handleSelecionarAudio}
                disabled={uploadingAudio || isLoading}
              >
                <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                <Text style={styles.audioButtonText}>
                  {uploadingAudio ? 'Processando...' : 'Selecionar Áudio'}
                </Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancelar}
            disabled={isLoading || uploadingAudio}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, isLoading && styles.buttonDisabled]}
            onPress={handleSalvar}
            disabled={isLoading || uploadingAudio}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Salvando...' : 'Salvar Cliente'}
            </Text>
          </TouchableOpacity>
        </View>
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
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  audioCard: {
    marginBottom: 16,
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  audioContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  audioIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  audioDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  audioButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

