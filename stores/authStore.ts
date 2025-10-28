import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { apiClient, authService } from '../services';
import { AuthState } from '../types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginColaborador: (email: string, password: string, codigoBarbearia: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  uploadProfilePhoto: (file: any) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          await apiClient.setToken(response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginColaborador: async (email: string, password: string, codigoBarbearia: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.loginColaborador(email, password, codigoBarbearia);
          await apiClient.setToken(response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: any) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(data);
          await apiClient.setToken(response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      loadProfile: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getProfile();
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: async (data: any) => {
        set({ isLoading: true });
        try {
          const user = await authService.updateProfile(data);
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      uploadProfilePhoto: async (file: any) => {
        set({ isLoading: true });
        try {
          const user = await authService.uploadProfilePhoto(file);
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
