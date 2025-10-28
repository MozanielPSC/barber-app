import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { useClientesStore } from '../../stores';
import { Client } from '../../types';
import { Button } from '../ui';
import { ClientCard } from './ClientCard';

interface ClientsListProps {
  onClientPress?: (client: Client) => void;
  onClientEdit?: (client: Client) => void;
  onClientDelete?: (client: Client) => void;
  showActions?: boolean;
  showAddButton?: boolean;
  onAddClient?: () => void;
}

export const ClientsList: React.FC<ClientsListProps> = ({
  onClientPress,
  onClientEdit,
  onClientDelete,
  showActions = false,
  showAddButton = false,
  onAddClient,
}) => {
  const { clientes, isLoading, loadClientes } = useClientesStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadClientes();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadClientes();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredClients = clientes.filter(client =>
    client.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    client.telefone.includes(searchText) ||
    (client.email && client.email.toLowerCase().includes(searchText.toLowerCase()))
  );

  const renderClient = ({ item }: { item: Client }) => (
    <ClientCard
      client={item}
      onPress={onClientPress}
      onEdit={onClientEdit}
      onDelete={onClientDelete}
      showActions={showActions}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchText ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
      </Text>
      {showAddButton && (
        <Button
          title="Adicionar Cliente"
          onPress={onAddClient}
          style={styles.addButton}
        />
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar clientes..."
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#9CA3AF"
      />
      {showAddButton && (
        <Button
          title="+ Novo"
          onPress={onAddClient}
          size="small"
          style={styles.addButtonSmall}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredClients}
        renderItem={renderClient}
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
