import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColaboradoresStore, useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';

export default function ColaboradoresScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { colaboradores, isLoading, loadColaboradores } = useColaboradoresStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadColaboradores(barbeariaAtual.id).catch((error) => {
        console.error('Erro ao carregar colaboradores:', error);
        showMessage({
          message: 'Erro',
          description: 'Erro ao carregar colaboradores',
          type: 'danger',
        });
      });
    }
  }, [barbeariaAtual?.id]);

  const handleNovo = () => {
    router.push('/colaboradores/novo');
  };

  const handleColaboradorPress = (colaboradorId: string) => {
    router.push(`/colaboradores/${colaboradorId}`);
  };

  const filteredColaboradores = colaboradores.filter((colaborador) =>
    colaborador.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    colaborador.funcao?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderColaboradorCard = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => handleColaboradorPress(item.id)}
        activeOpacity={0.7}
      >
        <Card style={styles.card}>
          <CardContent>
            <View style={styles.cardHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.nome.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                {item.funcao && (
                  <Text style={styles.cardSubtitle}>{item.funcao}</Text>
                )}
                {item.email && (
                  <Text style={styles.cardEmail} numberOfLines={1}>
                    {item.email}
                  </Text>
                )}
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, item.ativo && styles.statusDotActive]} />
                  <Text style={styles.statusText}>
                    {item.ativo ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading && colaboradores.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar colaboradores..."
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
        
        <TouchableOpacity style={styles.newButton} onPress={handleNovo}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Novo Colaborador</Text>
        </TouchableOpacity>
      </View>

      {filteredColaboradores.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'Nenhum colaborador encontrado' : 'Nenhum colaborador cadastrado'}
          </Text>
          {!searchQuery && (
            <>
              <Text style={styles.emptyText}>
                Cadastre colaboradores para gerenciar a equipe
              </Text>
              <TouchableOpacity style={styles.emptyButton} onPress={handleNovo}>
                <Text style={styles.emptyButtonText}>Cadastrar Primeiro Colaborador</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredColaboradores}
          renderItem={renderColaboradorCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  cardEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  statusDotActive: {
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
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

