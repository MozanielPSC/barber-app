import { Agendamento, StatusAgendamento } from '../types';

export class AgendamentoBusinessRules {
  /**
   * Verifica se um horário está disponível para agendamento
   */
  static isHorarioDisponivel(
    dataHora: string,
    colaboradorId: number,
    duracaoMinutos: number,
    agendamentosExistentes: Agendamento[]
  ): boolean {
    const novaDataHora = new Date(dataHora);
    const novaDataFim = new Date(novaDataHora.getTime() + duracaoMinutos * 60000);

    // Filtrar agendamentos do mesmo colaborador no mesmo dia
    const agendamentosColaborador = agendamentosExistentes.filter(
      (ag) => ag.colaborador_id === colaboradorId &&
      ag.status !== StatusAgendamento.CANCELADO &&
      ag.status !== StatusAgendamento.NAO_COMPARECEU
    );

    // Verificar conflitos de horário
    for (const agendamento of agendamentosColaborador) {
      const agendamentoInicio = new Date(agendamento.data_hora);
      const agendamentoFim = new Date(agendamentoInicio.getTime() + agendamento.servico.duracao_minutos * 60000);

      // Verificar sobreposição
      if (
        (novaDataHora >= agendamentoInicio && novaDataHora < agendamentoFim) ||
        (novaDataFim > agendamentoInicio && novaDataFim <= agendamentoFim) ||
        (novaDataHora <= agendamentoInicio && novaDataFim >= agendamentoFim)
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calcula o próximo horário disponível
   */
  static calcularProximoHorarioDisponivel(
    colaboradorId: number,
    duracaoMinutos: number,
    agendamentosExistentes: Agendamento[],
    horarioInicio: string = '08:00',
    horarioFim: string = '18:00',
    intervaloMinutos: number = 30
  ): string | null {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Verificar próximos 7 dias
    for (let dia = 0; dia < 7; dia++) {
      const dataAtual = new Date(hoje);
      dataAtual.setDate(hoje.getDate() + dia);

      const [horaInicio, minutoInicio] = horarioInicio.split(':').map(Number);
      const [horaFim, minutoFim] = horarioFim.split(':').map(Number);

      const inicioDia = new Date(dataAtual);
      inicioDia.setHours(horaInicio, minutoInicio, 0, 0);

      const fimDia = new Date(dataAtual);
      fimDia.setHours(horaFim, minutoFim, 0, 0);

      // Verificar intervalos de tempo
      for (let horario = inicioDia.getTime(); horario < fimDia.getTime(); horario += intervaloMinutos * 60000) {
        const horarioTeste = new Date(horario);
        const horarioString = horarioTeste.toISOString();

        if (this.isHorarioDisponivel(horarioString, colaboradorId, duracaoMinutos, agendamentosExistentes)) {
          return horarioString;
        }
      }
    }

    return null;
  }

  /**
   * Valida se um agendamento pode ser cancelado
   */
  static podeCancelarAgendamento(agendamento: Agendamento): boolean {
    const agora = new Date();
    const dataAgendamento = new Date(agendamento.data_hora);
    const diferencaHoras = (dataAgendamento.getTime() - agora.getTime()) / (1000 * 60 * 60);

    // Só pode cancelar se não estiver concluído e com pelo menos 2 horas de antecedência
    return (
      agendamento.status !== StatusAgendamento.CONCLUIDO &&
      agendamento.status !== StatusAgendamento.CANCELADO &&
      diferencaHoras >= 2
    );
  }

  /**
   * Valida se um agendamento pode ser confirmado
   */
  static podeConfirmarAgendamento(agendamento: Agendamento): boolean {
    return agendamento.status === StatusAgendamento.AGENDADO;
  }

  /**
   * Valida se um agendamento pode ser iniciado
   */
  static podeIniciarAgendamento(agendamento: Agendamento): boolean {
    const agora = new Date();
    const dataAgendamento = new Date(agendamento.data_hora);
    const diferencaMinutos = (agendamento.data_hora.getTime() - agora.getTime()) / (1000 * 60);

    return (
      agendamento.status === StatusAgendamento.CONFIRMADO &&
      diferencaMinutos <= 30 && // Pode iniciar até 30 minutos antes
      diferencaMinutos >= -60 // Ou até 1 hora depois
    );
  }

  /**
   * Valida se um agendamento pode ser concluído
   */
  static podeConcluirAgendamento(agendamento: Agendamento): boolean {
    return agendamento.status === StatusAgendamento.EM_ANDAMENTO;
  }

  /**
   * Calcula o tempo de atraso de um agendamento
   */
  static calcularAtraso(agendamento: Agendamento): number {
    if (agendamento.status !== StatusAgendamento.EM_ANDAMENTO) {
      return 0;
    }

    const agora = new Date();
    const dataAgendamento = new Date(agendamento.data_hora);
    const atrasoMinutos = (agora.getTime() - dataAgendamento.getTime()) / (1000 * 60);

    return Math.max(0, atrasoMinutos);
  }

  /**
   * Gera slots de horário disponíveis para um dia
   */
  static gerarSlotsDisponiveis(
    data: Date,
    colaboradorId: number,
    duracaoMinutos: number,
    agendamentosExistentes: Agendamento[],
    horarioInicio: string = '08:00',
    horarioFim: string = '18:00',
    intervaloMinutos: number = 30
  ): string[] {
    const slots: string[] = [];
    const [horaInicio, minutoInicio] = horarioInicio.split(':').map(Number);
    const [horaFim, minutoFim] = horarioFim.split(':').map(Number);

    const inicioDia = new Date(data);
    inicioDia.setHours(horaInicio, minutoInicio, 0, 0);

    const fimDia = new Date(data);
    fimDia.setHours(horaFim, minutoFim, 0, 0);

    for (let horario = inicioDia.getTime(); horario < fimDia.getTime(); horario += intervaloMinutos * 60000) {
      const horarioTeste = new Date(horario);
      const horarioString = horarioTeste.toISOString();

      if (this.isHorarioDisponivel(horarioString, colaboradorId, duracaoMinutos, agendamentosExistentes)) {
        slots.push(horarioString);
      }
    }

    return slots;
  }
}
