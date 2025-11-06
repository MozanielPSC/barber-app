export interface MetricaFinanceira {
  valor: number;
  variacao_percentual?: number | null;
  margem_percentual?: number;
  percentual?: number;
}

export interface MetricasDashboard {
  faturamento_bruto: MetricaFinanceira;
  lucro_bruto: MetricaFinanceira;
  margem_contribuicao: MetricaFinanceira;
  ebitda: MetricaFinanceira;
  custos_deducoes: MetricaFinanceira;
  despesas_variaveis: MetricaFinanceira;
  despesas_fixas: MetricaFinanceira;
  despesas_nao_operacionais: MetricaFinanceira;
}

export interface HistoricoFaturamento {
  mes: string; // YYYY-MM
  mes_formatado: string; // "Jan 2024"
  valor: number;
  valor_sem_outras_receitas?: number;
}

export interface CategoriaFinanceira {
  nome: string;
  valor: number;
  percentual: number;
  percentual_acumulado: number;
}

export interface FaturamentoCategoria {
  categorias: CategoriaFinanceira[];
  total: number;
}

export interface DespesasCategoria {
  categorias: CategoriaFinanceira[];
  total: number;
}

export interface DespesaFixa {
  categoria: string;
  valor: number;
}

export interface DespesaVariavel {
  categoria: string;
  valor: number;
}

export interface CanalMarketing {
  nome: string;
  gasto: number;
}

export interface GastoColaborador {
  id: string;
  colaborador_id: string;
  colaborador?: {
    id: string;
    nome: string;
  };
  descricao: string;
  valor_total: string | number;
  data_vencimento: string; // YYYY-MM-DD
  status: 'pendente' | 'pago' | 'atrasado';
  data_pagamento?: string | null;
  observacoes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GastoColaboradorInput {
  colaborador_id: string;
  descricao: string;
  valor_total: number;
  data_vencimento: string;
  observacoes?: string | null;
}

export interface TotaisGastos {
  pendente: number;
  pago: number;
  atrasado: number;
  geral: number;
}
