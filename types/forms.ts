// Interfaces de formulários
export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginColaboradorForm {
  email: string;
  password: string;
  barbearia_id: number;
}

export interface RegisterForm {
  nome: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ColaboradorForm {
  nome: string;
  email: string;
  telefone: string;
  barbearia_id: number;
  permissoes: number[];
}

export interface PermissoesForm {
  colaborador_id: number;
  permissoes: number[];
}

export interface CriarAgendamentoForm {
  cliente_id: number;
  servico_id: number;
  colaborador_id: number;
  data_hora: string;
  observacoes?: string;
}
