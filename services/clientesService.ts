import apiClient from './apiClient';
import { Cliente, ClienteHistorico } from '../types/clientes';

export const clientesService = {
  getClientes: async (params?: { barbearia_id?: string | number; busca?: string }): Promise<Cliente[]> => {
    const response = await apiClient.get('/clientes', { params });
    return response.data;
  },

  getCliente: async (id: string | number): Promise<Cliente> => {
    const response = await apiClient.get(`/clientes/${id}`);
    return response.data;
  },

  createCliente: async (data: any): Promise<Cliente> => {
    const response = await apiClient.post('/clientes', data);
    return response.data;
  },

  createClienteAudio: async (audioFile: any, barbearia_id: string): Promise<Cliente> => {
    const formData = new FormData();
    
    // FormData para React Native precisa de objeto com uri, type e name
    formData.append('audio', {
      uri: audioFile.uri,
      type: audioFile.mimeType || 'audio/*',
      name: audioFile.name || 'audio.mp3',
    } as any);
    formData.append('barbearia_id', barbearia_id);
    
    const response = await apiClient.post('/clientes/clientes-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCliente: async (id: string | number, data: any): Promise<Cliente> => {
    const response = await apiClient.put(`/clientes/${id}`, data);
    return response.data;
  },

  deleteCliente: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/clientes/${id}`);
  },

  getHistorico: async (id: string | number, barbearia_id: string | number): Promise<ClienteHistorico> => {
    const response = await apiClient.get(`/clientes/${id}/historico`, {
      params: { barbearia_id },
    });
    return response.data;
  },
};
