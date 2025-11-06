import apiClient from './apiClient';

export const estoqueService = {
  // Estoque
  getEstoque: (barbeariaId: string) => {
    return apiClient.get('/estoque', { 
      params: { barbearia_id: barbeariaId } 
    });
  },

  getEstoqueBaixo: (barbeariaId: string) => {
    return apiClient.get('/estoque/baixo', { 
      params: { barbearia_id: barbeariaId } 
    });
  },

  consultarEstoqueProduto: (produtoId: string, barbeariaId: string) => {
    return apiClient.get(`/estoque/produto/${produtoId}`, {
      params: { barbearia_id: barbeariaId }
    });
  },

  // Prateleiras
  getPrateleiras: (barbeariaId: string, filtros?: any) => {
    return apiClient.get('/prateleiras', { 
      params: { barbearia_id: barbeariaId, ...filtros } 
    });
  },

  getPrateleira: (id: string) => {
    return apiClient.get(`/prateleiras/${id}`);
  },

  createPrateleira: (data: any) => {
    return apiClient.post('/prateleiras', data);
  },

  updatePrateleira: (id: string, data: any) => {
    return apiClient.put(`/prateleiras/${id}`, data);
  },

  deletePrateleira: (id: string) => {
    return apiClient.delete(`/prateleiras/${id}`);
  },

  // Movimentações
  registrarEntrada: (data: any) => {
    return apiClient.post('/estoque/entrada', data);
  },

  registrarSaida: (data: any) => {
    return apiClient.post('/estoque/saida', data);
  },

  registrarAjuste: (data: any) => {
    return apiClient.post('/estoque/ajuste', data);
  },

  registrarTransferencia: (data: any) => {
    return apiClient.post('/estoque/transferencia', data);
  },
};

