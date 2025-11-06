import { create } from 'zustand';
import { financeiroService } from '../services';
import {
  MetricasDashboard,
  HistoricoFaturamento,
  FaturamentoCategoria,
  DespesasCategoria,
  DespesaFixa,
  DespesaVariavel,
  CanalMarketing,
} from '../types';

interface FinanceiroStore {
  // Dashboard
  metricas: MetricasDashboard | null;
  historicoFaturamento: HistoricoFaturamento[];
  faturamentoCategoria: FaturamentoCategoria | null;
  despesasCategoria: DespesasCategoria | null;
  
  // Despesas
  despesasFixas: DespesaFixa[];
  despesasVariaveis: DespesaVariavel[];
  canais: CanalMarketing[];
  
  isLoading: boolean;

  // Dashboard
  loadMetricasDashboard: (mes: string, barbeariaId: string) => Promise<void>;
  loadHistoricoFaturamento: (ano: string, barbeariaId: string) => Promise<void>;
  loadFaturamentoCategoria: (mes: string, barbeariaId: string) => Promise<void>;
  loadDespesasCategoria: (mes: string, barbeariaId: string) => Promise<void>;

  // Despesas Fixas
  loadDespesasFixas: (barbeariaId: string) => Promise<void>;
  addDespesaFixa: (despesa: any, barbeariaId: string) => Promise<void>;
  updateDespesaFixa: (index: number, valor: number) => void;
  deleteDespesaFixa: (index: number) => void;

  // Despesas Variáveis
  loadDespesasVariaveis: (barbeariaId: string) => Promise<void>;
  addDespesaVariavel: (despesa: any, barbeariaId: string) => Promise<void>;
  updateDespesaVariavel: (index: number, valor: number) => void;
  deleteDespesaVariavel: (index: number) => void;

  // Canais
  loadCanais: (barbeariaId: string) => Promise<void>;
  addCanal: (canal: any, barbeariaId: string) => Promise<void>;
  updateCanal: (index: number, updates: Partial<CanalMarketing>) => void;
  deleteCanal: (index: number) => void;
}

export const useFinanceiroStore = create<FinanceiroStore>((set, get) => ({
  metricas: null,
  historicoFaturamento: [],
  faturamentoCategoria: null,
  despesasCategoria: null,
  despesasFixas: [],
  despesasVariaveis: [],
  canais: [],
  isLoading: false,

  // Dashboard
  loadMetricasDashboard: async (mes: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const metricas = await financeiroService.getMetricasDashboard(mes, barbeariaId);
      set({ metricas, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadHistoricoFaturamento: async (ano: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const response = await financeiroService.getHistoricoFaturamento(ano, barbeariaId);
      const historico = response?.historico || [];
      set({ historicoFaturamento: historico, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadFaturamentoCategoria: async (mes: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const faturamentoCategoria = await financeiroService.getFaturamentoCategoria(mes, barbeariaId);
      set({ faturamentoCategoria, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadDespesasCategoria: async (mes: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const despesasCategoria = await financeiroService.getDespesasCategoria(mes, barbeariaId);
      set({ despesasCategoria, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Despesas Fixas
  loadDespesasFixas: async (barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const despesas = await financeiroService.getDespesasFixas(barbeariaId);
      set({ despesasFixas: Array.isArray(despesas) ? despesas : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, despesasFixas: [] });
      throw error;
    }
  },

  addDespesaFixa: async (despesa: any, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const novaDespesa = await financeiroService.createDespesaFixa({
        ...despesa,
        barbearia_id: barbeariaId,
        mes_referencia: new Date().toISOString().slice(0, 7), // YYYY-MM
      });
      set((state) => ({
        despesasFixas: [...state.despesasFixas, novaDespesa],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateDespesaFixa: (index: number, valor: number) => {
    set((state) => ({
      despesasFixas: state.despesasFixas.map((d, i) =>
        i === index ? { ...d, valor } : d
      ),
    }));
  },

  deleteDespesaFixa: (index: number) => {
    set((state) => ({
      despesasFixas: state.despesasFixas.filter((_, i) => i !== index),
    }));
  },

  // Despesas Variáveis
  loadDespesasVariaveis: async (barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const despesas = await financeiroService.getDespesasVariaveis(barbeariaId);
      set({ despesasVariaveis: Array.isArray(despesas) ? despesas : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, despesasVariaveis: [] });
      throw error;
    }
  },

  addDespesaVariavel: async (despesa: any, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const novaDespesa = await financeiroService.createDespesaVariavel({
        ...despesa,
        barbearia_id: barbeariaId,
        mes_referencia: new Date().toISOString().slice(0, 7),
      });
      set((state) => ({
        despesasVariaveis: [...state.despesasVariaveis, novaDespesa],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateDespesaVariavel: (index: number, valor: number) => {
    set((state) => ({
      despesasVariaveis: state.despesasVariaveis.map((d, i) =>
        i === index ? { ...d, valor } : d
      ),
    }));
  },

  deleteDespesaVariavel: (index: number) => {
    set((state) => ({
      despesasVariaveis: state.despesasVariaveis.filter((_, i) => i !== index),
    }));
  },

  // Canais
  loadCanais: async (barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const canais = await financeiroService.getCanais(barbeariaId);
      set({ canais: Array.isArray(canais) ? canais : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, canais: [] });
      throw error;
    }
  },

  addCanal: async (canal: any, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const novoCanal = await financeiroService.createCanal({
        ...canal,
        barbearia_id: barbeariaId,
        mes_referencia: new Date().toISOString().slice(0, 7),
      });
      set((state) => ({
        canais: [...state.canais, novoCanal],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateCanal: (index: number, updates: Partial<CanalMarketing>) => {
    set((state) => ({
      canais: state.canais.map((c, i) =>
        i === index ? { ...c, ...updates } : c
      ),
    }));
  },

  deleteCanal: (index: number) => {
    set((state) => ({
      canais: state.canais.filter((_, i) => i !== index),
    }));
  },
}));

