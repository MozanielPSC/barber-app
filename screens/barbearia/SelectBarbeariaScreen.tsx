import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { BarbeariasList } from '../../components/barbearia';
import { Barbearia } from '../../types';

interface SelectBarbeariaScreenProps {
  onBarbeariaSelect: (barbearia: Barbearia) => void;
  onBack?: () => void;
}

export const SelectBarbeariaScreen: React.FC<SelectBarbeariaScreenProps> = ({
  onBarbeariaSelect,
  onBack,
}) => {
  const handleBarbeariaSelect = (barbearia: Barbearia) => {
    onBarbeariaSelect(barbearia);
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
};

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
