import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';

interface CadastroOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
  route: string;
}

const cadastros: CadastroOption[] = [
  {
    id: 'clientes',
    title: 'Clientes',
    description: 'Gerencie sua base de clientes',
    icon: 'people',
    iconFamily: 'Ionicons',
    route: '/clientes-list',
  },
  {
    id: 'servicos',
    title: 'Serviços',
    description: 'Gerencie os serviços oferecidos',
    icon: 'content-cut',
    iconFamily: 'MaterialCommunityIcons',
    route: '/servicos-list',
  },
  {
    id: 'produtos',
    title: 'Produtos',
    description: 'Gerencie produtos e estoque',
    icon: 'cube',
    iconFamily: 'Ionicons',
    route: '/produtos-list',
  },
];

export default function CadastrosScreen() {
  const router = useRouter();

  const handlePress = (option: CadastroOption) => {
    // Por enquanto vamos só logar, depois implementamos as rotas
    console.log('Navegar para:', option.route);
    // router.push(option.route);
  };

  const renderIcon = (option: CadastroOption, color: string, size: number) => {
    if (option.iconFamily === 'Ionicons') {
      return <Ionicons name={option.icon as any} size={size} color={color} />;
    }
    return <MaterialCommunityIcons name={option.icon as any} size={size} color={color} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cadastros</Text>
        <Text style={styles.subtitle}>Selecione o que deseja gerenciar</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {cadastros.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.card}
            onPress={() => handlePress(option)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {renderIcon(option, Colors.primary[600], 32)}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.gray[400]} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.gray[600],
  },
});

