import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../hooks';
import { Button, Card, CardContent, CardHeader, Input } from '../ui';

interface LoginColaboradorFormProps {
  onSuccess?: () => void;
}

export const LoginColaboradorFormComponent: React.FC<LoginColaboradorFormProps> = ({
  onSuccess,
}) => {
  const { loginColaborador, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    codigo_barbearia: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.codigo_barbearia.trim()) {
      newErrors.codigo_barbearia = 'Código da barbearia é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await loginColaborador(formData.email, formData.senha, formData.codigo_barbearia);
      onSuccess?.();
    } catch (error: any) {
      Alert.alert(
        'Erro no Login',
        error.message || 'Ocorreu um erro ao fazer login. Verifique suas credenciais.'
      );
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
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
            <Text style={styles.title}>Login do Colaborador</Text>
            <Text style={styles.subtitle}>
              Entre com seu email e código da barbearia
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
              value={formData.senha}
              onChangeText={(value) => updateField('senha', value)}
              error={errors.senha}
              secureTextEntry
              autoComplete="password"
            />

            <Input
              label="Código da Barbearia"
              placeholder="Ex: BARB001"
              value={formData.codigo_barbearia}
              onChangeText={(value) => updateField('codigo_barbearia', value.toUpperCase())}
              error={errors.codigo_barbearia}
              autoCapitalize="characters"
            />

            <Button
              title="Entrar"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitButton}
            />
          </CardContent>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
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
    color: Colors.gray[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 8,
  },
});

