export interface ComissaoServico {
  id: number;
  colaborador_id: number;
  servico_id: number;
  agendamento_id: number;
  valor_comissao: number;
  percentual_comissao: number;
  tipo: 'executor' | 'assistente' | 'indicacao';
  data: string;
  created_at: string;
}

export interface ComissaoProduto {
  id: number;
  colaborador_id: number;
  produto_id: number;
  valor_comissao: number;
  percentual_comissao: number;
  quantidade: number;
  data: string;
  created_at: string;
}

export interface Debito {
  id: number;
  colaborador_id: number;
  valor: number;
  descricao: string;
  data: string;
  created_at: string;
}

export interface Indicacao {
  id: number;
  colaborador_id: number;
  cliente_id: number;
  valor_comissao: number;
  data: string;
  created_at: string;
}

export interface ResumoComissoes {
  colaborador_id: number;
  colaborador_nome: string;
  comissoes_servicos: number;
  comissoes_produtos: number;
  comissoes_indicacoes: number;
  debitos: number;
  total: number;
}

export interface ProjecaoComissoes {
  colaborador_id: number;
  colaborador_nome: string;
  projecao_mensal: number;
  projecao_semanal: number;
}
