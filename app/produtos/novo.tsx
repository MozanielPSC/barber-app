import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useProdutosStore, useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';

export default function NovoProdutoScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { createProduto } = useProdutosStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    preco_padrao: '',
    meta_diaria_qtd: '',
    percentual_comissao: '',
    percentual_imposto: '',
    percentual_cartao: '',
  });

  const handleVoltar = () => {
    router.back();
  };

  const handleSalvar = async () => {
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

    if (!barbeariaAtual?.id) {
      showMessage({
        message: 'Erro',
        description: 'Nenhuma barbearia selecionada',
        type: 'danger',
      });
      return;
    }

    setIsLoading(true);
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

      await createProduto(payload);

      showMessage({
        message: 'Sucesso!',
        description: 'Produto cadastrado com sucesso',
        type: 'success',
      });
      
      router.back();
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao cadastrar produto',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleVoltar} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Novo Produto</Text>
            <Text style={styles.headerSubtitle}>Cadastre um novo produto do catálogo</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações do Produto */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.sectionTitle}>Informações do Produto</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Nome do Produto <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Pomada, Cera, Shampoo"
                placeholderTextColor="#9CA3AF"
                value={formData.nome}
                onChangeText={(text) => setFormData({ ...formData, nome: text })}
                editable={!isLoading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Preço Padrão (R$) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 25.50"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={formData.preco_padrao}
                onChangeText={(text) => setFormData({ ...formData, preco_padrao: text.replace(',', '.') })}
                editable={!isLoading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Meta Diária (quantidade)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={formData.meta_diaria_qtd}
                onChangeText={(text) => setFormData({ ...formData, meta_diaria_qtd: text })}
                editable={!isLoading}
              />
            </View>
          </CardContent>
        </Card>

        {/* Percentuais e Taxas */}
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
                editable={!isLoading}
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
                editable={!isLoading}
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
                editable={!isLoading}
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
              <Text style={styles.infoText}>
                Os percentuais de imposto e taxa de cartão ajudam a calcular o lucro líquido real do produto.
              </Text>
            </View>
          </CardContent>
        </Card>

        <Text style={styles.footerText}>* Campos obrigatórios</Text>
      </ScrollView>

      {/* Footer com Botões */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleVoltar}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSalvar}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.saveButtonText}>Salvando...</Text>
            </>
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Salvar Produto</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
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
  infoBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginTop: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 16,
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

