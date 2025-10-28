import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ClientsList } from '../../components/clientes';
import { useClientesStore } from '../../stores';
import { Client } from '../../types';

export default function ClientesScreen() {
  const { loadClientes } = useClientesStore();

  useEffect(() => {
    loadClientes();
  }, []);

  const handleClientPress = (client: Client) => {
    // Navegar para detalhes do cliente
    console.log('Abrir detalhes do cliente:', client.id);
  };

  const handleClientEdit = (client: Client) => {
    // Navegar para editar cliente
    console.log('Editar cliente:', client.id);
  };

  const handleClientDelete = (client: Client) => {
    // Confirmar exclusão e excluir cliente
    console.log('Excluir cliente:', client.id);
  };

  const handleAddClient = () => {
    // Navegar para adicionar cliente
    console.log('Adicionar novo cliente');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clientes</Text>
        <Text style={styles.subtitle}>Gerencie sua base de clientes</Text>
      </View>

      <View style={styles.content}>
        <ClientsList
          onClientPress={handleClientPress}
          onClientEdit={handleClientEdit}
          onClientDelete={handleClientDelete}
          showActions={true}
          showAddButton={true}
          onAddClient={handleAddClient}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
});
