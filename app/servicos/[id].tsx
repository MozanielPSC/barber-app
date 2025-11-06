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
import { useServicosStore, useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';
import { Service } from '@/types';

export default function ServicoDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { barbeariaAtual } = useBarbeariasStore();
  const { servicos, getServico, loadServicos, updateServico, deleteServico } = useServicosStore();
  
  const [servico, setServico] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    preco_padrao: '',
    meta_diaria_qtd: '',
    percentual_comissao_executor: '',
    percentual_comissao_assistente: '',
    percentual_comissao_indicacao: '',
  });

  useEffect(() => {
    loadServico();
  }, [id, barbeariaAtual?.id]);

  const loadServico = async () => {
    if (!barbeariaAtual?.id || !id) return;

    setIsLoading(true);
    try {
      // Se os serviços ainda não foram carregados, carrega
      if (servicos.length === 0) {
        await loadServicos(barbeariaAtual.id);
      }
      
      const data = getServico(id);
      if (data) {
        setServico(data);
        setFormData({
          nome: data.nome,
          preco_padrao: data.preco_padrao,
          meta_diaria_qtd: data.meta_diaria_qtd?.toString() || '',
          percentual_comissao_executor: data.percentual_comissao_executor ? (data.percentual_comissao_executor * 100).toString() : '',
          percentual_comissao_assistente: data.percentual_comissao_assistente ? (data.percentual_comissao_assistente * 100).toString() : '',
          percentual_comissao_indicacao: data.percentual_comissao_indicacao ? (data.percentual_comissao_indicacao * 100).toString() : '',
        });
      }
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao carregar serviço',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoltar = () => {
    router.back();
  };

  const handleEditar = () => {
    setIsEditing(true);
  };

  const handleCancelar = () => {
    if (servico) {
      setFormData({
        nome: servico.nome,
        preco_padrao: servico.preco_padrao,
        meta_diaria_qtd: servico.meta_diaria_qtd?.toString() || '',
        percentual_comissao_executor: servico.percentual_comissao_executor ? (servico.percentual_comissao_executor * 100).toString() : '',
        percentual_comissao_assistente: servico.percentual_comissao_assistente ? (servico.percentual_comissao_assistente * 100).toString() : '',
        percentual_comissao_indicacao: servico.percentual_comissao_indicacao ? (servico.percentual_comissao_indicacao * 100).toString() : '',
      });
    }
    setIsEditing(false);
  };

  const formatarMoeda = (valor: string | number) => {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarPercentual = (percentual?: number) => {
    if (!percentual) return '0%';
    return `${(percentual * 100).toFixed(0)}%`;
  };

  const calcularComissao = (preco: string, percentual?: number) => {
    if (!percentual) return 'R$ 0,00';
    const valor = parseFloat(preco) * percentual;
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSalvar = async () => {
    if (!servico || !barbeariaAtual?.id) return;

    // Validações
    if (!formData.nome.trim()) {
      showMessage({
        message: 'Erro',
        description: 'O nome do serviço é obrigatório',
        type: 'danger',
      });
      return;
    }

    const preco = parseFloat(formData.preco_padrao);
    if (!formData.preco_padrao || isNaN(preco) || preco <= 0) {
      showMessage({
        message: 'Erro',
        description: 'O preço padrão é obrigatório e deve ser maior que zero',
        type: 'danger',
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        nome: formData.nome.trim(),
        preco_padrao: parseFloat(formData.preco_padrao),
        barbearia_id: barbeariaAtual.id,
      };

      // Comissões (converter de % para 0-1)
      if (formData.percentual_comissao_executor) {
        payload.percentual_comissao_executor = parseFloat(formData.percentual_comissao_executor) / 100;
      }
      if (formData.percentual_comissao_assistente) {
        payload.percentual_comissao_assistente = parseFloat(formData.percentual_comissao_assistente) / 100;
      }
      if (formData.percentual_comissao_indicacao) {
        payload.percentual_comissao_indicacao = parseFloat(formData.percentual_comissao_indicacao) / 100;
      }

      // Meta diária
      if (formData.meta_diaria_qtd) {
        payload.meta_diaria_qtd = parseInt(formData.meta_diaria_qtd);
      }

      await updateServico(servico.id, payload);
      await loadServico();
      
      showMessage({
        message: 'Sucesso!',
        description: 'Serviço atualizado com sucesso',
        type: 'success',
      });
      setIsEditing(false);
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao atualizar serviço',
        type: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExcluir = () => {
    if (!servico || !barbeariaAtual?.id) return;

    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteServico(servico.id, barbeariaAtual.id);
              showMessage({
                message: 'Sucesso!',
                description: 'Serviço excluído com sucesso',
                type: 'success',
              });
              router.back();
            } catch (error: any) {
              showMessage({
                message: 'Erro',
                description: error.message || 'Erro ao excluir serviço',
                type: 'danger',
              });
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Carregando serviço...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!servico) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
          <Text style={styles.errorText}>Serviço não encontrado</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleVoltar} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Editar Serviço' : 'Detalhes do Serviço'}
            </Text>
            <Text style={styles.headerSubtitle}>{servico.nome}</Text>
          </View>
        </View>

        {!isEditing && (
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditar}>
              <Ionicons name="pencil" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleExcluir}>
              <Ionicons name="trash" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Modo Visualização */}
        {!isEditing ? (
          <>
            {/* Card Principal */}
            <Card style={styles.card}>
              <CardContent>
                <View style={styles.serviceHeader}>
                  <View style={styles.iconLarge}>
                    <Ionicons name="cut" size={40} color="#FFFFFF" />
                  </View>
                  <Text style={styles.serviceName}>{servico.nome}</Text>
                  <Text style={styles.serviceSubtitle}>Serviço do Catálogo</Text>
                  <Text style={styles.servicePreco}>{formatarMoeda(servico.preco_padrao)}</Text>
                </View>

                <View style={styles.infoGrid}>
                  {servico.percentual_comissao_executor !== undefined && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Comissão Principal</Text>
                      <Text style={styles.infoValue}>
                        {formatarPercentual(servico.percentual_comissao_executor)}
                      </Text>
                      <Text style={styles.infoSubValue}>
                        {calcularComissao(servico.preco_padrao, servico.percentual_comissao_executor)}
                      </Text>
                    </View>
                  )}

                  {servico.percentual_comissao_assistente && (
                    <View style={[styles.infoItem, styles.infoItemGreen]}>
                      <Text style={styles.infoLabel}>Comissão Assistente</Text>
                      <Text style={styles.infoValue}>
                        {formatarPercentual(servico.percentual_comissao_assistente)}
                      </Text>
                      <Text style={styles.infoSubValue}>
                        {calcularComissao(servico.preco_padrao, servico.percentual_comissao_assistente)}
                      </Text>
                    </View>
                  )}

                  {servico.percentual_comissao_indicacao && (
                    <View style={[styles.infoItem, styles.infoItemPurple]}>
                      <Text style={styles.infoLabel}>Comissão Indicador</Text>
                      <Text style={styles.infoValue}>
                        {formatarPercentual(servico.percentual_comissao_indicacao)}
                      </Text>
                      <Text style={styles.infoSubValue}>
                        {calcularComissao(servico.preco_padrao, servico.percentual_comissao_indicacao)}
                      </Text>
                    </View>
                  )}

                  {servico.meta_diaria_qtd && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Meta Diária</Text>
                      <Text style={styles.infoValue}>{servico.meta_diaria_qtd} unid.</Text>
                      <Text style={styles.infoSubValue}>
                        {formatarMoeda(parseFloat(servico.preco_padrao) * servico.meta_diaria_qtd)}
                      </Text>
                    </View>
                  )}
                </View>
              </CardContent>
            </Card>

            {/* Card de Estatísticas */}
            <Card style={styles.card}>
              <CardContent style={styles.statsCard}>
                <View style={styles.statsHeader}>
                  <Ionicons name="bar-chart" size={24} color="#3B82F6" />
                  <Text style={styles.statsTitle}>Estatísticas</Text>
                </View>
                <Text style={styles.statsText}>
                  As estatísticas de desempenho estarão disponíveis em breve
                </Text>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Modo Edição */
          <>
            <Card style={styles.card}>
              <CardContent>
                <Text style={styles.sectionTitle}>Informações do Serviço</Text>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Nome do Serviço <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Corte Masculino"
                    placeholderTextColor="#9CA3AF"
                    value={formData.nome}
                    onChangeText={(text) => setFormData({ ...formData, nome: text })}
                    editable={!isSaving}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Preço Padrão (R$) <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0,00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    value={formData.preco_padrao}
                    onChangeText={(text) => setFormData({ ...formData, preco_padrao: text.replace(',', '.') })}
                    editable={!isSaving}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Meta Diária (quantidade)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 10"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    value={formData.meta_diaria_qtd}
                    onChangeText={(text) => setFormData({ ...formData, meta_diaria_qtd: text })}
                    editable={!isSaving}
                  />
                </View>
              </CardContent>
            </Card>

            <Text style={styles.sectionTitleLarge}>Comissões</Text>

            <Card style={styles.card}>
              <CardContent>
                <Text style={styles.comissaoTitulo}>Comissão Principal (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 50"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={formData.percentual_comissao_executor}
                  onChangeText={(text) => setFormData({ ...formData, percentual_comissao_executor: text.replace(',', '.') })}
                  editable={!isSaving}
                />
              </CardContent>
            </Card>

            <Card style={styles.card}>
              <CardContent>
                <Text style={styles.comissaoTitulo}>Comissão Assistente (%) - Opcional</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 10"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={formData.percentual_comissao_assistente}
                  onChangeText={(text) => setFormData({ ...formData, percentual_comissao_assistente: text.replace(',', '.') })}
                  editable={!isSaving}
                />
              </CardContent>
            </Card>

            <Card style={styles.card}>
              <CardContent>
                <Text style={styles.comissaoTitulo}>Comissão Indicador (%) - Opcional</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 5"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={formData.percentual_comissao_indicacao}
                  onChangeText={(text) => setFormData({ ...formData, percentual_comissao_indicacao: text.replace(',', '.') })}
                  editable={!isSaving}
                />
              </CardContent>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Footer com Botões (só no modo edição) */}
      {isEditing && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelar}
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSalvar}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </>
            )}
          </TouchableOpacity>
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
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginTop: 12,
  },
  backButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#2563EB',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  serviceHeader: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 24,
  },
  iconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  servicePreco: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2563EB',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
  },
  infoItemGreen: {
    backgroundColor: '#DCFCE7',
  },
  infoItemPurple: {
    backgroundColor: '#F3E8FF',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  infoSubValue: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: '#EFF6FF',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitleLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  comissaoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#DC2626',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

