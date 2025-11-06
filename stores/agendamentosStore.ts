import { create } from 'zustand';
import { agendamentosService } from '../services';
import { Agendamento } from '../types';

interface AgendamentosStore {
  agendamentos: Agendamento[];
  agendamentoAtual: Agendamento | null;
  isLoading: boolean;
  loadAgendamentos: (params?: {
    barbearia_id?: number | string;
    data?: string;
    data_inicio?: string;
    data_fim?: string;
    colaborador_id?: number | string;
    status?: string;
  }) => Promise<void>;
  getAgendamento: (id: number | string) => Promise<void>;
  createAgendamento: (data: any) => Promise<Agendamento>;
  updateAgendamento: (id: number | string, data: any) => Promise<void>;
  deleteAgendamento: (id: number | string, barbearia_id: number | string) => Promise<void>;
  updateStatus: (id: number | string, status: string, barbearia_id: number | string) => Promise<void>;
  iniciarAtendimento: (id: number | string, barbearia_id: number | string) => Promise<void>;
  cancelarAgendamento: (id: number | string, barbearia_id: number | string) => Promise<void>;
}

export const useAgendamentosStore = create<AgendamentosStore>((set, get) => ({
  agendamentos: [],
  agendamentoAtual: null,
  isLoading: false,

  loadAgendamentos: async (params) => {
    set({ isLoading: true });
    try {
      const agendamentos = await agendamentosService.getAgendamentos(params);
      set({ agendamentos: Array.isArray(agendamentos) ? agendamentos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, agendamentos: [] });
      throw error;
    }
  },

  getAgendamento: async (id: number | string) => {
    set({ isLoading: true });
    try {
      const agendamento = await agendamentosService.getAgendamento(id);
      set({ agendamentoAtual: agendamento, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createAgendamento: async (data: any) => {
    set({ isLoading: true });
    try {
      const agendamento = await agendamentosService.createAgendamento(data);
      set((state) => ({
        agendamentos: [...state.agendamentos, agendamento],
        isLoading: false,
      }));
      return agendamento;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateAgendamento: async (id: number | string, data: any) => {
    set({ isLoading: true });
    try {
      const agendamento = await agendamentosService.updateAgendamento(id, data);
      set((state) => ({
        agendamentos: state.agendamentos.map((a) => (a.id === id.toString() ? agendamento : a)),
        agendamentoAtual: state.agendamentoAtual?.id === id.toString() ? agendamento : state.agendamentoAtual,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteAgendamento: async (id: number | string, barbearia_id: number | string) => {
    set({ isLoading: true });
    try {
      await agendamentosService.deleteAgendamento(id, barbearia_id);
      set((state) => ({
        agendamentos: state.agendamentos.filter((a) => a.id !== id.toString()),
        agendamentoAtual: state.agendamentoAtual?.id === id.toString() ? null : state.agendamentoAtual,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateStatus: async (id: number | string, status: string, barbearia_id: number | string) => {
    set({ isLoading: true });
    try {
      const agendamento = await agendamentosService.updateStatus(id, status, barbearia_id);
      set((state) => ({
        agendamentos: state.agendamentos.map((a) => (a.id === id.toString() ? agendamento : a)),
        agendamentoAtual: state.agendamentoAtual?.id === id.toString() ? agendamento : state.agendamentoAtual,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  iniciarAtendimento: async (id: number | string, barbearia_id: number | string) => {
    set({ isLoading: true });
    try {
      await get().updateStatus(id, 'em_andamento', barbearia_id);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  cancelarAgendamento: async (id: number | string, barbearia_id: number | string) => {
    set({ isLoading: true });
    try {
      await get().updateStatus(id, 'cancelado', barbearia_id);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

