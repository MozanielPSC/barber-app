import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEstoqueStore, useBarbeariasStore, useProdutosStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';

type TabType = 'estoque' | 'prateleiras' | 'alertas';

export default function EstoqueScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { produtos, loadProdutos } = useProdutosStore();
  const {
    estoque,
    prateleiras,
    produtosEstoqueBaixo,
    isLoading,
    carregarEstoqueAtual,
    carregarProdutosEstoqueBaixo,
    listarPrateleiras,
    totalProdutosEstoque,
    valorTotalEstoque,
    prateleirasAtivas,
  } = useEstoqueStore();

  const [activeTab, setActiveTab] = useState<TabType>('estoque');

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadData();
    }
  }, [barbeariaAtual?.id]);

  const loadData = async () => {
    if (!barbeariaAtual?.id) return;

    try {
      await Promise.all([
        carregarEstoqueAtual(barbeariaAtual.id),
        carregarProdutosEstoqueBaixo(barbeariaAtual.id),
        listarPrateleiras(barbeariaAtual.id),
        produtos.length === 0 ? loadProdutos(barbeariaAtual.id) : Promise.resolve(),
      ]);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      showMessage({
        message: 'Erro',
        description: 'Erro ao carregar dados do estoque',
        type: 'danger',
      });
    }
  };

  const handleMovimentacoes = () => {
    router.push('/estoque/movimentacoes');
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const renderEstoqueItem = ({ item }: { item: any }) => {
    const quantidadeDisponivel = item.quantidade_atual - item.quantidade_reservada;
    const alertaBaixo = quantidadeDisponivel < 10;

    return (
      <Card style={styles.card}>
        <CardContent>
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemNome}>{item.produto?.nome || 'Produto'}</Text>
              <Text style={styles.itemPrateleira}>
                📦 {item.prateleira?.nome || 'Sem prateleira'}
              </Text>
            </View>
            <View style={styles.itemQuantidade}>
              <Text style={[styles.quantidadeTexto, alertaBaixo && styles.alertaBaixo]}>
                {quantidadeDisponivel} unid.
              </Text>
              {item.quantidade_reservada > 0 && (
                <Text style={styles.reservadaTexto}>
                  ({item.quantidade_reservada} reserv.)
                </Text>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    );
  };

  const renderPrateleiraItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/estoque/prateleiras/${item.id}`)}
        activeOpacity={0.7}
      >
        <Card style={styles.card}>
          <CardContent>
            <View style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <View style={styles.prateleiraHeader}>
                  <Text style={styles.itemNome}>{item.nome}</Text>
                  <View style={[styles.badge, item.ativa ? styles.badgeAtiva : styles.badgeInativa]}>
                    <Text style={styles.badgeText}>
                      {item.ativa ? 'Ativa' : 'Inativa'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemPrateleira}>
                  📍 {item.localizacao}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderAlertaItem = ({ item }: { item: any }) => {
    const percentual = (item.estoque_atual / item.estoque_minimo) * 100;
    const isCritico = item.alerta === 'critico' || percentual < 50;

    return (
      <Card style={styles.card}>
        <CardContent>
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemNome}>{item.nome}</Text>
              <View style={styles.alertaInfo}>
                <Text style={styles.alertaTexto}>
                  Atual: <Text style={isCritico ? styles.critico : styles.baixo}>
                    {item.estoque_atual}
                  </Text> | Mínimo: {item.estoque_minimo}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.reporButton}
              onPress={() => router.push('/estoque/entrada')}
            >
              <Ionicons name="add-circle" size={24} color="#10B981" />
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>
    );
  };

  const totalProdutos = totalProdutosEstoque();
  const valorTotal = valorTotalEstoque();
  const alertasBaixo = produtosEstoqueBaixo.length;
  const totalPrateleiras = prateleirasAtivas().length;

  if (isLoading && estoque.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9333EA" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Controle de Estoque</Text>
          <Text style={styles.headerSubtitle}>Gerencie produtos, prateleiras e movimentações</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleMovimentacoes}>
            <Ionicons name="swap-horizontal" size={18} color="#FFFFFF" />
            <Text style={styles.headerBtnText}>Movimentações</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cards de Resumo */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.resumoContainer}>
        <Card style={styles.resumoCard}>
          <CardContent>
            <View style={[styles.resumoIconContainer, styles.resumoAzul]}>
              <Ionicons name="cube" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.resumoLabel}>Total Produtos</Text>
            <Text style={styles.resumoValor}>{totalProdutos}</Text>
          </CardContent>
        </Card>

        <Card style={styles.resumoCard}>
          <CardContent>
            <View style={[styles.resumoIconContainer, styles.resumoVerde]}>
              <Ionicons name="cash" size={24} color="#10B981" />
            </View>
            <Text style={styles.resumoLabel}>Valor Total</Text>
            <Text style={styles.resumoValor}>{formatarMoeda(valorTotal)}</Text>
          </CardContent>
        </Card>

        <Card style={styles.resumoCard}>
          <CardContent>
            <View style={[styles.resumoIconContainer, styles.resumoAmarelo]}>
              <Ionicons name="warning" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.resumoLabel}>Estoque Baixo</Text>
            <Text style={styles.resumoValor}>{alertasBaixo}</Text>
          </CardContent>
        </Card>

        <Card style={styles.resumoCard}>
          <CardContent>
            <View style={[styles.resumoIconContainer, styles.resumoRoxo]}>
              <Ionicons name="grid" size={24} color="#9333EA" />
            </View>
            <Text style={styles.resumoLabel}>Prateleiras</Text>
            <Text style={styles.resumoValor}>{totalPrateleiras}</Text>
          </CardContent>
        </Card>
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'estoque' && styles.tabActive]}
          onPress={() => setActiveTab('estoque')}
        >
          <Text style={[styles.tabText, activeTab === 'estoque' && styles.tabTextActive]}>
            Estoque Atual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'prateleiras' && styles.tabActive]}
          onPress={() => setActiveTab('prateleiras')}
        >
          <Text style={[styles.tabText, activeTab === 'prateleiras' && styles.tabTextActive]}>
            Prateleiras
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'alertas' && styles.tabActive]}
          onPress={() => setActiveTab('alertas')}
        >
          <Text style={[styles.tabText, activeTab === 'alertas' && styles.tabTextActive]}>
            Alertas ({alertasBaixo})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo das Tabs */}
      {activeTab === 'estoque' && (
        <FlatList
          data={estoque}
          renderItem={renderEstoqueItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Nenhum produto em estoque</Text>
              <Text style={styles.emptyText}>
                Registre a entrada de produtos para começar
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/estoque/entrada')}
              >
                <Text style={styles.emptyButtonText}>Registrar Entrada</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {activeTab === 'prateleiras' && (
        <FlatList
          data={prateleiras}
          renderItem={renderPrateleiraItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="grid-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Nenhuma prateleira cadastrada</Text>
              <Text style={styles.emptyText}>
                Crie prateleiras para organizar seu estoque
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/estoque/prateleiras/novo')}
              >
                <Text style={styles.emptyButtonText}>Nova Prateleira</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {activeTab === 'alertas' && (
        <FlatList
          data={produtosEstoqueBaixo}
          renderItem={renderAlertaItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text style={styles.emptyTitle}>Tudo certo!</Text>
              <Text style={styles.emptyText}>
                Nenhum produto com estoque baixo
              </Text>
            </View>
          }
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#9333EA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  headerBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resumoContainer: {
    padding: 16,
    paddingTop: 12,
  },
  resumoCard: {
    width: 140,
    marginRight: 12,
  },
  resumoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumoAzul: {
    backgroundColor: '#EFF6FF',
  },
  resumoVerde: {
    backgroundColor: '#ECFDF5',
  },
  resumoAmarelo: {
    backgroundColor: '#FEF3C7',
  },
  resumoRoxo: {
    backgroundColor: '#FAF5FF',
  },
  resumoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  resumoValor: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#9333EA',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#9333EA',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    marginBottom: 0,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  itemPrateleira: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  itemQuantidade: {
    alignItems: 'flex-end',
  },
  quantidadeTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  alertaBaixo: {
    color: '#DC2626',
  },
  reservadaTexto: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  prateleiraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeAtiva: {
    backgroundColor: '#DCFCE7',
  },
  badgeInativa: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  alertaInfo: {
    marginTop: 4,
  },
  alertaTexto: {
    fontSize: 14,
    color: '#6B7280',
  },
  baixo: {
    color: '#F59E0B',
    fontWeight: '700',
  },
  critico: {
    color: '#DC2626',
    fontWeight: '700',
  },
  reporButton: {
    padding: 8,
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

