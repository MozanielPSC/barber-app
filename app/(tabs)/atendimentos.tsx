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
import { useAtendimentosStore, useBarbeariasStore, useClientesStore } from '@/stores';
import { Card, CardContent } from '@/components/ui';
import { showMessage } from 'react-native-flash-message';
import { Atendimento } from '@/types';

type FiltroType = 'todos' | 'hoje' | 'semana' | 'mes' | 'compareceram' | 'faltaram';

export default function AtendimentosScreen() {
  const router = useRouter();
  const { barbeariaAtual } = useBarbeariasStore();
  const { clientes, loadClientes } = useClientesStore();
  const {
    atendimentos,
    isLoading,
    loadAtendimentos,
    atendimentosHoje,
    atendimentosEstaSemana,
    atendimentosEsteMes,
    atendimentosCompareceram,
    atendimentosFaltaram,
  } = useAtendimentosStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroType>('todos');

  useEffect(() => {
    if (barbeariaAtual?.id) {
      loadData();
    }
  }, [barbeariaAtual?.id]);

  const loadData = async () => {
    if (!barbeariaAtual?.id) return;

    try {
      await Promise.all([
        loadAtendimentos(barbeariaAtual.id),
        clientes.length === 0 ? loadClientes(barbeariaAtual.id) : Promise.resolve(),
      ]);
    } catch (error: any) {
      console.error('Erro ao carregar atendimentos:', error);
      showMessage({
        message: 'Erro',
        description: 'Erro ao carregar atendimentos',
        type: 'danger',
      });
    }
  };

  const handleNovo = () => {
    router.push('/atendimentos/novo');
  };

  const handleAtendimentoPress = (atendimentoId: string) => {
    router.push(`/atendimentos/${atendimentoId}`);
  };

  const getAtendimentosFiltrados = (): Atendimento[] => {
    let lista: Atendimento[] = [];

    switch (filtroAtivo) {
      case 'hoje':
        lista = atendimentosHoje();
        break;
      case 'semana':
        lista = atendimentosEstaSemana();
        break;
      case 'mes':
        lista = atendimentosEsteMes();
        break;
      case 'compareceram':
        lista = atendimentosCompareceram();
        break;
      case 'faltaram':
        lista = atendimentosFaltaram();
        break;
      default:
        lista = atendimentos;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      lista = lista.filter((atendimento) => {
        const cliente = clientes.find((c) => c.id === atendimento.cliente_id);
        return cliente?.nome.toLowerCase().includes(query);
      });
    }

    return lista.sort((a, b) => {
      return new Date(b.data_atendimento).getTime() - new Date(a.data_atendimento).getTime();
    });
  };

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calcularTotal = (atendimento: Atendimento) => {
    const totalServicos = atendimento.servicos.reduce((sum, s) => sum + s.preco, 0);
    const totalProdutos = atendimento.produtos.reduce((sum, p) => sum + p.preco * p.quantidade, 0);
    return totalServicos + totalProdutos;
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  const renderFiltro = (tipo: FiltroType, label: string) => {
    const isActive = filtroAtivo === tipo;
    return (
      <TouchableOpacity
        style={[styles.filtroButton, isActive && styles.filtroButtonActive]}
        onPress={() => setFiltroAtivo(tipo)}
      >
        <Text style={[styles.filtroText, isActive && styles.filtroTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderAtendimentoCard = ({ item }: { item: Atendimento }) => {
    const total = calcularTotal(item);
    const clienteNome = getClienteNome(item.cliente_id);

    return (
      <TouchableOpacity
        onPress={() => handleAtendimentoPress(item.id)}
        activeOpacity={0.7}
      >
        <Card style={styles.card}>
          <CardContent>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={24} color="#FFFFFF" />
              </View>
              
              <View style={styles.cardInfo}>
                <Text style={styles.clienteNome}>{clienteNome}</Text>
                <Text style={styles.dataText}>
                  {formatarData(item.data_atendimento)}
                  {item.horario_inicio && ` • ${item.horario_inicio}`}
                </Text>

                {/* Serviços */}
                {item.servicos.length > 0 && (
                  <View style={styles.itensContainer}>
                    {item.servicos.map((servico, index) => (
                      <View key={index} style={styles.servicoBadge}>
                        <Text style={styles.servicoBadgeText}>{servico.nome}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Produtos */}
                {item.produtos.length > 0 && (
                  <View style={styles.itensContainer}>
                    {item.produtos.map((produto, index) => (
                      <View key={index} style={styles.produtoBadge}>
                        <Text style={styles.produtoBadgeText}>
                          {produto.nome} ({produto.quantidade}x)
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.badges}>
                    <View style={[styles.statusBadge, item.compareceu ? styles.statusCompareceu : styles.statusFaltou]}>
                      <Text style={styles.statusBadgeText}>
                        {item.compareceu ? 'Compareceu' : 'Não compareceu'}
                      </Text>
                    </View>
                    {item.primeira_visita && (
                      <View style={styles.primeiraVisitaBadge}>
                        <Text style={styles.primeiraVisitaBadgeText}>1ª Visita</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.totalText}>{formatarMoeda(total)}</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  const atendimentosFiltrados = getAtendimentosFiltrados();

  if (isLoading && atendimentos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por cliente..."
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
          <Text style={styles.newButtonText}>Novo Atendimento</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <View style={styles.filtrosScrollContainer}>
          {renderFiltro('todos', 'Todos')}
          {renderFiltro('hoje', 'Hoje')}
          {renderFiltro('semana', 'Esta Semana')}
          {renderFiltro('mes', 'Este Mês')}
          {renderFiltro('compareceram', 'Compareceram')}
          {renderFiltro('faltaram', 'Faltaram')}
        </View>
      </View>

      {/* Lista */}
      {atendimentosFiltrados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'Nenhum atendimento encontrado' : 'Nenhum atendimento cadastrado'}
          </Text>
          {!searchQuery && (
            <>
              <Text style={styles.emptyText}>
                Comece registrando seu primeiro atendimento
              </Text>
              <TouchableOpacity style={styles.emptyButton} onPress={handleNovo}>
                <Text style={styles.emptyButtonText}>Adicionar Primeiro Atendimento</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={atendimentosFiltrados}
          renderItem={renderAtendimentoCard}
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
  filtrosContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  filtrosScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filtroButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filtroText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filtroTextActive: {
    color: '#FFFFFF',
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
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 6,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  dataText: {
    fontSize: 14,
    color: '#6B7280',
  },
  itensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  servicoBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  servicoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  produtoBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  produtoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompareceu: {
    backgroundColor: '#D1FAE5',
  },
  statusFaltou: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  primeiraVisitaBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primeiraVisitaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3730A3',
  },
  totalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
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

