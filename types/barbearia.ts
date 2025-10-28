import { DiasSemana } from './enums';

export interface Barbearia {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email?: string;
  horario_funcionamento: string;
  dias_funcionamento: DiasSemana[];
  foto?: string;
  ativa: boolean;
  proprietario_id: number;
  created_at: string;
  updated_at: string;
}

export interface Colaborador {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  foto_perfil?: string;
  ativo: boolean;
  barbearia_id: number;
  permissoes: Permissao[];
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  data_nascimento?: string;
  observacoes?: string;
  barbearia_id: number;
  created_at: string;
  updated_at: string;
}
