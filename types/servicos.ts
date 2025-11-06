export interface Service {
  id: string;
  usuario_id?: string;
  barbearia_id: string;
  nome: string;
  descricao?: string;
  duracao_minutos: number;
  preco_padrao: string; // API retorna como string
  percentual_comissao_executor?: string;
  percentual_comissao_assistente?: string;
  percentual_comissao_indicacao?: string;
  meta_diaria_qtd?: number;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
  // Campo opcional para compatibilidade
  preco?: number | string;
}

export interface Product {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque_minimo: number;
  estoque_atual: number;
  ativo: boolean;
  barbearia_id: number;
  created_at: string;
  updated_at: string;
}
