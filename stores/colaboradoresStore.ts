import { create } from 'zustand';
import { colaboradoresService } from '../services';
import { Colaborador } from '../types';

interface ColaboradoresState {
  colaboradores: Colaborador[];
  isLoading: boolean;
}

interface ColaboradoresStore extends ColaboradoresState {
  loadColaboradores: (barbeariaId: string, busca?: string) => Promise<void>;
  getColaborador: (id: string, barbeariaId: string) => Promise<Colaborador>;
  createColaborador: (data: any) => Promise<void>;
  updateColaborador: (id: string, data: any) => Promise<void>;
  deleteColaborador: (id: string, barbeariaId: string) => Promise<void>;
  updatePermissoes: (id: string, permissoes: any, barbeariaId: string) => Promise<void>;
}

export const useColaboradoresStore = create<ColaboradoresStore>((set, get) => ({
  colaboradores: [],
  isLoading: false,

  loadColaboradores: async (barbeariaId: string, busca?: string) => {
    set({ isLoading: true });
    try {
      const colaboradores = await colaboradoresService.getColaboradores(barbeariaId, busca);
      set({ colaboradores: Array.isArray(colaboradores) ? colaboradores : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, colaboradores: [] });
      throw error;
    }
  },

  getColaborador: async (id: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const colaborador = await colaboradoresService.getColaborador(id, barbeariaId);
      set({ isLoading: false });
      return colaborador;
    } catch (error) {
      set({ isLoading: false });
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

  updateColaborador: async (id: string, data: any) => {
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

  deleteColaborador: async (id: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      await colaboradoresService.deleteColaborador(id, barbeariaId);
      set((state) => ({
        colaboradores: state.colaboradores.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updatePermissoes: async (id: string, permissoes: any, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const colaborador = await colaboradoresService.updatePermissoes(id, permissoes, barbeariaId);
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
