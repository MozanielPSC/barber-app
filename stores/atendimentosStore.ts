import { create } from 'zustand';
import { atendimentosService } from '../services';
import { Atendimento } from '../types';

interface AtendimentosStore {
  atendimentos: Atendimento[];
  isLoading: boolean;
  loadAtendimentos: (barbeariaId: string) => Promise<void>;
  getAtendimento: (id: string) => Atendimento | undefined;
  createAtendimento: (data: any) => Promise<void>;
  updateAtendimento: (id: string, data: any) => Promise<void>;
  deleteAtendimento: (id: string, barbeariaId: string) => Promise<void>;
  
  // Getters
  atendimentosHoje: () => Atendimento[];
  atendimentosEstaSemana: () => Atendimento[];
  atendimentosEsteMes: () => Atendimento[];
  atendimentosCompareceram: () => Atendimento[];
  atendimentosFaltaram: () => Atendimento[];
}

export const useAtendimentosStore = create<AtendimentosStore>((set, get) => ({
  atendimentos: [],
  isLoading: false,

  loadAtendimentos: async (barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const atendimentos = await atendimentosService.getAtendimentos(barbeariaId);
      set({ atendimentos: Array.isArray(atendimentos) ? atendimentos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, atendimentos: [] });
      throw error;
    }
  },

  getAtendimento: (id: string) => {
    const { atendimentos } = get();
    return atendimentos.find((a) => a.id === id);
  },

  createAtendimento: async (data: any) => {
    set({ isLoading: true });
    try {
      const atendimento = await atendimentosService.createAtendimento(data);
      set((state) => ({
        atendimentos: [atendimento, ...state.atendimentos],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateAtendimento: async (id: string, data: any) => {
    set({ isLoading: true });
    try {
      const atendimento = await atendimentosService.updateAtendimento(id, data);
      set((state) => ({
        atendimentos: state.atendimentos.map((a) => (a.id === id ? atendimento : a)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteAtendimento: async (id: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      await atendimentosService.deleteAtendimento(id, barbeariaId);
      set((state) => ({
        atendimentos: state.atendimentos.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Getters
  atendimentosHoje: () => {
    const { atendimentos } = get();
    const hoje = new Date().toISOString().split('T')[0];
    return atendimentos.filter((a) => a.data_atendimento === hoje);
  },

  atendimentosEstaSemana: () => {
    const { atendimentos } = get();
    const hoje = new Date();
    const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
    return atendimentos.filter((a) => {
      const data = new Date(a.data_atendimento);
      return data >= seteDiasAtras && data <= hoje;
    });
  },

  atendimentosEsteMes: () => {
    const { atendimentos } = get();
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    return atendimentos.filter((a) => {
      const data = new Date(a.data_atendimento);
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    });
  },

  atendimentosCompareceram: () => {
    const { atendimentos } = get();
    return atendimentos.filter((a) => a.compareceu);
  },

  atendimentosFaltaram: () => {
    const { atendimentos } = get();
    return atendimentos.filter((a) => !a.compareceu);
  },
}));

