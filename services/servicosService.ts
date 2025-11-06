import apiClient from './apiClient';

export const servicosService = {
  getServicos: (barbeariaId: string) => {
    return apiClient.get('/servicos', { 
      params: { barbearia_id: barbeariaId } 
    });
  },

  createServico: (data: any) => {
    return apiClient.post('/servicos', data);
  },

  updateServico: (id: string, data: any) => {
    return apiClient.put(`/servicos/${id}`, data);
  },

  deleteServico: (id: string, barbeariaId: string) => {
    return apiClient.delete(`/servicos/${id}`, {
      params: { barbearia_id: barbeariaId }
    });
  },
};
