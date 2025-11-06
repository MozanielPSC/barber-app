import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '@/components/ui';

export default function MovimentacoesScreen() {
  const router = useRouter();

  const handleVoltar = () => {
    router.back();
  };

  const movimentacoes = [
    {
      id: 'entrada',
      title: 'Entrada',
      description: 'Registre a entrada de produtos no estoque',
      icon: 'arrow-down-circle',
      color: '#10B981',
      route: '/estoque/entrada',
    },
    {
      id: 'saida',
      title: 'Saída',
      description: 'Registre a saída de produtos do estoque',
      icon: 'arrow-up-circle',
      color: '#EF4444',
      route: '/estoque/saida',
    },
    {
      id: 'ajuste',
      title: 'Ajuste',
      description: 'Ajuste as quantidades após inventário físico',
      icon: 'build',
      color: '#F59E0B',
      route: '/estoque/ajuste',
    },
    {
      id: 'transferencia',
      title: 'Transferência',
      description: 'Transfira produtos entre prateleiras',
      icon: 'swap-horizontal',
      color: '#6366F1',
      route: '/estoque/transferencia',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleVoltar} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Movimentações de Estoque</Text>
            <Text style={styles.headerSubtitle}>Escolha o tipo de movimentação</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {movimentacoes.map((mov) => (
          <TouchableOpacity
            key={mov.id}
            onPress={() => router.push(mov.route as any)}
            activeOpacity={0.7}
          >
            <Card style={styles.card}>
              <CardContent>
                <View style={styles.movRow}>
                  <View style={[styles.iconContainer, { backgroundColor: mov.color + '20' }]}>
                    <Ionicons name={mov.icon as any} size={32} color={mov.color} />
                  </View>
                  <View style={styles.movInfo}>
                    <Text style={styles.movTitle}>{mov.title}</Text>
                    <Text style={styles.movDescription}>{mov.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  movRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movInfo: {
    flex: 1,
  },
  movTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  movDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});

