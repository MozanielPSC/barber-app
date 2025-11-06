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
import { useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';

export default function BarbeariaDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { barbearias, barbeariaAtual, loadBarbearias, updateBarbearia, deleteBarbearia, setBarbeariaAtual, isLoading: storeLoading } = useBarbeariasStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
  });

  // Carrega barbearias se ainda não foram carregadas
  useEffect(() => {
    if (barbearias.length === 0 && !storeLoading) {
      loadBarbearias().catch((error) => {
        console.error('Erro ao carregar barbearias:', error);
        showMessage({
          message: 'Erro',
          description: 'Erro ao carregar barbearias',
          type: 'danger',
        });
      });
    }
  }, [barbearias.length, storeLoading, loadBarbearias]);

  const barbearia = barbearias.find((b) => b.id === id.toString());
  const isSelecionada = barbeariaAtual?.id === barbearia?.id;


  useEffect(() => {
    if (barbearia) {
      setFormData({
        nome: barbearia.nome || '',
        endereco: barbearia.endereco || '',
        telefone: barbearia.telefone || '',
        email: barbearia.email || '',
      });
    }
  }, [barbearia]);

  const handleVoltar = () => {
    router.back();
  };

  const handleEditar = () => {
    setIsEditing(true);
  };

  const handleCancelar = () => {
    if (barbearia) {
      setFormData({
        nome: barbearia.nome || '',
        endereco: barbearia.endereco || '',
        telefone: barbearia.telefone || '',
        email: barbearia.email || '',
      });
    }
    setIsEditing(false);
  };

  const handleSalvar = async () => {
    if (!barbearia) return;

    if (!formData.nome.trim()) {
      showMessage({
        message: 'Erro',
        description: 'O nome da barbearia é obrigatório',
        type: 'danger',
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateBarbearia(barbearia.id, formData);
      
      showMessage({
        message: 'Sucesso!',
        description: 'Barbearia atualizada com sucesso',
        type: 'success',
      });
      setIsEditing(false);
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao atualizar barbearia',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelecionar = async () => {
    if (!barbearia) return;

    try {
      await setBarbeariaAtual(barbearia);
      showMessage({
        message: 'Sucesso!',
        description: `${barbearia.nome} selecionada como barbearia ativa`,
        type: 'success',
      });
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao selecionar barbearia',
        type: 'danger',
      });
    }
  };

  const handleExcluir = () => {
    if (!barbearia) return;

    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta barbearia? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteBarbearia(barbearia.id);
              showMessage({
                message: 'Sucesso!',
                description: 'Barbearia excluída com sucesso',
                type: 'success',
              });
              router.back();
            } catch (error: any) {
              showMessage({
                message: 'Erro',
                description: error.message || 'Erro ao excluir barbearia',
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

  // Mostra loading enquanto carrega
  if (storeLoading || (barbearias.length === 0)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Se carregou mas não encontrou
  if (!barbearia) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
          <Text style={styles.errorText}>Barbearia não encontrada</Text>
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
              {isEditing ? 'Editar Barbearia' : 'Detalhes da Barbearia'}
            </Text>
            <Text style={styles.headerSubtitle}>{barbearia.nome}</Text>
          </View>
        </View>

        {!isEditing && (
          <View style={styles.headerActions}>
            {!isSelecionada && (
              <TouchableOpacity style={styles.selectButton} onPress={handleSelecionar}>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
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
        {/* Badge de Barbearia Selecionada */}
        {isSelecionada && !isEditing && (
          <View style={styles.selectedBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.selectedBannerText}>
              Esta é a barbearia ativa no sistema
            </Text>
          </View>
        )}

        {/* Modo Visualização */}
        {!isEditing ? (
          <Card style={styles.card}>
            <CardContent>
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>{barbearia.nome}</Text>
              </View>

              {barbearia.endereco && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Endereço</Text>
                  <Text style={styles.infoValue}>{barbearia.endereco}</Text>
                </View>
              )}

              {barbearia.telefone && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Telefone</Text>
                  <Text style={styles.infoValue}>{barbearia.telefone}</Text>
                </View>
              )}

              {barbearia.email && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>E-mail</Text>
                  <Text style={styles.infoValue}>{barbearia.email}</Text>
                </View>
              )}

              {barbearia.codigo && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Código</Text>
                  <Text style={styles.infoValue}>{barbearia.codigo}</Text>
                </View>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Modo Edição */
          <Card style={styles.card}>
            <CardContent>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome da Barbearia *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Barbearia Central"
                  placeholderTextColor="#9CA3AF"
                  value={formData.nome}
                  onChangeText={(text) => setFormData({ ...formData, nome: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Endereço</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                  placeholderTextColor="#9CA3AF"
                  value={formData.endereco}
                  onChangeText={(text) => setFormData({ ...formData, endereco: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: (11) 99999-9999"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={formData.telefone}
                  onChangeText={(text) => setFormData({ ...formData, telefone: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: contato@barbearia.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
              </View>
            </CardContent>
          </Card>
        )}
      </ScrollView>

      {/* Footer com Botões (só no modo edição) */}
      {isEditing && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelar}
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
  selectButton: {
    backgroundColor: '#10B981',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  selectedBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
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

