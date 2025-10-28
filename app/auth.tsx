import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LoginColaboradorFormComponent, LoginFormComponent, RegisterFormComponent } from '../components/auth';
import { Colors } from '../constants/theme';

type AuthMode = 'login-proprietario' | 'login-colaborador' | 'register';

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = React.useState<AuthMode>('login-proprietario');

  const handleLoginSuccess = () => {
    router.replace('/(tabs)');
  };

  const handleRegisterSuccess = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Barber App</Text>
        <Text style={styles.subtitle}>Sistema de Gestão de Barbearias</Text>
      </View>

      {mode !== 'register' && (
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login-proprietario' && styles.tabActive]}
            onPress={() => setMode('login-proprietario')}
          >
            <Text style={[styles.tabText, mode === 'login-proprietario' && styles.tabTextActive]}>
              Proprietário
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, mode === 'login-colaborador' && styles.tabActive]}
            onPress={() => setMode('login-colaborador')}
          >
            <Text style={[styles.tabText, mode === 'login-colaborador' && styles.tabTextActive]}>
              Colaborador
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {mode === 'login-proprietario' && (
          <LoginFormComponent
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setMode('register')}
          />
        )}

        {mode === 'login-colaborador' && (
          <LoginColaboradorFormComponent
            onSuccess={handleLoginSuccess}
          />
        )}

        {mode === 'register' && (
          <RegisterFormComponent
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setMode('login-proprietario')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: Colors.primary[600],
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primary[100],
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[500],
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.gray[600],
  },
  tabTextActive: {
    color: Colors.primary[700],
  },
  content: {
    flex: 1,
  },
});
