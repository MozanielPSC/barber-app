import apiClient from './apiClient';

export const authService = {
  login: (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, senha: password });
  },

  loginColaborador: (email: string, password: string, codigoBarbearia: string) => {
    return apiClient.post('/auth/login/colaborador', { 
      email, 
      senha: password, 
      codigo_barbearia: codigoBarbearia 
    });
  },

  register: (data: any) => {
    return apiClient.post('/auth/register', data);
  },

  logout: () => {
    return apiClient.post('/auth/logout');
  },

  getProfile: () => {
    return apiClient.get('/auth/profile');
  },

  updateProfile: (data: any) => {
    return apiClient.put('/auth/profile', data);
  },

  uploadProfilePhoto: (file: any) => {
    const formData = new FormData();
    formData.append('photo', file);
    
    return apiClient.post('/auth/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
