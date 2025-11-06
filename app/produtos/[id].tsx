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
import { useProdutosStore, useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';
import { Product } from '@/types';

export default function ProdutoDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { barbeariaAtual } = useBarbeariasStore();
  const { produtos, getProduto, loadProdutos, updateProduto, deleteProduto } = useProdutosStore();
  
  const [produto, setProduto] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    preco_padrao: '',
    meta_diaria_qtd: '',
    percentual_comissao: '',
    percentual_imposto: '',
    percentual_cartao: '',
  });

  useEffect(() => {
    loadProduto();
  }, [id, barbeariaAtual?.id]);

  const loadProduto = async () => {
    if (!barbeariaAtual?.id || !id) return;

    setIsLoading(true);
    try {
      // Se os produtos ainda não foram carregados, carrega
      if (produtos.length === 0) {
        await loadProdutos(barbeariaAtual.id);
      }
      
      const data = getProduto(id);
      if (data) {
        setProduto(data);
        setFormData({
          nome: data.nome,
          preco_padrao: data.preco_padrao,
          meta_diaria_qtd: data.meta_diaria_qtd?.toString() || '',
          percentual_comissao: data.percentual_comissao ? (data.percentual_comissao * 100).toString() : '',
          percentual_imposto: data.percentual_imposto ? (data.percentual_imposto * 100).toString() : '',
          percentual_cartao: data.percentual_cartao ? (data.percentual_cartao * 100).toString() : '',
        });
      }
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao carregar produto',
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
    if (produto) {
      setFormData({
        nome: produto.nome,
        preco_padrao: produto.preco_padrao,
        meta_diaria_qtd: produto.meta_diaria_qtd?.toString() || '',
        percentual_comissao: produto.percentual_comissao ? (produto.percentual_comissao * 100).toString() : '',
        percentual_imposto: produto.percentual_imposto ? (produto.percentual_imposto * 100).toString() : '',
        percentual_cartao: produto.percentual_cartao ? (produto.percentual_cartao * 100).toString() : '',
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

  const calcularValor = (preco: string, percentual?: number) => {
    if (!percentual) return 'R$ 0,00';
    const valor = parseFloat(preco) * percentual;
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSalvar = async () => {
    if (!produto || !barbeariaAtual?.id) return;

    // Validações
    if (!formData.nome.trim()) {
      showMessage({
        message: 'Erro',
        description: 'O nome do produto é obrigatório',
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

      // Percentuais (converter de % para 0-1)
      if (formData.percentual_comissao) {
        payload.percentual_comissao = parseFloat(formData.percentual_comissao) / 100;
      }
      if (formData.percentual_imposto) {
        payload.percentual_imposto = parseFloat(formData.percentual_imposto) / 100;
      }
      if (formData.percentual_cartao) {
        payload.percentual_cartao = parseFloat(formData.percentual_cartao) / 100;
      }

      // Meta diária
      if (formData.meta_diaria_qtd) {
        payload.meta_diaria_qtd = parseInt(formData.meta_diaria_qtd);
      }

      await updateProduto(produto.id, payload);
      await loadProduto();
      
      showMessage({
        message: 'Sucesso!',
        description: 'Produto atualizado com sucesso',
        type: 'success',
      });
      setIsEditing(false);
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao atualizar produto',
        type: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExcluir = () => {
    if (!produto || !barbeariaAtual?.id) return;

    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteProduto(produto.id, barbeariaAtual.id);
              showMessage({
                message: 'Sucesso!',
                description: 'Produto excluído com sucesso',
                type: 'success',
              });
              router.back();
            } catch (error: any) {
              showMessage({
                message: 'Erro',
                description: error.message || 'Erro ao excluir produto',
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
          <ActivityIndicator size="large" color="#9333EA" />
          <Text style={styles.loadingText}>Carregando produto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!produto) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
          <Text style={styles.errorText}>Produto não encontrado</Text>
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
              {isEditing ? 'Editar Produto' : 'Detalhes do Produto'}
            </Text>
            <Text style={styles.headerSubtitle}>{produto.nome}</Text>
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
                <View style={styles.productHeader}>
                  <View style={styles.iconLarge}>
                    <Ionicons name="bag" size={40} color="#FFFFFF" />
                  </View>
                  <Text style={styles.productName}>{produto.nome}</Text>
                  <Text style={styles.productSubtitle}>Produto do Catálogo</Text>
                  <Text style={styles.productPreco}>{formatarMoeda(produto.preco_padrao)}</Text>
                </View>

                <View style={styles.infoGrid}>
                  {produto.percentual_comissao !== undefined && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Comissão</Text>
                      <Text style={styles.infoValue}>
                        {formatarPercentual(produto.percentual_comissao)}
                      </Text>
                      <Text style={styles.infoSubValue}>
                        {calcularValor(produto.preco_padrao, produto.percentual_comissao)}
                      </Text>
                    </View>
                  )}

                  {produto.meta_diaria_qtd && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Meta Diária</Text>
                      <Text style={styles.infoValue}>{produto.meta_diaria_qtd} unid.</Text>
                      <Text style={styles.infoSubValue}>
                        {formatarMoeda(parseFloat(produto.preco_padrao) * produto.meta_diaria_qtd)}
                      </Text>
                    </View>
                  )}

                  {produto.percentual_imposto !== undefined && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Imposto</Text>
                      <Text style={styles.infoValue}>
                        {formatarPercentual(produto.percentual_imposto)}
                      </Text>
                      <Text style={styles.infoSubValue}>
                        {calcularValor(produto.preco_padrao, produto.percentual_imposto)}
                      </Text>
                    </View>
                  )}

                  {produto.percentual_cartao !== undefined && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Taxa de Cartão</Text>
                      <Text style={styles.infoValue}>
                        {formatarPercentual(produto.percentual_cartao)}
                      </Text>
                      <Text style={styles.infoSubValue}>
                        {calcularValor(produto.preco_padrao, produto.percentual_cartao)}
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
                  <Ionicons name="bar-chart" size={24} color="#9333EA" />
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
                <Text style={styles.sectionTitle}>Informações do Produto</Text>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Nome do Produto <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Pomada"
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

            <Card style={styles.card}>
              <CardContent>
                <Text style={styles.sectionTitle}>Percentuais e Taxas</Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Comissão (%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 50"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    value={formData.percentual_comissao}
                    onChangeText={(text) => setFormData({ ...formData, percentual_comissao: text.replace(',', '.') })}
                    editable={!isSaving}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Imposto (%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 10"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    value={formData.percentual_imposto}
                    onChangeText={(text) => setFormData({ ...formData, percentual_imposto: text.replace(',', '.') })}
                    editable={!isSaving}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Taxa Cartão (%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    value={formData.percentual_cartao}
                    onChangeText={(text) => setFormData({ ...formData, percentual_cartao: text.replace(',', '.') })}
                    editable={!isSaving}
                  />
                </View>
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
    backgroundColor: '#9333EA',
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
    backgroundColor: '#9333EA',
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
  productHeader: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 24,
  },
  iconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  productPreco: {
    fontSize: 32,
    fontWeight: '700',
    color: '#9333EA',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FAF5FF',
    padding: 12,
    borderRadius: 8,
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
    backgroundColor: '#FAF5FF',
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
    backgroundColor: '#9333EA',
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

