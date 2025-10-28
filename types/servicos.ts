export interface Service {
  id: number;
  nome: string;
  descricao?: string;
  duracao_minutos: number;
  preco: number;
  ativo: boolean;
  barbearia_id: number;
  created_at: string;
  updated_at: string;
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
