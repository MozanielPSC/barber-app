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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColaboradoresStore, useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';
import { Colaborador } from '@/types';

export default function ColaboradorDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { barbeariaAtual } = useBarbeariasStore();
  const { getColaborador, updateColaborador, deleteColaborador } = useColaboradoresStore();
  
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    funcao: '',
    ativo: true,
  });

  useEffect(() => {
    loadColaborador();
  }, [id, barbeariaAtual?.id]);

  const loadColaborador = async () => {
    if (!barbeariaAtual?.id || !id) return;

    setIsLoading(true);
    try {
      const data = await getColaborador(id, barbeariaAtual.id);
      setColaborador(data);
      setFormData({
        nome: data.nome,
        funcao: data.funcao,
        ativo: data.ativo,
      });
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao carregar colaborador',
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
    if (colaborador) {
      setFormData({
        nome: colaborador.nome,
        funcao: colaborador.funcao,
        ativo: colaborador.ativo,
      });
    }
    setIsEditing(false);
  };

  const handleSalvar = async () => {
    if (!colaborador || !barbeariaAtual?.id) return;

    if (!formData.nome.trim()) {
      showMessage({
        message: 'Erro',
        description: 'O nome é obrigatório',
        type: 'danger',
      });
      return;
    }

    if (!formData.funcao.trim()) {
      showMessage({
        message: 'Erro',
        description: 'A função é obrigatória',
        type: 'danger',
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateColaborador(colaborador.id, {
        nome: formData.nome.trim(),
        funcao: formData.funcao.trim(),
        ativo: formData.ativo,
        barbearia_id: barbeariaAtual.id,
      });
      
      await loadColaborador();
      
      showMessage({
        message: 'Sucesso!',
        description: 'Colaborador atualizado com sucesso',
        type: 'success',
      });
      setIsEditing(false);
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao atualizar colaborador',
        type: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExcluir = () => {
    if (!colaborador || !barbeariaAtual?.id) return;

    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteColaborador(colaborador.id, barbeariaAtual.id);
              showMessage({
                message: 'Sucesso!',
                description: 'Colaborador excluído com sucesso',
                type: 'success',
              });
              router.back();
            } catch (error: any) {
              showMessage({
                message: 'Erro',
                description: error.message || 'Erro ao excluir colaborador',
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
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!colaborador) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
          <Text style={styles.errorText}>Colaborador não encontrado</Text>
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
              {isEditing ? 'Editar Colaborador' : 'Detalhes do Colaborador'}
            </Text>
            <Text style={styles.headerSubtitle}>{colaborador.nome}</Text>
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
          <Card style={styles.card}>
            <CardContent>
              {/* Avatar e Info Principal */}
              <View style={styles.profileHeader}>
                <View style={styles.avatarLarge}>
                  <Text style={styles.avatarLargeText}>
                    {colaborador.nome.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.profileName}>{colaborador.nome}</Text>
                <Text style={styles.profileFuncao}>{colaborador.funcao}</Text>
                {colaborador.email && (
                  <View style={styles.emailContainer}>
                    <Ionicons name="mail-outline" size={16} color="#6B7280" />
                    <Text style={styles.profileEmail}>{colaborador.email}</Text>
                  </View>
                )}
                <View style={[styles.badge, colaborador.ativo ? styles.badgeActive : styles.badgeInactive]}>
                  <Text style={[styles.badgeText, colaborador.ativo ? styles.badgeTextActive : styles.badgeTextInactive]}>
                    {colaborador.ativo ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        ) : (
          /* Modo Edição */
          <Card style={styles.card}>
            <CardContent>
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Nome Completo <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: João Silva"
                  placeholderTextColor="#9CA3AF"
                  value={formData.nome}
                  onChangeText={(text) => setFormData({ ...formData, nome: text })}
                  editable={!isSaving}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Função <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Barbeiro, Recepcionista"
                  placeholderTextColor="#9CA3AF"
                  value={formData.funcao}
                  onChangeText={(text) => setFormData({ ...formData, funcao: text })}
                  editable={!isSaving}
                />
              </View>

              <View style={styles.switchGroup}>
                <View style={styles.switchInfo}>
                  <Text style={styles.label}>Status</Text>
                  <Text style={styles.switchDescription}>
                    {formData.ativo ? 'Colaborador ativo' : 'Colaborador inativo'}
                  </Text>
                </View>
                <Switch
                  value={formData.ativo}
                  onValueChange={(value) => setFormData({ ...formData, ativo: value })}
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={formData.ativo ? '#2563EB' : '#F3F4F6'}
                  disabled={isSaving}
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLargeText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  profileFuncao: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeActive: {
    backgroundColor: '#D1FAE5',
  },
  badgeInactive: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: '#059669',
  },
  badgeTextInactive: {
    color: '#DC2626',
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
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
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

