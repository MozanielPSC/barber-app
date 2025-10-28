import { create } from 'zustand';
import { servicosService } from '../services';
import { Service } from '../types';

interface ServicosStore {
  servicos: Service[];
  isLoading: boolean;
  loadServicos: (params?: any) => Promise<void>;
  createServico: (data: any) => Promise<void>;
  updateServico: (id: number, data: any) => Promise<void>;
  deleteServico: (id: number) => Promise<void>;
}

export const useServicosStore = create<ServicosStore>((set, get) => ({
  servicos: [],
  isLoading: false,

  loadServicos: async (params?: any) => {
    set({ isLoading: true });
    try {
      const servicos = await servicosService.getServicos(params);
      set({ servicos, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createServico: async (data: any) => {
    set({ isLoading: true });
    try {
      const servico = await servicosService.createServico(data);
      set((state) => ({
        servicos: [...state.servicos, servico],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateServico: async (id: number, data: any) => {
    set({ isLoading: true });
    try {
      const servico = await servicosService.updateServico(id, data);
      set((state) => ({
        servicos: state.servicos.map((s) => (s.id === id ? servico : s)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteServico: async (id: number) => {
    set({ isLoading: true });
    try {
      await servicosService.deleteServico(id);
      set((state) => ({
        servicos: state.servicos.filter((s) => s.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
