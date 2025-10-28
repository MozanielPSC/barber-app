import { Client, Colaborador, Service } from './barbearia';
import { StatusAgendamento } from './enums';

export interface Agendamento {
  id: number;
  cliente_id: number;
  servico_id: number;
  colaborador_id: number;
  barbearia_id: number;
  data_hora: string;
  status: StatusAgendamento;
  observacoes?: string;
  cliente: Client;
  servico: Service;
  colaborador: Colaborador;
  created_at: string;
  updated_at: string;
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
