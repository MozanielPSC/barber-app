export type TipoPlano = 'ilimitado' | 'fichas_fixas' | 'valor_manual';
export type StatusAssinatura = 'ativa' | 'cancelada' | 'expirada';
export type PeriodicidadeDistribuicao = 'mensal' | 'semanal' | 'quinzenal';

export interface ConfiguracaoPote {
  id: string;
  nome: string;
  barbearia_id: string;
  percentual_casa: number; // 0-1 (ex: 0.3 = 30%)
  periodicidade_distribuicao: PeriodicidadeDistribuicao;
  valor_ficha_padrao?: number;
  tipo_plano: TipoPlano;
  ativo: boolean;
  criado_em?: string;
  atualizado_em?: string;
}

export interface PesoServico {
  id: string;
  configuracao_pote_id: string;
  servico_id: string;
  peso_em_fichas: number;
  servico?: {
    id: string;
    nome: string;
  };
}

export interface PlanoAssinatura {
  id: string;
  nome: string;
  barbearia_id: string;
  configuracao_pote_id: string;
  valor: number;
  duracao_meses: number;
  fichas_iniciais?: number;
  tipo_plano: TipoPlano;
  ativo: boolean;
  criado_em?: string;
  atualizado_em?: string;
  configuracao?: ConfiguracaoPote;
}

export interface Assinatura {
  id: string;
  cliente_id: string;
  cliente?: {
    id: string;
    nome: string;
    name?: string;
  };
  plano_id: string;
  plano?: {
    id: string;
    nome: string;
    valor: number;
    tipo_plano: TipoPlano;
  };
  valor_pago: number;
  data_inicio: string; // YYYY-MM-DD
  data_fim: string; // YYYY-MM-DD
  status: StatusAssinatura;
  fichas_iniciais?: number;
  fichas_consumidas?: number;
  tipo_plano: TipoPlano;
  created_at?: string;
  updated_at?: string;
}

export interface SaldoFichas {
  saldo_fichas: number;
  assinaturas_ativas: number;
}

export interface ConsumoAssinatura {
  id: string;
  assinatura_id: string;
  servico_id: string;
  servico?: {
    id: string;
    nome: string;
  };
  fichas_consumidas: number;
  data_consumo: string;
}

export interface Distribuicao {
  id: string;
  barbearia_id: string;
  periodo_referencia: string; // YYYY-MM
  data_distribuicao: string;
  valor_total_pote: number;
  valor_casa: number;
  valor_distribuido: number;
}

export interface ResumoDistribuicao {
  total_colaboradores: number;
  valor_total_pote: number;
  valor_casa: number;
  valor_distribuido: number;
  total_fichas: number;
}

export interface DistribuicaoCompleta {
  distribuicao: Distribuicao;
  resumo: ResumoDistribuicao;
}

export interface Pote {
  periodo: string;
  valor_total: number;
  distribuido: boolean;
  data_distribuicao?: string;
}

