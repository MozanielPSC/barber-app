import apiClient from './apiClient';

export const agendamentosService = {
  getAgendamentos: (params?: any) => {
    return apiClient.get('/agendamentos', { params });
  },

  getAgendamento: (id: number) => {
    return apiClient.get(`/agendamentos/${id}`);
  },

  createAgendamento: (data: any) => {
    return apiClient.post('/agendamentos', data);
  },

  updateAgendamento: (id: number, data: any) => {
    return apiClient.put(`/agendamentos/${id}`, data);
  },

  deleteAgendamento: (id: number) => {
    return apiClient.delete(`/agendamentos/${id}`);
  },

  confirmarAgendamento: (id: number) => {
    return apiClient.patch(`/agendamentos/${id}/confirmar`);
  },

  cancelarAgendamento: (id: number, motivo?: string) => {
    return apiClient.patch(`/agendamentos/${id}/cancelar`, { motivo });
  },

  iniciarAtendimento: (id: number) => {
    return apiClient.patch(`/agendamentos/${id}/iniciar`);
  },

  concluirAtendimento: (id: number, observacoes?: string) => {
    return apiClient.patch(`/agendamentos/${id}/concluir`, { observacoes });
  },
};
