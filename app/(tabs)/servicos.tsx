import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ServicesList } from '../../components/servicos';
import { useServicosStore } from '../../stores';
import { Service } from '../../types';

export default function ServicosScreen() {
  const { loadServicos } = useServicosStore();

  useEffect(() => {
    loadServicos();
  }, []);

  const handleServicePress = (service: Service) => {
    // Navegar para detalhes do serviço
    console.log('Abrir detalhes do serviço:', service.id);
  };

  const handleServiceEdit = (service: Service) => {
    // Navegar para editar serviço
    console.log('Editar serviço:', service.id);
  };

  const handleServiceDelete = (service: Service) => {
    // Confirmar exclusão e excluir serviço
    console.log('Excluir serviço:', service.id);
  };

  const handleAddService = () => {
    // Navegar para adicionar serviço
    console.log('Adicionar novo serviço');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Serviços</Text>
        <Text style={styles.subtitle}>Gerencie os serviços oferecidos</Text>
      </View>

      <View style={styles.content}>
        <ServicesList
          onServicePress={handleServicePress}
          onServiceEdit={handleServiceEdit}
          onServiceDelete={handleServiceDelete}
          showActions={true}
          showAddButton={true}
          onAddService={handleAddService}
          filterActive={true}
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
