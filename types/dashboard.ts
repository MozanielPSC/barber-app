
export interface DashboardKPIs {
  receita_total: number;
  ticket_medio: number;
  clientes_atendidos: number;
  taxa_conversao: number;
  clientes_em_risco: ClientAtRisk[];
  estatisticas_canais: ChannelStats[];
}

export interface ClientAtRisk {
  cliente_id: number;
  cliente_nome: string;
  ultima_visita: string;
  dias_sem_visitar: number;
}

export interface ChannelStats {
  canal_id: number;
  canal_nome: string;
  total_agendamentos: number;
  total_receita: number;
}
