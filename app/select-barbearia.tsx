import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBarbeariasStore } from '../stores';
import { Card, CardContent } from '../components/ui';

export default function SelectBarbeariaScreen() {
  const router = useRouter();
  const { barbearias, barbeariaAtual, isLoading, loadBarbearias, setBarbeariaAtual } = useBarbeariasStore();
  const [selectedId, setSelectedId] = useState<number | null>(barbeariaAtual?.id || null);

  useEffect(() => {
    loadBarbearias();
  }, []);

  useEffect(() => {
    if (barbeariaAtual) {
      setSelectedId(barbeariaAtual.id);
    }
  }, [barbeariaAtual]);

  const handleSelect = async (barbeariaId: number) => {
    const barbearia = barbearias.find((b) => b.id === barbeariaId);
    if (barbearia) {
      await setBarbeariaAtual(barbearia);
      router.replace('/(tabs)');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Carregando barbearias...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecionar Barbearia</Text>
        <Text style={styles.subtitle}>
          Escolha a barbearia que você deseja gerenciar
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {barbearias.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="storefront-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Nenhuma barbearia encontrada</Text>
            <Text style={styles.emptyText}>
              Cadastre uma barbearia para começar
            </Text>
          </View>
        ) : (
          barbearias.map((barbearia) => (
            <Card key={barbearia.id} style={styles.card}>
              <CardContent>
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{barbearia.nome}</Text>
                    {barbearia.endereco && (
                      <Text style={styles.cardSubtitle}>{barbearia.endereco}</Text>
                    )}
                  </View>
                  {selectedId === barbearia.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    selectedId === barbearia.id && styles.selectButtonActive,
                  ]}
                  onPress={() => handleSelect(barbearia.id)}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      selectedId === barbearia.id && styles.selectButtonTextActive,
                    ]}
                  >
                    {selectedId === barbearia.id ? 'Selecionada' : 'Selecionar'}
                  </Text>
                </TouchableOpacity>
              </CardContent>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  selectButtonActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  selectButtonTextActive: {
    color: '#2563EB',
  },
});
