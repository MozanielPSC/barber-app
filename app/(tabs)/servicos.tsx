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
import { useServicosStore, useBarbeariasStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';

export default function ServicosScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { servicos, isLoading, loadServicos } = useServicosStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadServicos(barbeariaAtual.id).catch((error) => {
        console.error('Erro ao carregar serviços:', error);
        showMessage({
          message: 'Erro',
          description: 'Erro ao carregar serviços',
          type: 'danger',
        });
      });
    }
  }, [barbeariaAtual?.id]);

  const handleNovo = () => {
    router.push('/servicos/novo');
  };

  const handleServicoPress = (servicoId: string) => {
    router.push(`/servicos/${servicoId}`);
  };

  const filteredServicos = servicos.filter((servico) =>
    servico.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatarPreco = (preco: string) => {
    const valor = parseFloat(preco);
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarPercentual = (percentual?: number) => {
    if (!percentual) return '0%';
    return `${(percentual * 100).toFixed(0)}%`;
  };

  const calcularComissao = (preco: string, percentual?: number) => {
    if (!percentual) return 'R$ 0,00';
    const valor = parseFloat(preco) * percentual;
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const renderServicoCard = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => handleServicoPress(item.id)}
        activeOpacity={0.7}
      >
        <Card style={styles.card}>
          <CardContent>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="cut" size={24} color="#FFFFFF" />
              </View>
              
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardPreco}>{formatarPreco(item.preco_padrao)}</Text>
                
                <View style={styles.comissoesContainer}>
                  {item.percentual_comissao_executor !== undefined && (
                    <View style={styles.comissaoItem}>
                      <Text style={styles.comissaoLabel}>Principal:</Text>
                      <Text style={styles.comissaoValue}>
                        {formatarPercentual(item.percentual_comissao_executor)}
                      </Text>
                    </View>
                  )}
                  
                  {item.percentual_comissao_assistente && (
                    <View style={[styles.comissaoItem, styles.comissaoAssistente]}>
                      <Text style={styles.comissaoLabel}>Assist:</Text>
                      <Text style={styles.comissaoValue}>
                        {formatarPercentual(item.percentual_comissao_assistente)}
                      </Text>
                    </View>
                  )}
                  
                  {item.percentual_comissao_indicacao && (
                    <View style={[styles.comissaoItem, styles.comissaoIndicacao]}>
                      <Text style={styles.comissaoLabel}>Indic:</Text>
                      <Text style={styles.comissaoValue}>
                        {formatarPercentual(item.percentual_comissao_indicacao)}
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

  if (isLoading && servicos.length === 0) {
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
            placeholder="Buscar serviços..."
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
          <Text style={styles.newButtonText}>Novo Serviço</Text>
        </TouchableOpacity>
      </View>

      {filteredServicos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cut-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
          </Text>
          {!searchQuery && (
            <>
              <Text style={styles.emptyText}>
                Comece adicionando seu primeiro serviço
              </Text>
              <TouchableOpacity style={styles.emptyButton} onPress={handleNovo}>
                <Text style={styles.emptyButtonText}>Adicionar Primeiro Serviço</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredServicos}
          renderItem={renderServicoCard}
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
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
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
    color: '#2563EB',
  },
  comissoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  comissaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comissaoAssistente: {
    backgroundColor: '#DCFCE7',
  },
  comissaoIndicacao: {
    backgroundColor: '#F3E8FF',
  },
  comissaoLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  comissaoValue: {
    fontSize: 11,
    color: '#111827',
    fontWeight: '700',
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
