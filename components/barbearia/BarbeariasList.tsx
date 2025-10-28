import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useBarbeariasStore } from '../../stores';
import { Barbearia } from '../../types';
import { BarbeariaCard } from './BarbeariaCard';

interface BarbeariasListProps {
  onBarbeariaPress?: (barbearia: Barbearia) => void;
  onBarbeariaSelect?: (barbearia: Barbearia) => void;
  showSelectButton?: boolean;
  filterActive?: boolean;
}

export const BarbeariasList: React.FC<BarbeariasListProps> = ({
  onBarbeariaPress,
  onBarbeariaSelect,
  showSelectButton = false,
  filterActive = false,
}) => {
  const { barbearias, isLoading, loadBarbearias } = useBarbeariasStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBarbearias();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadBarbearias();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredBarbearias = filterActive 
    ? barbearias.filter(b => b.ativa)
    : barbearias;

  const renderBarbearia = ({ item }: { item: Barbearia }) => (
    <BarbeariaCard
      barbearia={item}
      onPress={onBarbeariaPress}
      onSelect={onBarbeariaSelect}
      showSelectButton={showSelectButton}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {filterActive ? 'Nenhuma barbearia ativa encontrada' : 'Nenhuma barbearia encontrada'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredBarbearias}
        renderItem={renderBarbearia}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
