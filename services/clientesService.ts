import apiClient from './apiClient';

export const clientesService = {
  getClientes: (params?: any) => {
    return apiClient.get('/clientes', { params });
  },

  getCliente: (id: number) => {
    return apiClient.get(`/clientes/${id}`);
  },

  createCliente: (data: any) => {
    return apiClient.post('/clientes', data);
  },

  updateCliente: (id: number, data: any) => {
    return apiClient.put(`/clientes/${id}`, data);
  },

  deleteCliente: (id: number) => {
    return apiClient.delete(`/clientes/${id}`);
  },
};
