export interface ServicoAtendimento {
  servico_id: string;
  nome: string;
  preco: number;
  feito_por_mim?: boolean;
  colaborador_executor_id?: string | null;
  colaborador_assistente_id?: string | null;
  cliente_indicador_id?: string | null;
}

export interface ProdutoAtendimento {
  produto_id: string;
  nome: string;
  preco: number;
  quantidade: number;
  vendido_por_mim?: boolean;
  colaborador_vendedor_id?: string | null;
  prateleira_id?: string;
}

export interface Atendimento {
  id: string; // UUID
  barbearia_id: string;
  cliente_id: string;
  colaborador_id: string;
  data_atendimento: string; // YYYY-MM-DD
  horario_inicio?: string; // HH:MM
  horario_fim?: string; // HH:MM
  origem?: string;
  observacoes?: string | null;
  duracao_minutos?: number;
  compareceu: boolean;
  primeira_visita: boolean;
  colaborador?: {
    id: string;
    nome: string;
  };
  cliente?: {
    id: string;
    nome: string;
    telefone?: string;
  };
  servicos: ServicoAtendimento[];
  produtos: ProdutoAtendimento[];
  created_at?: string;
  updated_at?: string;
}

export interface AtendimentoInput {
  barbearia_id: string;
  cliente_id: string;
  colaborador_id: string;
  data: string; // YYYY-MM-DD
  horario_inicio?: string;
  horario_fim?: string;
  origem?: string;
  compareceu?: boolean;
  primeira_visita?: boolean;
  observacoes?: string | null;
  servicos: ServicoAtendimento[];
  produtos: ProdutoAtendimento[];
}

