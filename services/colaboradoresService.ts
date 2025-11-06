import apiClient from './apiClient';

export const colaboradoresService = {
  getColaboradores: (barbeariaId: string, busca?: string) => {
    return apiClient.get('/colaboradores', { 
      params: { barbearia_id: barbeariaId, busca } 
    });
  },

  getColaborador: (id: string, barbeariaId: string) => {
    return apiClient.get(`/colaboradores/${id}`, {
      params: { barbearia_id: barbeariaId }
    });
  },

  createColaborador: (data: any) => {
    return apiClient.post('/colaboradores', data);
  },

  updateColaborador: (id: string, data: any) => {
    return apiClient.put(`/colaboradores/${id}`, data);
  },

  deleteColaborador: (id: string, barbeariaId: string) => {
    return apiClient.delete(`/colaboradores/${id}`, {
      params: { barbearia_id: barbeariaId }
    });
  },

  updatePermissoes: (id: string, permissoes: any, barbeariaId: string) => {
    return apiClient.put(`/colaboradores/${id}/permissoes`, {
      barbearia_id: barbeariaId,
      permissoes
    });
  },
};
