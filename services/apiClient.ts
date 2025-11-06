import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { showMessage } from 'react-native-flash-message';

// Configuração base da API
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadToken();
  }

  private setupInterceptors() {
    // Request interceptor para adicionar token
    this.client.interceptors.request.use(
      async (config) => {
        
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        console.log('❌ ERRO NO REQUEST:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        console.log('❌ ERRO NA RESPOSTA:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
          },
        });
        
        const { response } = error;

        if (response) {
          switch (response.status) {
            case 401:
              await this.handleUnauthorized();
              break;
            case 403:
              showMessage({
                message: 'Acesso negado',
                description: 'Você não tem permissão para realizar esta ação.',
                type: 'danger',
              });
              break;
            case 404:
              showMessage({
                message: 'Recurso não encontrado',
                description: 'O recurso solicitado não foi encontrado.',
                type: 'warning',
              });
              break;
            case 422:
              this.handleValidationErrors(response.data.errors);
              break;
            case 500:
              showMessage({
                message: 'Erro interno do servidor',
                description: 'Ocorreu um erro interno. Tente novamente.',
                type: 'danger',
              });
              break;
            default:
              showMessage({
                message: 'Erro na requisição',
                description: response.data.message || 'Ocorreu um erro inesperado.',
                type: 'danger',
              });
          }
        } else {
          showMessage({
            message: 'Erro de conexão',
            description: 'Verifique sua conexão com a internet.',
            type: 'danger',
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private async handleUnauthorized() {
    await this.clearToken();
    // Aqui você pode navegar para a tela de login
    // navigation.navigate('Login');
  }

  private handleValidationErrors(errors: Record<string, string[]>) {
    const errorMessages = Object.values(errors).flat();
    showMessage({
      message: 'Erro de validação',
      description: errorMessages.join('\n'),
      type: 'warning',
    });
  }

  private async loadToken() {
    try {
      // Tenta carregar do SecureStore primeiro
      this.token = await SecureStore.getItemAsync('auth_token');
      
      // Se não encontrar no SecureStore, tenta do AsyncStorage (via authStore)
      if (!this.token) {
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const authData = await AsyncStorage.getItem('auth-storage');
          if (authData) {
            const parsed = JSON.parse(authData);
            if (parsed.state?.token) {
              this.token = parsed.state.token;
              // Sincroniza com SecureStore também
              if (this.token) {
                await SecureStore.setItemAsync('auth_token', this.token);
              }
            }
          }
        } catch (e) {
          // Ignora erro se não conseguir carregar do AsyncStorage
        }
      }
    } catch (error) {
      console.error('Erro ao carregar token:', error);
    }
  }

  public async setToken(token: string) {
    this.token = token;
    try {
      await SecureStore.setItemAsync('auth_token', token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  public async clearToken() {
    this.token = null;
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }

  // Métodos HTTP genéricos
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Instância singleton
export const apiClient = new ApiClient();
export default apiClient;
