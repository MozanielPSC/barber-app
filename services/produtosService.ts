import apiClient from './apiClient';

export const produtosService = {
  getProdutos: (barbeariaId: string) => {
    return apiClient.get('/produtos', { 
      params: { barbearia_id: barbeariaId } 
    });
  },

  createProduto: (data: any) => {
    return apiClient.post('/produtos', data);
  },

  updateProduto: (id: string, data: any) => {
    return apiClient.put(`/produtos/${id}`, data);
  },

  deleteProduto: (id: string, barbeariaId: string) => {
    return apiClient.delete(`/produtos/${id}`, {
      params: { barbearia_id: barbeariaId }
    });
  },
};
