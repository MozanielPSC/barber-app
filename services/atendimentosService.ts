import apiClient from './apiClient';

export const atendimentosService = {
  getAtendimentos: (barbeariaId: string) => {
    return apiClient.get('/atendimentos', { 
      params: { barbearia_id: barbeariaId } 
    });
  },

  getAtendimento: (id: string, barbeariaId: string) => {
    return apiClient.get(`/atendimentos/${id}`, {
      params: { barbearia_id: barbeariaId }
    });
  },

  createAtendimento: (data: any) => {
    return apiClient.post('/atendimentos', data);
  },

  updateAtendimento: (id: string, data: any) => {
    return apiClient.put(`/atendimentos/${id}`, data);
  },

  deleteAtendimento: (id: string, barbeariaId: string) => {
    return apiClient.delete(`/atendimentos/${id}`, {
      params: { barbearia_id: barbeariaId }
    });
  },
};

