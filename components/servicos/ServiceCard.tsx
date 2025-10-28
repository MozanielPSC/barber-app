import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Service } from '../../types';
import { Badge, Card, CardContent, CardHeader } from '../ui';

interface ServiceCardProps {
  service: Service;
  onPress?: (service: Service) => void;
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
  showActions?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const handlePress = () => {
    onPress?.(service);
  };

  const handleEdit = () => {
    onEdit?.(service);
  };

  const handleDelete = () => {
    onDelete?.(service);
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <CardHeader>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.nome}>{service.nome}</Text>
              <Badge 
                variant={service.ativo ? 'success' : 'error'}
                size="small"
              >
                {service.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </View>
          </View>
        </CardHeader>

        <CardContent>
          <View style={styles.info}>
            {service.descricao && (
              <View style={styles.descricao}>
                <Text style={styles.descricaoText}>{service.descricao}</Text>
              </View>
            )}

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Preço:</Text>
                <Text style={styles.detailValue}>{formatMoney(service.preco)}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duração:</Text>
                <Text style={styles.detailValue}>{formatDuration(service.duracao_minutos)}</Text>
              </View>
            </View>
          </View>

          {showActions && (
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleEdit}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  info: {
    marginBottom: 12,
  },
  descricao: {
    marginBottom: 12,
  },
  descricaoText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  details: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  editButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
