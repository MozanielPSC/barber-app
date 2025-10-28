import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../hooks';
import { LoginForm } from '../../types';
import { Button, Card, CardContent, CardHeader, Input } from '../ui';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginFormComponent: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      onSuccess?.();
    } catch (error: any) {
      Alert.alert(
        'Erro no Login',
        error.message || 'Ocorreu um erro ao fazer login. Tente novamente.'
      );
    }
  };

  const updateField = (field: keyof LoginForm, value: string) => {
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
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>
              Acesse sua conta para continuar
            </Text>
          </CardHeader>

          <CardContent>
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
              placeholder="Sua senha"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              error={errors.password}
              secureTextEntry
              autoComplete="password"
            />

            <Button
              title="Entrar"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitButton}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Não tem uma conta?{' '}
              </Text>
              <Button
                title="Criar conta"
                variant="outline"
                size="small"
                onPress={onSwitchToRegister}
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
