import { Product } from './servicos';

export interface Prateleira {
  id: number;
  nome: string;
  descricao?: string;
  barbearia_id: number;
  created_at: string;
  updated_at: string;
}

export interface EstoqueProduto {
  id: number;
  produto_id: number;
  prateleira_id: number;
  quantidade: number;
  quantidade_minima: number;
  produto: Product;
  prateleira: Prateleira;
  created_at: string;
  updated_at: string;
}

export interface MovimentacaoEstoque {
  id: number;
  produto_id: number;
  prateleira_id: number;
  tipo: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  motivo: string;
  colaborador_id: number;
  data: string;
  created_at: string;
}

export interface ProdutoEstoqueBaixo {
  produto_id: number;
  produto_nome: string;
  quantidade_atual: number;
  quantidade_minima: number;
  prateleira_nome: string;
}
