export interface Estoque {
  id: string; // UUID
  produto_id: string;
  prateleira_id: string;
  quantidade_atual: number;
  quantidade_reservada: number;
  produto?: {
    id: string;
    nome: string;
    preco_padrao: string;
  };
  prateleira?: {
    id: string;
    nome: string;
    localizacao: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Prateleira {
  id: string; // UUID
  barbearia_id: string;
  nome: string;
  localizacao: string;
  capacidade_maxima?: number;
  ativa: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProdutoEstoqueBaixo {
  id: string;
  nome: string;
  estoque_atual: number;
  estoque_minimo: number;
  alerta: 'baixo' | 'critico';
}

export interface MovimentacaoEstoque {
  id?: string;
  barbearia_id: string;
  produto_id: string;
  prateleira_id?: string;
  quantidade?: number;
  quantidade_nova?: number;
  prateleira_origem_id?: string;
  prateleira_destino_id?: string;
  motivo: string;
  observacoes?: string | null;
}

export interface RespostaMovimentacao {
  id: string;
  estoque_apos?: number;
  estoque_origem_apos?: number;
  estoque_destino_apos?: number;
  mensagem: string;
}
