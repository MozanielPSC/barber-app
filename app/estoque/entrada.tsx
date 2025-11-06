import React, { useEffect, useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { useEstoqueStore, useBarbeariasStore, useProdutosStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';

export default function EntradaEstoqueScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { produtos, loadProdutos } = useProdutosStore();
  const { prateleiras, registrarEntrada, listarPrateleiras } = useEstoqueStore();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    produto_id: '',
    prateleira_id: '',
    quantidade: '',
    motivo: '',
    observacoes: '',
  });

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadData();
    }
  }, [barbeariaAtual?.id]);

  const loadData = async () => {
    if (!barbeariaAtual?.id) return;

    try {
      await Promise.all([
        produtos.length === 0 ? loadProdutos(barbeariaAtual.id) : Promise.resolve(),
        listarPrateleiras(barbeariaAtual.id, { ativa: true }),
      ]);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleVoltar = () => {
    router.back();
  };

  const handleRegistrar = async () => {
    // Validações
    if (!formData.produto_id) {
      showMessage({
        message: 'Erro',
        description: 'Selecione um produto',
        type: 'danger',
      });
      return;
    }

    if (!formData.prateleira_id) {
      showMessage({
        message: 'Erro',
        description: 'Selecione uma prateleira',
        type: 'danger',
      });
      return;
    }

    const quantidade = parseInt(formData.quantidade);
    if (!formData.quantidade || isNaN(quantidade) || quantidade <= 0) {
      showMessage({
        message: 'Erro',
        description: 'A quantidade deve ser maior que zero',
        type: 'danger',
      });
      return;
    }

    if (!formData.motivo.trim()) {
      showMessage({
        message: 'Erro',
        description: 'O motivo é obrigatório',
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
      const payload = {
        barbearia_id: barbeariaAtual.id,
        produto_id: formData.produto_id,
        prateleira_id: formData.prateleira_id,
        quantidade: parseInt(formData.quantidade),
        motivo: formData.motivo.trim(),
        observacoes: formData.observacoes.trim() || null,
      };

      await registrarEntrada(payload);

      showMessage({
        message: 'Sucesso!',
        description: 'Entrada registrada com sucesso',
        type: 'success',
      });

      router.back();
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao registrar entrada',
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
            <Text style={styles.headerTitle}>Entrada de Estoque</Text>
            <Text style={styles.headerSubtitle}>Registre a entrada de produtos no estoque</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <CardContent>
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Produto <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.produto_id}
                  onValueChange={(value) => setFormData({ ...formData, produto_id: value })}
                  enabled={!isLoading}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione um produto" value="" />
                  {produtos.map((produto) => (
                    <Picker.Item key={produto.id} label={produto.nome} value={produto.id} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Prateleira <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.prateleira_id}
                  onValueChange={(value) => setFormData({ ...formData, prateleira_id: value })}
                  enabled={!isLoading}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione uma prateleira" value="" />
                  {prateleiras
                    .filter((p) => p.ativa)
                    .map((prateleira) => (
                      <Picker.Item
                        key={prateleira.id}
                        label={`${prateleira.nome} - ${prateleira.localizacao}`}
                        value={prateleira.id}
                      />
                    ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Quantidade <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 10"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={formData.quantidade}
                onChangeText={(text) => setFormData({ ...formData, quantidade: text })}
                editable={!isLoading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Motivo <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Compra fornecedor"
                placeholderTextColor="#9CA3AF"
                value={formData.motivo}
                onChangeText={(text) => setFormData({ ...formData, motivo: text })}
                editable={!isLoading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Observações adicionais (opcional)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.observacoes}
                onChangeText={(text) => setFormData({ ...formData, observacoes: text })}
                editable={!isLoading}
              />
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
          onPress={handleRegistrar}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.saveButtonText}>Registrando...</Text>
            </>
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Registrar Entrada</Text>
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
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
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
  textarea: {
    minHeight: 100,
    paddingTop: 12,
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

