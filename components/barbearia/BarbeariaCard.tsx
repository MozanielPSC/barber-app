import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Barbearia } from '../../types';
import { Badge, Card, CardContent, CardHeader } from '../ui';

interface BarbeariaCardProps {
  barbearia: Barbearia;
  onPress?: (barbearia: Barbearia) => void;
  onSelect?: (barbearia: Barbearia) => void;
  showSelectButton?: boolean;
}

export const BarbeariaCard: React.FC<BarbeariaCardProps> = ({
  barbearia,
  onPress,
  onSelect,
  showSelectButton = false,
}) => {
  const handlePress = () => {
    onPress?.(barbearia);
  };

  const handleSelect = () => {
    onSelect?.(barbearia);
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <CardHeader>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.nome}>{barbearia.nome}</Text>
              <Badge 
                variant={barbearia.ativa ? 'success' : 'error'}
                size="small"
              >
                {barbearia.ativa ? 'Ativa' : 'Inativa'}
              </Badge>
            </View>
            {barbearia.foto && (
              <Image source={{ uri: barbearia.foto }} style={styles.foto} />
            )}
          </View>
        </CardHeader>

        <CardContent>
          <View style={styles.info}>
            <Text style={styles.endereco}>{barbearia.endereco}</Text>
            <Text style={styles.telefone}>{barbearia.telefone}</Text>
            {barbearia.email && (
              <Text style={styles.email}>{barbearia.email}</Text>
            )}
          </View>

          <View style={styles.horario}>
            <Text style={styles.horarioLabel}>Horário de funcionamento:</Text>
            <Text style={styles.horarioText}>{barbearia.horario_funcionamento}</Text>
          </View>

          <View style={styles.dias}>
            <Text style={styles.diasLabel}>Dias de funcionamento:</Text>
            <View style={styles.diasList}>
              {barbearia.dias_funcionamento.map((dia, index) => (
                <Badge key={index} variant="info" size="small">
                  {dia}
                </Badge>
              ))}
            </View>
          </View>

          {showSelectButton && (
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={handleSelect}
              activeOpacity={0.7}
            >
              <Text style={styles.selectButtonText}>Selecionar</Text>
            </TouchableOpacity>
          )}
        </CardContent>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
    marginRight: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  foto: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  info: {
    marginBottom: 12,
  },
  endereco: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  telefone: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#374151',
  },
  horario: {
    marginBottom: 12,
  },
  horarioLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  horarioText: {
    fontSize: 14,
    color: '#374151',
  },
  dias: {
    marginBottom: 12,
  },
  diasLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  diasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
