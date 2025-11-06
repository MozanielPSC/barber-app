export interface Service {
  id: string; // UUID
  barbearia_id: string;
  nome: string;
  preco_padrao: string; // "0.00" formato string
  percentual_comissao_executor?: number; // 0-1 (ex: 0.5 = 50%)
  percentual_comissao_assistente?: number; // 0-1 (opcional)
  percentual_comissao_indicacao?: number; // 0-1 (opcional)
  meta_diaria_qtd?: number;
  // Campos opcionais para compatibilidade
  descricao?: string;
  duracao_minutos?: number;
  ativo?: boolean;
  usuario_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string; // UUID
  barbearia_id: string;
  nome: string;
  preco_padrao: string; // "0.00" formato string
  percentual_comissao?: number; // 0-1 (ex: 0.5 = 50%)
  percentual_imposto?: number; // 0-1 (opcional)
  percentual_cartao?: number; // 0-1 (opcional)
  meta_diaria_qtd?: number;
  // Campos opcionais para compatibilidade
  descricao?: string;
  ativo?: boolean;
  usuario_id?: string;
  created_at?: string;
  updated_at?: string;
}
