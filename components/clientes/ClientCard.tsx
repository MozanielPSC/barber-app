import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Client } from '../../types';
import { Badge, Card, CardContent, CardHeader } from '../ui';

interface ClientCardProps {
  client: Client;
  onPress?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  showActions?: boolean;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const handlePress = () => {
    onPress?.(client);
  };

  const handleEdit = () => {
    onEdit?.(client);
  };

  const handleDelete = () => {
    onDelete?.(client);
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <CardHeader>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.nome}>{client.nome}</Text>
              <Badge variant="info" size="small">
                Cliente
              </Badge>
            </View>
          </View>
        </CardHeader>

        <CardContent>
          <View style={styles.info}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Telefone:</Text>
              <Text style={styles.value}>{formatPhone(client.telefone)}</Text>
            </View>

            {client.email && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{client.email}</Text>
              </View>
            )}

            {client.data_nascimento && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Data de nascimento:</Text>
                <Text style={styles.value}>{formatDate(client.data_nascimento)}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.label}>Cadastrado em:</Text>
              <Text style={styles.value}>{formatDate(client.created_at)}</Text>
            </View>

            {client.observacoes && (
              <View style={styles.observacoes}>
                <Text style={styles.label}>Observações:</Text>
                <Text style={styles.observacoesText}>{client.observacoes}</Text>
              </View>
            )}
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    width: 120,
  },
  value: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  observacoes: {
    marginTop: 8,
  },
  observacoesText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    marginTop: 4,
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
