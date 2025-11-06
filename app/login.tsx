import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [pulseAnim1] = useState(new Animated.Value(1));
  const [pulseAnim2] = useState(new Animated.Value(1));

  React.useEffect(() => {
    // Animação pulse contínua para os círculos blur
    const pulse1 = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim1, {
          toValue: 1.2,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const pulse2 = Animated.loop(
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(pulseAnim2, {
          toValue: 1.2,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim2, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse1.start();
    pulse2.start();

    return () => {
      pulse1.stop();
      pulse2.stop();
    };
  }, []);

  const validateForm = (): boolean => {
    setError('');
    
    if (!email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido');
      return false;
    }
    
    if (!senha.trim()) {
      setError('Senha é obrigatória');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await login(email, senha);
      router.replace('/(tabs)');
    } catch (error: any) {
      setError(error.message || 'Credenciais inválidas');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background com gradiente */}
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.9)', 'rgba(88, 28, 135, 0.8)', 'rgba(15, 23, 42, 0.9)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Efeitos blur animados */}
      <Animated.View
        style={[
          styles.blurCircle1,
          {
            transform: [{ scale: pulseAnim1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.blurCircle2,
          {
            transform: [{ scale: pulseAnim2 }],
          },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Beet Gestão</Text>
            <Text style={styles.subtitle}>CRM + Financeiro</Text>
            <Text style={styles.description}>Gestão Profissional para Barbearias</Text>
          </View>

          {/* Card de Login */}
          <View style={styles.card}>
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#991B1B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Input Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                placeholder="seu@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus={false}
              />
            </View>

            {/* Input Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={senha}
                  onChangeText={(text) => {
                    setSenha(text);
                    setError('');
                  }}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão Entrar */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={isLoading ? ['#9CA3AF', '#6B7280'] : ['#9333EA', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Link para Registro */}
            <TouchableOpacity
              onPress={() => router.push('/registro')}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                Não tem conta? <Text style={styles.linkBold}>Registre-se aqui</Text>
              </Text>
            </TouchableOpacity>

            {/* Botão Login Colaborador */}
            <TouchableOpacity
              onPress={() => router.push('/login-colaborador')}
              activeOpacity={0.8}
              style={styles.buttonColaboradorContainer}
            >
              <LinearGradient
                colors={['#3B82F6', '#9333EA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonColaborador}
              >
                <Ionicons name="person" size={20} color="#FFFFFF" />
                <Text style={styles.buttonColaboradorText}>Login de Colaborador</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            © 2024 Beet Gestão • Todos os direitos reservados
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    minHeight: height,
  },
  blurCircle1: {
    position: 'absolute',
    top: -192,
    right: -192,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: '#9333EA',
    opacity: 0.2,
  },
  blurCircle2: {
    position: 'absolute',
    bottom: -192,
    left: -192,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: '#2563EB',
    opacity: 0.2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    zIndex: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E9D5FF',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: 'rgba(196, 181, 253, 0.8)',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 448,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  eyeIcon: {
    padding: 12,
  },
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E9D5FF',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#C084FC',
    fontSize: 14,
    fontWeight: '500',
  },
  linkContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  linkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkBold: {
    fontWeight: '600',
    color: '#9333EA',
  },
  buttonColaboradorContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonColaborador: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonColaboradorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    fontSize: 14,
    color: 'rgba(196, 181, 253, 0.6)',
    textAlign: 'center',
  },
});

