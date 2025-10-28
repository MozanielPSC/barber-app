import apiClient from './apiClient';

export const produtosService = {
  getProdutos: (params?: any) => {
    return apiClient.get('/produtos', { params });
  },

  getProduto: (id: number) => {
    return apiClient.get(`/produtos/${id}`);
  },

  createProduto: (data: any) => {
    return apiClient.post('/produtos', data);
  },

  updateProduto: (id: number, data: any) => {
    return apiClient.put(`/produtos/${id}`, data);
  },

  deleteProduto: (id: number) => {
    return apiClient.delete(`/produtos/${id}`);
  },
};
