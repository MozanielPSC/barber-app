import apiClient from './apiClient';

export const barbeariasService = {
  getBarbearias: () => {
    return apiClient.get('/barbearias');
  },

  getBarbearia: (id: string) => {
    return apiClient.get(`/barbearias/${id}`);
  },

  createBarbearia: (data: any) => {
    return apiClient.post('/barbearias', data);
  },

  updateBarbearia: (id: string, data: any) => {
    return apiClient.put(`/barbearias/${id}`, data);
  },

  deleteBarbearia: (id: string) => {
    return apiClient.delete(`/barbearias/${id}`);
  },
};
