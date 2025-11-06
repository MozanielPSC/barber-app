export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  origem?: string;
  quem_indicou?: string | null;
  observacoes?: string | null;
  criado_em: string; // ISO 8601
  ultima_visita?: string | null; // ISO 8601
  ultima_compra_produto?: string | null; // ISO 8601
  total_visitas?: number;
}

export interface ClienteHistorico {
  cliente: {
    id: string;
    nome: string;
    telefone: string;
  };
  estatisticas: {
    total_atendimentos: number;
    atendimentos_concluidos: number;
    atendimentos_cancelados: number;
    total_gasto_geral: number;
    total_gasto_servicos: number;
    total_gasto_produtos: number;
    colaboradores_que_atenderam: number;
  };
  atendimentos: AtendimentoHistorico[];
}

export interface AtendimentoHistorico {
  id: string;
  data_atendimento: string; // YYYY-MM-DD
  horario_inicio: string; // HH:MM:SS
  horario_fim?: string; // HH:MM:SS
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu';
  colaborador: {
    id: string;
    nome: string;
    funcao?: string;
    foto_perfil_url_assinada?: string | null;
  };
  servicos: {
    id: string;
    nome: string;
    preco: string; // "0.00"
  }[];
  produtos: {
    id: string;
    nome: string;
    quantidade: number;
    preco: string; // "0.00"
  }[];
}

export interface ClienteFormData {
  nome: string;
  telefone: string;
  origem?: string;
  quem_indicou?: string | null;
  observacoes?: string | null;
  barbearia_id: string;
}

