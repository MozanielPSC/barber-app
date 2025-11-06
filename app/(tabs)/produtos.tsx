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
import { useProdutosStore, useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';

export default function ProdutosScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { produtos, isLoading, loadProdutos } = useProdutosStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadProdutos(barbeariaAtual.id).catch((error) => {
        console.error('Erro ao carregar produtos:', error);
        showMessage({
          message: 'Erro',
          description: 'Erro ao carregar produtos',
          type: 'danger',
        });
      });
    }
  }, [barbeariaAtual?.id]);

  const handleNovo = () => {
    router.push('/produtos/novo');
  };

  const handleProdutoPress = (produtoId: string) => {
    router.push(`/produtos/${produtoId}`);
  };

  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatarPreco = (preco: string) => {
    const valor = parseFloat(preco);
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarPercentual = (percentual?: number) => {
    if (!percentual) return '0%';
    return `${(percentual * 100).toFixed(0)}%`;
  };

  const renderProdutoCard = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => handleProdutoPress(item.id)}
        activeOpacity={0.7}
      >
        <Card style={styles.card}>
          <CardContent>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="bag" size={24} color="#FFFFFF" />
              </View>
              
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardPreco}>{formatarPreco(item.preco_padrao)}</Text>
                
                <View style={styles.infoContainer}>
                  {item.percentual_comissao !== undefined && (
                    <View style={styles.infoItem}>
                      <Ionicons name="cash-outline" size={12} color="#6B7280" />
                      <Text style={styles.infoText}>
                        Comissão: {formatarPercentual(item.percentual_comissao)}
                      </Text>
                    </View>
                  )}
                  
                  {item.percentual_imposto !== undefined && (
                    <View style={styles.infoItem}>
                      <Ionicons name="document-text-outline" size={12} color="#6B7280" />
                      <Text style={styles.infoText}>
                        Imposto: {formatarPercentual(item.percentual_imposto)}
                      </Text>
                    </View>
                  )}

                  {item.percentual_cartao !== undefined && (
                    <View style={styles.infoItem}>
                      <Ionicons name="card-outline" size={12} color="#6B7280" />
                      <Text style={styles.infoText}>
                        Taxa: {formatarPercentual(item.percentual_cartao)}
                      </Text>
                    </View>
                  )}
                </View>

                {item.meta_diaria_qtd && (
                  <View style={styles.metaContainer}>
                    <Ionicons name="flag-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>
                      Meta: {item.meta_diaria_qtd} por dia
                    </Text>
                  </View>
                )}
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading && produtos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9333EA" />
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
            placeholder="Buscar produtos..."
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
          <Text style={styles.newButtonText}>Novo Produto</Text>
        </TouchableOpacity>
      </View>

      {filteredProdutos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
          </Text>
          {!searchQuery && (
            <>
              <Text style={styles.emptyText}>
                Comece adicionando seu primeiro produto
              </Text>
              <TouchableOpacity style={styles.emptyButton} onPress={handleNovo}>
                <Text style={styles.emptyButtonText}>Adicionar Primeiro Produto</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProdutos}
          renderItem={renderProdutoCard}
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
    backgroundColor: '#9333EA',
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
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardPreco: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9333EA',
  },
  infoContainer: {
    flexDirection: 'column',
    gap: 4,
    marginTop: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaText: {
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
    backgroundColor: '#9333EA',
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
