import { create } from 'zustand';
import { colaboradoresService } from '../services';
import { ColaboradoresState } from '../types';

interface ColaboradoresStore extends ColaboradoresState {
  loadColaboradores: (params?: any) => Promise<void>;
  createColaborador: (data: any) => Promise<void>;
  updateColaborador: (id: number, data: any) => Promise<void>;
  deleteColaborador: (id: number) => Promise<void>;
  updatePermissoes: (id: number, permissoes: number[]) => Promise<void>;
}

export const useColaboradoresStore = create<ColaboradoresStore>((set, get) => ({
  colaboradores: [],
  isLoading: false,

  loadColaboradores: async (params?: any) => {
    set({ isLoading: true });
    try {
      const colaboradores = await colaboradoresService.getColaboradores(params);
      set({ colaboradores: Array.isArray(colaboradores) ? colaboradores : [], isLoading: false });
      return colaboradores;
    } catch (error) {
      set({ isLoading: false, colaboradores: [] });
      throw error;
    }
  },

  createColaborador: async (data: any) => {
    set({ isLoading: true });
    try {
      const colaborador = await colaboradoresService.createColaborador(data);
      set((state) => ({
        colaboradores: [...state.colaboradores, colaborador],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateColaborador: async (id: number, data: any) => {
    set({ isLoading: true });
    try {
      const colaborador = await colaboradoresService.updateColaborador(id, data);
      set((state) => ({
        colaboradores: state.colaboradores.map((c) => (c.id === id ? colaborador : c)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteColaborador: async (id: number) => {
    set({ isLoading: true });
    try {
      await colaboradoresService.deleteColaborador(id);
      set((state) => ({
        colaboradores: state.colaboradores.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updatePermissoes: async (id: number, permissoes: number[]) => {
    set({ isLoading: true });
    try {
      const colaborador = await colaboradoresService.updatePermissoes(id, permissoes);
      set((state) => ({
        colaboradores: state.colaboradores.map((c) => (c.id === id ? colaborador : c)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
