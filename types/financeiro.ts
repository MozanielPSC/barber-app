export interface FinanceItem {
  id: number;
  nome: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  data: string;
  observacoes?: string;
  barbearia_id: number;
  created_at: string;
  updated_at: string;
}

export interface Chair {
  id: number;
  nome: string;
  barbearia_id: number;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

export interface Channel {
  id: number;
  nome: string;
  barbearia_id: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinanceDefaults {
  barbearia_id: number;
  meta_diaria: number;
  meta_semanal: number;
  meta_mensal: number;
  created_at: string;
  updated_at: string;
}

export interface Finance {
  id: number;
  barbearia_id: number;
  data: string;
  receitas: number;
  despesas: number;
  lucro: number;
  meta_diaria: number;
  atingiu_meta: boolean;
  created_at: string;
  updated_at: string;
}

export interface GastoColaborador {
  id: number;
  colaborador_id: number;
  valor: number;
  descricao: string;
  data: string;
  tipo: 'fixo' | 'variavel' | 'parcelado';
  parcelas?: number;
  parcela_atual?: number;
  created_at: string;
  updated_at: string;
}
