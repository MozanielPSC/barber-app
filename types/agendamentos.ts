import { Client, Colaborador, Service } from './barbearia';
import { StatusAgendamento } from './enums';

export interface ServicoAgendamento {
  id: string;
  servico_id?: string;
  nome: string;
  preco: number | string; // API retorna como string
}

export interface Agendamento {
  id: string;
  usuario_id?: string;
  barbearia_id: string;
  colaborador_id: string;
  cliente_id: string;
  data_atendimento: string;
  horario_inicio: string;
  horario_fim?: string;
  duracao_minutos?: number;
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu';
  origem?: 'agendamento' | 'atendimento';
  observacoes?: string | null;
  cliente: {
    id: string;
    nome: string;
    telefone?: string | null;
  };
  colaborador: {
    id: string;
    nome: string;
  };
  servicos: ServicoAgendamento[];
  // Campos opcionais para compatibilidade
  cliente_nome?: string;
  colaborador_nome?: string;
  data_hora?: string; // Para compatibilidade, combina data_atendimento + horario_inicio
}

export interface Visit {
  id: number;
  cliente_id: number;
  colaborador_id: number;
  barbearia_id: number;
  data_hora: string;
  observacoes?: string;
  cliente: Client;
  colaborador: Colaborador;
  created_at: string;
  updated_at: string;
}
