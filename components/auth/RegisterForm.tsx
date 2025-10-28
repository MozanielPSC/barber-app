import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../hooks';
import { RegisterForm } from '../../types';
import { Button, Card, CardContent, CardHeader, Input } from '../ui';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterFormComponent: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterForm>({
    nome: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (!formData.password_confirmation.trim()) {
      newErrors.password_confirmation = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await register(formData);
      onSuccess?.();
    } catch (error: any) {
      Alert.alert(
        'Erro no Cadastro',
        error.message || 'Ocorreu um erro ao criar a conta. Tente novamente.'
      );
    }
  };

  const updateField = (field: keyof RegisterForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <CardHeader>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Preencha os dados para criar sua conta
            </Text>
          </CardHeader>

          <CardContent>
            <Input
              label="Nome completo"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChangeText={(value) => updateField('nome', value)}
              error={errors.nome}
              autoCapitalize="words"
              autoComplete="name"
            />

            <Input
              label="Email"
              placeholder="seu@email.com"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Senha"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              error={errors.password}
              secureTextEntry
              autoComplete="password-new"
            />

            <Input
              label="Confirmar senha"
              placeholder="Digite a senha novamente"
              value={formData.password_confirmation}
              onChangeText={(value) => updateField('password_confirmation', value)}
              error={errors.password_confirmation}
              secureTextEntry
              autoComplete="password-new"
            />

            <Button
              title="Criar Conta"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitButton}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Já tem uma conta?{' '}
              </Text>
              <Button
                title="Fazer login"
                variant="outline"
                size="small"
                onPress={onSwitchToLogin}
              />
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
