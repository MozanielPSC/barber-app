import apiClient from './apiClient';

export const colaboradoresService = {
  getColaboradores: (params?: any) => {
    return apiClient.get('/colaboradores', { params });
  },

  getColaborador: (id: number) => {
    return apiClient.get(`/colaboradores/${id}`);
  },

  createColaborador: (data: any) => {
    return apiClient.post('/colaboradores', data);
  },

  updateColaborador: (id: number, data: any) => {
    return apiClient.put(`/colaboradores/${id}`, data);
  },

  deleteColaborador: (id: number) => {
    return apiClient.delete(`/colaboradores/${id}`);
  },

  updatePermissoes: (id: number, permissoes: number[]) => {
    return apiClient.put(`/colaboradores/${id}/permissoes`, { permissoes });
  },
};
