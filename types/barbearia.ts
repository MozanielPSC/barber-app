import { DiasSemana } from './enums';

export interface Barbearia {
  id: string; // UUID
  nome: string;
  codigo?: string; // Código da barbearia (ex: BARBER)
  usuario_id?: string; // UUID do proprietário
  endereco?: string;
  telefone?: string;
  email?: string;
  horario_funcionamento?: string;
  dias_funcionamento?: DiasSemana[];
  foto?: string;
  criado_em?: string; // ISO 8601
  atualizado_em?: string; // ISO 8601
  // Campos antigos mantidos para compatibilidade
  proprietario_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PermissoesRecurso {
  pode_visualizar: boolean;
  pode_criar?: boolean;
  pode_editar?: boolean;
  pode_excluir?: boolean;
}

export interface PermissoesColaborador {
  atendimentos: PermissoesRecurso;
  clientes: PermissoesRecurso;
  produtos: PermissoesRecurso;
  servicos: PermissoesRecurso;
  financeiro: Omit<PermissoesRecurso, 'pode_criar' | 'pode_excluir'>;
  configuracoes: Omit<PermissoesRecurso, 'pode_criar' | 'pode_excluir'>;
  pote: PermissoesRecurso;
}

export interface Colaborador {
  id: string;
  nome: string;
  funcao: string;
  email?: string | null;
  barbearia_id: string;
  ativo: boolean;
  permissoes?: PermissoesColaborador;
  criado_em?: string;
  atualizado_em?: string;
  // Campos antigos para compatibilidade
  usuario_id?: string;
  telefone?: string;
  foto_perfil?: string;
  created_at?: string;
  updated_at?: string;
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
