import { create } from 'zustand';
import { servicosService } from '../services';
import { Service } from '../types';

interface ServicosStore {
  servicos: Service[];
  isLoading: boolean;
  loadServicos: (barbeariaId: string) => Promise<void>;
  getServico: (id: string) => Service | undefined;
  createServico: (data: any) => Promise<void>;
  updateServico: (id: string, data: any) => Promise<void>;
  deleteServico: (id: string, barbeariaId: string) => Promise<void>;
}

export const useServicosStore = create<ServicosStore>((set, get) => ({
  servicos: [],
  isLoading: false,

  loadServicos: async (barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const servicos = await servicosService.getServicos(barbeariaId);
      set({ servicos: Array.isArray(servicos) ? servicos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, servicos: [] });
      throw error;
    }
  },

  getServico: (id: string) => {
    const { servicos } = get();
    return servicos.find((s) => s.id === id);
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

  updateServico: async (id: string, data: any) => {
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

  deleteServico: async (id: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      await servicosService.deleteServico(id, barbeariaId);
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
