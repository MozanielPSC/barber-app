import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { barbeariasService } from '../services';
import { Barbearia, BarbeariasState } from '../types';

interface BarbeariasStore extends BarbeariasState {
  loadBarbearias: () => Promise<void>;
  setBarbeariaAtual: (barbearia: Barbearia | null) => Promise<void>;
  createBarbearia: (data: any) => Promise<void>;
  updateBarbearia: (id: number, data: any) => Promise<void>;
  deleteBarbearia: (id: number) => Promise<void>;
  loadBarbeariaSelecionada: () => Promise<void>;
  clearSelection: () => Promise<void>;
}

export const useBarbeariasStore = create<BarbeariasStore>()(
  persist(
    (set, get) => ({
      barbearias: [],
      barbeariaAtual: null,
      isLoading: false,

  loadBarbearias: async () => {
    set({ isLoading: true });
    try {
      const barbearias = await barbeariasService.getBarbearias();
      set({ barbearias, isLoading: false });
      
      // Se não tem barbearia selecionada e há barbearias, tenta carregar do storage
      const state = get();
      if (!state.barbeariaAtual && barbearias.length > 0) {
        await state.loadBarbeariaSelecionada();
        // Se ainda não tem selecionada e há barbearias, seleciona a primeira
        const newState = get();
        if (!newState.barbeariaAtual && barbearias.length > 0) {
          await state.setBarbeariaAtual(barbearias[0]);
        }
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setBarbeariaAtual: async (barbearia: Barbearia | null) => {
    set({ barbeariaAtual: barbearia });
    if (barbearia) {
      await AsyncStorage.setItem('barbearia_selecionada', JSON.stringify({ id: barbearia.id, nome: barbearia.nome }));
    } else {
      await AsyncStorage.removeItem('barbearia_selecionada');
    }
  },

  loadBarbeariaSelecionada: async () => {
    try {
      const saved = await AsyncStorage.getItem('barbearia_selecionada');
      if (saved) {
        const { id } = JSON.parse(saved);
        const state = get();
        const barbearia = state.barbearias.find((b) => b.id === id);
        if (barbearia) {
          set({ barbeariaAtual: barbearia });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar barbearia selecionada:', error);
    }
  },

  clearSelection: async () => {
    set({ barbeariaAtual: null });
    await AsyncStorage.removeItem('barbearia_selecionada');
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
}),
    {
      name: 'barbearias-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ barbeariaAtual: state.barbeariaAtual }),
    }
  )
);
