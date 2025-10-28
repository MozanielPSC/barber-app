import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { BarbeariasList } from '../components/barbearia';
import { Barbearia } from '../types';

export default function SelectBarbeariaScreen() {
  const handleBarbeariaSelect = (barbearia: Barbearia) => {
    // Navegar para a tela principal usando Expo Router
    // router.replace('/(tabs)');
    console.log('Barbearia selecionada:', barbearia.nome);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecionar Barbearia</Text>
        <Text style={styles.subtitle}>
          Escolha a barbearia que você deseja gerenciar
        </Text>
      </View>

      <View style={styles.content}>
        <BarbeariasList
          onBarbeariaSelect={handleBarbeariaSelect}
          showSelectButton={true}
          filterActive={true}
        />
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
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
});
