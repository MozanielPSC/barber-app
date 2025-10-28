import apiClient from './apiClient';

export const barbeariasService = {
  getBarbearias: () => {
    return apiClient.get('/barbearias');
  },

  getBarbearia: (id: number) => {
    return apiClient.get(`/barbearias/${id}`);
  },

  createBarbearia: (data: any) => {
    return apiClient.post('/barbearias', data);
  },

  updateBarbearia: (id: number, data: any) => {
    return apiClient.put(`/barbearias/${id}`, data);
  },

  deleteBarbearia: (id: number) => {
    return apiClient.delete(`/barbearias/${id}`);
  },
};
