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
import { useServicosStore, useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';

export default function NovoServicoScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { createServico } = useServicosStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    preco_padrao: '',
    meta_diaria_qtd: '',
    percentual_comissao_executor: '50',
    percentual_comissao_assistente: '',
    percentual_comissao_indicacao: '',
  });

  const handleVoltar = () => {
    router.back();
  };

  const formatarMoeda = (valor: string) => {
    const numero = parseFloat(valor) || 0;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calcularComissao = (preco: string, percentual: string) => {
    const precoNum = parseFloat(preco) || 0;
    const percentualNum = parseFloat(percentual) || 0;
    const valor = precoNum * (percentualNum / 100);
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSalvar = async () => {
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

      await createServico(payload);

      showMessage({
        message: 'Sucesso!',
        description: 'Serviço cadastrado com sucesso',
        type: 'success',
      });
      
      router.back();
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao cadastrar serviço',
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
            <Text style={styles.headerTitle}>Novo Serviço</Text>
            <Text style={styles.headerSubtitle}>Cadastre um novo serviço do catálogo</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações do Serviço */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.sectionTitle}>Informações do Serviço</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Nome do Serviço <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Corte Masculino, Barba, Degradê"
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
                placeholder="0,00"
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
                placeholder="Ex: 10"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={formData.meta_diaria_qtd}
                onChangeText={(text) => setFormData({ ...formData, meta_diaria_qtd: text })}
                editable={!isLoading}
              />
              <Text style={styles.helpText}>
                A meta é usada para acompanhar desempenho no dashboard
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Comissões */}
        <Text style={styles.sectionTitleLarge}>Comissões</Text>

        {/* Comissão Principal */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.comissaoTitulo}>Comissão Principal</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Percentual de Comissão (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 50"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={formData.percentual_comissao_executor}
                onChangeText={(text) => setFormData({ ...formData, percentual_comissao_executor: text.replace(',', '.') })}
                editable={!isLoading}
              />
            </View>
            {formData.preco_padrao && formData.percentual_comissao_executor && (
              <View style={[styles.previewCard, styles.previewPrincipal]}>
                <Text style={styles.previewLabel}>Comissão por serviço</Text>
                <Text style={styles.previewValue}>
                  {calcularComissao(formData.preco_padrao, formData.percentual_comissao_executor)}
                </Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Comissão Assistente */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.comissaoTitulo}>Comissão Assistente (Opcional)</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Percentual para Assistente (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 10"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={formData.percentual_comissao_assistente}
                onChangeText={(text) => setFormData({ ...formData, percentual_comissao_assistente: text.replace(',', '.') })}
                editable={!isLoading}
              />
            </View>
            {formData.preco_padrao && formData.percentual_comissao_assistente && (
              <View style={[styles.previewCard, styles.previewAssistente]}>
                <Text style={styles.previewLabel}>Comissão assistente</Text>
                <Text style={styles.previewValue}>
                  {calcularComissao(formData.preco_padrao, formData.percentual_comissao_assistente)}
                </Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Comissão Indicador */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.comissaoTitulo}>Comissão Indicador (Opcional)</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Percentual para Indicador (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 5"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={formData.percentual_comissao_indicacao}
                onChangeText={(text) => setFormData({ ...formData, percentual_comissao_indicacao: text.replace(',', '.') })}
                editable={!isLoading}
              />
            </View>
            {formData.preco_padrao && formData.percentual_comissao_indicacao && (
              <View style={[styles.previewCard, styles.previewIndicacao]}>
                <Text style={styles.previewLabel}>Comissão indicador</Text>
                <Text style={styles.previewValue}>
                  {calcularComissao(formData.preco_padrao, formData.percentual_comissao_indicacao)}
                </Text>
              </View>
            )}
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
              <Text style={styles.saveButtonText}>Salvar Serviço</Text>
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
  sectionTitleLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  comissaoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
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
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  previewCard: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  previewPrincipal: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  previewAssistente: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  previewIndicacao: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  previewLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
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

