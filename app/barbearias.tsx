import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore, useBarbeariasStore } from '../stores';
import { Card, CardContent } from '../components/ui';

export default function BarbeariasScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { barbearias, barbeariaAtual, isLoading, loadBarbearias } = useBarbeariasStore();
  const [searchQuery, setSearchQuery] = useState('');
  const isOwner = user?.tipo === 'proprietario';

  useEffect(() => {
    loadBarbearias();
  }, []);

  const filteredBarbearias = barbearias.filter((barbearia) =>
    barbearia.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNovo = () => {
    router.push('/barbearias/novo');
  };

  const handleBarbeariaPress = (barbeariaId: number | string) => {
    router.push(`/barbearias/${barbeariaId}`);
  };

  const renderBarbeariaCard = ({ item }: { item: any }) => {
    const isSelected = barbeariaAtual?.id === item.id;

    return (
      <TouchableOpacity
        onPress={() => handleBarbeariaPress(item.id)}
        activeOpacity={0.7}
      >
        <Card style={[styles.card, isSelected && styles.cardSelected]}>
          <CardContent>
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  {isSelected && (
                    <View style={styles.badge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.badgeText}>Selecionada</Text>
                    </View>
                  )}
                </View>
                {item.endereco && (
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {item.endereco}
                  </Text>
                )}
                {item.telefone && (
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {item.telefone}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
          <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar barbearias..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        {isOwner && (
          <TouchableOpacity style={styles.newButton} onPress={handleNovo}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.newButtonText}>Nova Barbearia</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredBarbearias.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="storefront-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'Nenhuma barbearia encontrada' : 'Nenhuma barbearia cadastrada'}
          </Text>
          {!searchQuery && isOwner && (
            <>
              <Text style={styles.emptyText}>
                Cadastre uma barbearia para começar
              </Text>
              <TouchableOpacity style={styles.emptyButton} onPress={handleNovo}>
                <Text style={styles.emptyButtonText}>Cadastrar Primeira Barbearia</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredBarbearias}
          renderItem={renderBarbeariaCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#111827',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    marginBottom: 0,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

