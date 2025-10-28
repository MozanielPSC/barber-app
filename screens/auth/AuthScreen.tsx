import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { LoginFormComponent, RegisterFormComponent } from '../../components/auth';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSuccess = () => {
    // Navegar para a tela principal
    console.log('Login realizado com sucesso');
  };

  const handleRegisterSuccess = () => {
    // Navegar para a tela principal
    console.log('Registro realizado com sucesso');
  };

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isLogin ? (
          <LoginFormComponent
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={switchToRegister}
          />
        ) : (
          <RegisterFormComponent
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
});
