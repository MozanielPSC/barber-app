import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClientesStore, useBarbeariasStore } from '../../stores';
import { Cliente } from '../../types/clientes';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 colunas com gap de 16px

// Função para obter iniciais do nome
const getIniciais = (nome: string): string => {
  const partes = nome.trim().split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
  return nome.substring(0, 2).toUpperCase();
};

// Função para formatar data
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Nunca';
  try {
    const date = new Date(dateString);
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return 'Nunca';
    }
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Nunca';
  }
};

export default function ClientesScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { clientes, isLoading, loadClientes } = useClientesStore();
  const [busca, setBusca] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadClientes({
        barbearia_id: barbeariaAtual.id,
        busca: busca || undefined,
      }).catch(() => {});
    }
  }, [barbeariaAtual, busca]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (barbeariaAtual?.id) {
      await loadClientes({
        barbearia_id: barbeariaAtual.id,
        busca: busca || undefined,
      }).catch(() => {});
    }
    setRefreshing(false);
  };

  const handleClientePress = (cliente: Cliente) => {
    router.push(`/clientes/${cliente.id}`);
  };

  const handleNovoCliente = () => {
    try {
      router.push('/clientes/novo');
    } catch (error) {
      console.error('Erro ao navegar para novo cliente:', error);
    }
  };

  const renderClienteCard = ({ item }: { item: Cliente }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleClientePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getIniciais(item.nome)}</Text>
      </View>
      <Text style={styles.nome} numberOfLines={1}>
        {item.nome}
      </Text>
      <View style={styles.telefoneRow}>
        <Ionicons name="call-outline" size={14} color="#6B7280" />
        <Text style={styles.telefone} numberOfLines={1}>
          {item.telefone}
        </Text>
      </View>
      {item.origem && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Origem:</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {item.origem}
          </Text>
        </View>
      )}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Cadastrado em:</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {formatDate(item.criado_em)}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Última visita:</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {formatDate(item.ultima_visita)}
        </Text>
      </View>
      {item.total_visitas !== undefined && item.total_visitas > 0 && (
        <View style={styles.visitasBadge}>
          <Text style={styles.visitasText}>
            {item.total_visitas} {item.total_visitas === 1 ? 'visita' : 'visitas'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading && (!clientes || clientes.length === 0)) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Carregando clientes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header com busca */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou telefone..."
            placeholderTextColor="#9CA3AF"
            value={busca}
            onChangeText={setBusca}
          />
        </View>
        <TouchableOpacity style={styles.novoButton} onPress={handleNovoCliente}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.novoButtonText}>Novo Cliente</Text>
        </TouchableOpacity>
      </View>

      {/* Grid de Cards */}
      {!clientes || clientes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>
            {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </Text>
          <Text style={styles.emptyText}>
            {busca
              ? 'Tente buscar com outros termos'
              : 'Comece adicionando seu primeiro cliente'}
          </Text>
          {!busca && (
            <TouchableOpacity style={styles.emptyButton} onPress={handleNovoCliente}>
              <Text style={styles.emptyButtonText}>Adicionar Primeiro Cliente</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={clientes || []}
          renderItem={renderClienteCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#2563EB']}
              tintColor="#2563EB"
            />
          }
        />
      )}
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
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  novoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  novoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    // Gradiente simulado com cores
    backgroundColor: '#6366F1',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  telefoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  telefone: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  visitasBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
  },
  visitasText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
