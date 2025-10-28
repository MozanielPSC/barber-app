import { create } from 'zustand';
import { barbeariasService } from '../services';
import { Barbearia, BarbeariasState } from '../types';

interface BarbeariasStore extends BarbeariasState {
  loadBarbearias: () => Promise<void>;
  setBarbeariaAtual: (barbearia: Barbearia) => void;
  createBarbearia: (data: any) => Promise<void>;
  updateBarbearia: (id: number, data: any) => Promise<void>;
  deleteBarbearia: (id: number) => Promise<void>;
}

export const useBarbeariasStore = create<BarbeariasStore>((set, get) => ({
  barbearias: [],
  barbeariaAtual: null,
  isLoading: false,

  loadBarbearias: async () => {
    set({ isLoading: true });
    try {
      const barbearias = await barbeariasService.getBarbearias();
      set({ barbearias, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setBarbeariaAtual: (barbearia: Barbearia) => {
    set({ barbeariaAtual: barbearia });
  },

  createBarbearia: async (data: any) => {
    set({ isLoading: true });
    try {
      const barbearia = await barbeariasService.createBarbearia(data);
      set((state) => ({
        barbearias: [...state.barbearias, barbearia],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateBarbearia: async (id: number, data: any) => {
    set({ isLoading: true });
    try {
      const barbearia = await barbeariasService.updateBarbearia(id, data);
      set((state) => ({
        barbearias: state.barbearias.map((b) => (b.id === id ? barbearia : b)),
        barbeariaAtual: state.barbeariaAtual?.id === id ? barbearia : state.barbeariaAtual,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteBarbearia: async (id: number) => {
    set({ isLoading: true });
    try {
      await barbeariasService.deleteBarbearia(id);
      set((state) => ({
        barbearias: state.barbearias.filter((b) => b.id !== id),
        barbeariaAtual: state.barbeariaAtual?.id === id ? null : state.barbeariaAtual,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
