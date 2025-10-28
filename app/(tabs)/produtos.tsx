import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ProdutosScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Produtos</Text>
        <Text style={styles.subtitle}>Gestão de produtos e estoque</Text>
        <Text style={styles.placeholder}>
          Esta tela será implementada em breve
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
