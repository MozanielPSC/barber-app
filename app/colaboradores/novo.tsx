import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColaboradoresStore, useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';
import { PermissoesColaborador } from '@/types';

const DEFAULT_PERMISSOES: PermissoesColaborador = {
  atendimentos: { pode_visualizar: true, pode_criar: true, pode_editar: true, pode_excluir: false },
  clientes: { pode_visualizar: true, pode_criar: true, pode_editar: true, pode_excluir: false },
  produtos: { pode_visualizar: true, pode_criar: false, pode_editar: false, pode_excluir: false },
  servicos: { pode_visualizar: true, pode_criar: false, pode_editar: false, pode_excluir: false },
  financeiro: { pode_visualizar: false, pode_editar: false },
  configuracoes: { pode_visualizar: false, pode_editar: false },
  pote: { pode_visualizar: false, pode_criar: false, pode_editar: false, pode_excluir: false },
};

export default function NovoColaboradorScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { createColaborador } = useColaboradoresStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showAccessSection, setShowAccessSection] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    funcao: '',
    email: '',
    senha: '',
  });
  const [permissoes, setPermissoes] = useState<PermissoesColaborador>(DEFAULT_PERMISSOES);

  const handleVoltar = () => {
    router.back();
  };

  const togglePermissao = (recurso: keyof PermissoesColaborador, campo: string) => {
    setPermissoes(prev => ({
      ...prev,
      [recurso]: {
        ...prev[recurso],
        [campo]: !prev[recurso][campo as keyof typeof prev[typeof recurso]],
      },
    }));
  };

  const handleSalvar = async () => {
    // Validações
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

    if (showAccessSection) {
      if (formData.email && !formData.senha) {
        showMessage({
          message: 'Erro',
          description: 'Se o email for preenchido, a senha é obrigatória',
          type: 'danger',
        });
        return;
      }

      if (formData.senha && formData.senha.length < 6) {
        showMessage({
          message: 'Erro',
          description: 'A senha deve ter no mínimo 6 caracteres',
          type: 'danger',
        });
        return;
      }
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
        funcao: formData.funcao.trim(),
        barbearia_id: barbeariaAtual.id,
      };

      if (showAccessSection && formData.email && formData.senha) {
        payload.email = formData.email.trim();
        payload.senha = formData.senha;
        payload.permissoes = permissoes;
      }

      await createColaborador(payload);

      showMessage({
        message: 'Sucesso!',
        description: 'Colaborador cadastrado com sucesso',
        type: 'success',
      });
      
      router.back();
    } catch (error: any) {
      showMessage({
        message: 'Erro',
        description: error.message || 'Erro ao cadastrar colaborador',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPermissaoCard = (
    recurso: keyof PermissoesColaborador,
    titulo: string,
    permissoesRecurso: any
  ) => {
    const campos = Object.keys(permissoesRecurso);

    return (
      <Card key={recurso} style={styles.permissaoCard}>
        <CardContent style={styles.permissaoCardContent}>
          <Text style={styles.permissaoTitulo}>{titulo}</Text>
          <View style={styles.permissaoGrid}>
            {campos.map((campo) => (
              <TouchableOpacity
                key={campo}
                style={styles.permissaoItem}
                onPress={() => togglePermissao(recurso, campo)}
              >
                <View style={[
                  styles.checkbox,
                  permissoesRecurso[campo] && styles.checkboxChecked
                ]}>
                  {permissoesRecurso[campo] && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.permissaoLabel}>
                  {campo.replace('pode_', '').replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </CardContent>
      </Card>
    );
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
            <Text style={styles.headerTitle}>Novo Colaborador</Text>
            <Text style={styles.headerSubtitle}>Cadastre um novo colaborador</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações Básicas */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
            
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
                editable={!isLoading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Função <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Barbeiro, Recepcionista, Gerente"
                placeholderTextColor="#9CA3AF"
                value={formData.funcao}
                onChangeText={(text) => setFormData({ ...formData, funcao: text })}
                editable={!isLoading}
              />
              <Text style={styles.helpText}>
                Sugestões: Barbeiro, Cabeleireiro, Manicure, Recepcionista, Gerente, Assistente
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Acesso ao Sistema */}
        <Card style={styles.card}>
          <CardContent>
            <View style={styles.toggleSection}>
              <View style={styles.toggleInfo}>
                <Text style={styles.sectionTitle}>Acesso ao Sistema</Text>
                <Text style={styles.sectionDescription}>
                  Permite que o colaborador acesse o sistema
                </Text>
              </View>
              <Switch
                value={showAccessSection}
                onValueChange={setShowAccessSection}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={showAccessSection ? '#2563EB' : '#F3F4F6'}
              />
            </View>

            {showAccessSection && (
              <View style={styles.accessFields}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="colaborador@exemplo.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Senha</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={formData.senha}
                    onChangeText={(text) => setFormData({ ...formData, senha: text })}
                    editable={!isLoading}
                  />
                </View>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Permissões */}
        {showAccessSection && formData.email && (
          <View style={styles.permissoesSection}>
            <Text style={styles.permissoesTitulo}>Permissões de Acesso</Text>
            {renderPermissaoCard('atendimentos', 'Atendimentos', permissoes.atendimentos)}
            {renderPermissaoCard('clientes', 'Clientes', permissoes.clientes)}
            {renderPermissaoCard('produtos', 'Produtos', permissoes.produtos)}
            {renderPermissaoCard('servicos', 'Serviços', permissoes.servicos)}
            {renderPermissaoCard('financeiro', 'Financeiro', permissoes.financeiro)}
            {renderPermissaoCard('configuracoes', 'Configurações', permissoes.configuracoes)}
            {renderPermissaoCard('pote', 'Pote', permissoes.pote)}
          </View>
        )}

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
              <Text style={styles.saveButtonText}>Salvar Colaborador</Text>
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
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
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
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  accessFields: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  permissoesSection: {
    gap: 12,
    marginBottom: 16,
  },
  permissoesTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  permissaoCard: {
    backgroundColor: '#F9FAFB',
    marginBottom: 0,
  },
  permissaoCardContent: {
    padding: 12,
  },
  permissaoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  permissaoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permissaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: '45%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  permissaoLabel: {
    fontSize: 13,
    color: '#374151',
    textTransform: 'capitalize',
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

