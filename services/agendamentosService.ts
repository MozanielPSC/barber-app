import apiClient from './apiClient';

export const agendamentosService = {
  getAgendamentos: (params?: {
    barbearia_id?: number | string;
    data?: string;
    data_inicio?: string;
    data_fim?: string;
    colaborador_id?: number | string;
    status?: string;
  }) => {
    return apiClient.get('/atendimentos/agendamentos/lista', { params });
  },

  getAgendamento: (id: number | string) => {
    return apiClient.get(`/atendimentos/${id}`);
  },

  createAgendamento: (data: any) => {
    return apiClient.post('/atendimentos/agendamento', data);
  },

  updateAgendamento: (id: number | string, data: any) => {
    return apiClient.put(`/atendimentos/${id}`, data);
  },

  deleteAgendamento: (id: number | string, barbearia_id: number | string) => {
    return apiClient.delete(`/atendimentos/${id}`, { params: { barbearia_id } });
  },

  updateStatus: (id: number | string, status: string, barbearia_id: number | string) => {
    return apiClient.patch(`/atendimentos/${id}/status`, { status, barbearia_id });
  },

  getDisponibilidade: (colaboradorId: number | string, params: {
    data: string;
    servico_id: number | string;
    intervalo?: number;
  }) => {
    return apiClient.get(`/atendimentos/colaborador/${colaboradorId}/disponibilidade`, { params });
  },

};
