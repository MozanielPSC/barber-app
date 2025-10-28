import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { useServicosStore } from '../../stores';
import { Service } from '../../types';
import { Button } from '../ui';
import { ServiceCard } from './ServiceCard';

interface ServicesListProps {
  onServicePress?: (service: Service) => void;
  onServiceEdit?: (service: Service) => void;
  onServiceDelete?: (service: Service) => void;
  showActions?: boolean;
  showAddButton?: boolean;
  onAddService?: () => void;
  filterActive?: boolean;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  onServicePress,
  onServiceEdit,
  onServiceDelete,
  showActions = false,
  showAddButton = false,
  onAddService,
  filterActive = false,
}) => {
  const { servicos, isLoading, loadServicos } = useServicosStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadServicos();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadServicos();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredServices = servicos.filter(service =>
    service.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    (service.descricao && service.descricao.toLowerCase().includes(searchText.toLowerCase()))
  ).filter(service => filterActive ? service.ativo : true);

  const renderService = ({ item }: { item: Service }) => (
    <ServiceCard
      service={item}
      onPress={onServicePress}
      onEdit={onServiceEdit}
      onDelete={onServiceDelete}
      showActions={showActions}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchText ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
      </Text>
      {showAddButton && (
        <Button
          title="Adicionar Serviço"
          onPress={onAddService}
          style={styles.addButton}
        />
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar serviços..."
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#9CA3AF"
      />
      {showAddButton && (
        <Button
          title="+ Novo"
          onPress={onAddService}
          size="small"
          style={styles.addButtonSmall}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredServices}
        renderItem={renderService}
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
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addButtonSmall: {
    minWidth: 80,
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
    marginBottom: 20,
  },
  addButton: {
    minWidth: 200,
  },
});
