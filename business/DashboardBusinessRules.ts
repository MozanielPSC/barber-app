import { ChannelStats, ClientAtRisk, DashboardKPIs } from '../types';

export class DashboardBusinessRules {
  /**
   * Calcula KPIs do dashboard
   */
  static calcularKPIs(
    receitas: number[],
    agendamentos: any[],
    clientes: any[]
  ): DashboardKPIs {
    const receitaTotal = receitas.reduce((sum, receita) => sum + receita, 0);
    const clientesAtendidos = agendamentos.length;
    const ticketMedio = clientesAtendidos > 0 ? receitaTotal / clientesAtendidos : 0;
    
    // Calcular taxa de conversão (agendamentos confirmados / total agendamentos)
    const agendamentosConfirmados = agendamentos.filter(a => a.status === 'confirmado').length;
    const taxaConversao = agendamentos.length > 0 ? (agendamentosConfirmados / agendamentos.length) * 100 : 0;

    return {
      receita_total: receitaTotal,
      ticket_medio: ticketMedio,
      clientes_atendidos: clientesAtendidos,
      taxa_conversao: taxaConversao,
      clientes_em_risco: [],
      estatisticas_canais: [],
    };
  }

  /**
   * Calcula clientes em risco de perda
   */
  static calcularClientesEmRisco(
    clientes: any[],
    diasLimite: number = 30
  ): ClientAtRisk[] {
    const agora = new Date();
    const limiteData = new Date(agora.getTime() - diasLimite * 24 * 60 * 60 * 1000);

    return clientes
      .filter(cliente => {
        const ultimaVisita = new Date(cliente.ultima_visita);
        return ultimaVisita < limiteData;
      })
      .map(cliente => {
        const ultimaVisita = new Date(cliente.ultima_visita);
        const diasSemVisitar = Math.floor(
          (agora.getTime() - ultimaVisita.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          cliente_id: cliente.id,
          cliente_nome: cliente.nome,
          ultima_visita: cliente.ultima_visita,
          dias_sem_visitar: diasSemVisitar,
        };
      })
      .sort((a, b) => b.dias_sem_visitar - a.dias_sem_visitar);
  }

  /**
   * Calcula estatísticas por canal de aquisição
   */
  static calcularEstatisticasCanais(
    agendamentos: any[]
  ): ChannelStats[] {
    const canaisMap = new Map<string, { agendamentos: number; receita: number }>();

    agendamentos.forEach(agendamento => {
      const canal = agendamento.canal || 'Indefinido';
      const atual = canaisMap.get(canal) || { agendamentos: 0, receita: 0 };
      
      atual.agendamentos += 1;
      atual.receita += agendamento.valor || 0;
      
      canaisMap.set(canal, atual);
    });

    return Array.from(canaisMap.entries()).map(([nome, stats], index) => ({
      canal_id: index + 1,
      canal_nome: nome,
      total_agendamentos: stats.agendamentos,
      total_receita: stats.receita,
    }));
  }

  /**
   * Calcula crescimento mensal
   */
  static calcularCrescimentoMensal(
    receitaAtual: number,
    receitaAnterior: number
  ): number {
    if (receitaAnterior === 0) return 0;
    return ((receitaAtual - receitaAnterior) / receitaAnterior) * 100;
  }

  /**
   * Calcula metas vs realizado
   */
  static calcularAtingimentoMeta(
    valorRealizado: number,
    meta: number
  ): { percentual: number; atingiu: boolean } {
    const percentual = meta > 0 ? (valorRealizado / meta) * 100 : 0;
    return {
      percentual: Math.min(percentual, 100),
      atingiu: valorRealizado >= meta,
    };
  }

  /**
   * Calcula indicadores de performance
   */
  static calcularIndicadoresPerformance(
    agendamentos: any[],
    colaboradores: any[]
  ) {
    const agendamentosConcluidos = agendamentos.filter(a => a.status === 'concluido');
    const agendamentosCancelados = agendamentos.filter(a => a.status === 'cancelado');
    
    const taxaConclusao = agendamentos.length > 0 
      ? (agendamentosConcluidos.length / agendamentos.length) * 100 
      : 0;
    
    const taxaCancelamento = agendamentos.length > 0 
      ? (agendamentosCancelados.length / agendamentos.length) * 100 
      : 0;

    const produtividadeColaborador = colaboradores.map(colaborador => {
      const agendamentosColaborador = agendamentos.filter(a => a.colaborador_id === colaborador.id);
      const agendamentosConcluidosColaborador = agendamentosColaborador.filter(a => a.status === 'concluido');
      
      return {
        colaborador_id: colaborador.id,
        colaborador_nome: colaborador.nome,
        total_agendamentos: agendamentosColaborador.length,
        agendamentos_concluidos: agendamentosConcluidosColaborador.length,
        produtividade: agendamentosColaborador.length > 0 
          ? (agendamentosConcluidosColaborador.length / agendamentosColaborador.length) * 100 
          : 0,
      };
    });

    return {
      taxa_conclusao: taxaConclusao,
      taxa_cancelamento: taxaCancelamento,
      produtividade_colaboradores: produtividadeColaborador,
    };
  }

  /**
   * Calcula tendências de vendas
   */
  static calcularTendenciasVendas(
    vendas: { data: string; valor: number }[],
    periodoDias: number = 7
  ): { tendencia: 'crescendo' | 'decrescendo' | 'estavel'; percentual: number } {
    if (vendas.length < 2) {
      return { tendencia: 'estavel', percentual: 0 };
    }

    const vendasOrdenadas = vendas
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(-periodoDias);

    const primeiraSemana = vendasOrdenadas.slice(0, Math.floor(vendasOrdenadas.length / 2));
    const segundaSemana = vendasOrdenadas.slice(Math.floor(vendasOrdenadas.length / 2));

    const mediaPrimeiraSemana = primeiraSemana.reduce((sum, v) => sum + v.valor, 0) / primeiraSemana.length;
    const mediaSegundaSemana = segundaSemana.reduce((sum, v) => sum + v.valor, 0) / segundaSemana.length;

    const percentualVariacao = mediaPrimeiraSemana > 0 
      ? ((mediaSegundaSemana - mediaPrimeiraSemana) / mediaPrimeiraSemana) * 100 
      : 0;

    let tendencia: 'crescendo' | 'decrescendo' | 'estavel' = 'estavel';
    if (percentualVariacao > 5) tendencia = 'crescendo';
    else if (percentualVariacao < -5) tendencia = 'decrescendo';

    return {
      tendencia,
      percentual: Math.abs(percentualVariacao),
    };
  }
}
