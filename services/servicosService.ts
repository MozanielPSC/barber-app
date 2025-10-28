import apiClient from './apiClient';

export const servicosService = {
  getServicos: (params?: any) => {
    return apiClient.get('/servicos', { params });
  },

  getServico: (id: number) => {
    return apiClient.get(`/servicos/${id}`);
  },

  createServico: (data: any) => {
    return apiClient.post('/servicos', data);
  },

  updateServico: (id: number, data: any) => {
    return apiClient.put(`/servicos/${id}`, data);
  },

  deleteServico: (id: number) => {
    return apiClient.delete(`/servicos/${id}`);
  },
};
