import { create } from 'zustand';
import { gastosService } from '../services';
import { GastoColaborador, TotaisGastos } from '../types';

interface GastosStore {
  gastos: GastoColaborador[];
  totais: TotaisGastos;
  isLoading: boolean;

  listarGastos: (barbeariaId: string, filtros?: any) => Promise<void>;
  buscarGasto: (id: string, barbeariaId: string) => Promise<GastoColaborador>;
  criarGasto: (data: any, barbeariaId: string) => Promise<void>;
  criarGastosParcelados: (dados: any, barbeariaId: string) => Promise<void>;
  atualizarGasto: (id: string, data: any, barbeariaId: string) => Promise<void>;
  marcarComoPago: (id: string, barbeariaId: string, dataPagamento?: string) => Promise<void>;
  deletarGasto: (id: string, barbeariaId: string) => Promise<void>;
  carregarTotais: (barbeariaId: string, mes?: string) => Promise<void>;
  carregarGastosPendentes: (colaboradorId: string, barbeariaId: string) => Promise<void>;
  carregarGastosAtrasados: (barbeariaId: string) => Promise<void>;
  
  // Getters
  totalPendente: () => number;
  totalPago: () => number;
  totalAtrasado: () => number;
  totalGeral: () => number;
}

export const useGastosStore = create<GastosStore>((set, get) => ({
  gastos: [],
  totais: { pendente: 0, pago: 0, atrasado: 0, geral: 0 },
  isLoading: false,

  listarGastos: async (barbeariaId: string, filtros?: any) => {
    set({ isLoading: true });
    try {
      const response = await gastosService.getGastos(barbeariaId, filtros);
      const gastos = response?.gastos || response || [];
      set({ gastos: Array.isArray(gastos) ? gastos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, gastos: [] });
      throw error;
    }
  },

  buscarGasto: async (id: string, barbeariaId: string) => {
    try {
      return await gastosService.getGasto(id, barbeariaId);
    } catch (error) {
      throw error;
    }
  },

  criarGasto: async (data: any, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const gasto = await gastosService.createGasto(data, barbeariaId);
      set((state) => ({
        gastos: [gasto, ...state.gastos],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  criarGastosParcelados: async (dados: any, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const { colaborador_id, descricao, valor_total, numero_parcelas, data_primeira_parcela, observacoes } = dados;
      const valorParcela = valor_total / numero_parcelas;
      
      const gastosCriados = [];
      for (let i = 0; i < numero_parcelas; i++) {
        const dataParcela = new Date(data_primeira_parcela);
        dataParcela.setMonth(dataParcela.getMonth() + i);
        
        const gasto = await gastosService.createGasto({
          colaborador_id,
          descricao: `${descricao} (${i + 1}/${numero_parcelas})`,
          valor_total: valorParcela,
          data_vencimento: dataParcela.toISOString().split('T')[0],
          observacoes,
        }, barbeariaId);
        
        gastosCriados.push(gasto);
      }
      
      set((state) => ({
        gastos: [...gastosCriados, ...state.gastos],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  atualizarGasto: async (id: string, data: any, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const gasto = await gastosService.updateGasto(id, data, barbeariaId);
      set((state) => ({
        gastos: state.gastos.map((g) => (g.id === id ? gasto : g)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  marcarComoPago: async (id: string, barbeariaId: string, dataPagamento?: string) => {
    set({ isLoading: true });
    try {
      const data = dataPagamento || new Date().toISOString().split('T')[0];
      const gasto = await gastosService.marcarComoPago(id, data, barbeariaId);
      set((state) => ({
        gastos: state.gastos.map((g) => (g.id === id ? gasto : g)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deletarGasto: async (id: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      await gastosService.deleteGasto(id, barbeariaId);
      set((state) => ({
        gastos: state.gastos.filter((g) => g.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  carregarTotais: async (barbeariaId: string, mes?: string) => {
    try {
      const totais = await gastosService.getTotais(barbeariaId, mes);
      set({ totais });
    } catch (error) {
      throw error;
    }
  },

  carregarGastosPendentes: async (colaboradorId: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const gastos = await gastosService.getGastosPendentes(colaboradorId, barbeariaId);
      set({ gastos: Array.isArray(gastos) ? gastos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, gastos: [] });
      throw error;
    }
  },

  carregarGastosAtrasados: async (barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const gastos = await gastosService.getGastosAtrasados(barbeariaId);
      set({ gastos: Array.isArray(gastos) ? gastos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, gastos: [] });
      throw error;
    }
  },

  // Getters
  totalPendente: () => {
    const { gastos } = get();
    return gastos
      .filter((g) => g.status === 'pendente')
      .reduce((sum, g) => sum + parseFloat(g.valor_total.toString()), 0);
  },

  totalPago: () => {
    const { gastos } = get();
    return gastos
      .filter((g) => g.status === 'pago')
      .reduce((sum, g) => sum + parseFloat(g.valor_total.toString()), 0);
  },

  totalAtrasado: () => {
    const { gastos } = get();
    return gastos
      .filter((g) => g.status === 'atrasado')
      .reduce((sum, g) => sum + parseFloat(g.valor_total.toString()), 0);
  },

  totalGeral: () => {
    const { gastos } = get();
    return gastos.reduce((sum, g) => sum + parseFloat(g.valor_total.toString()), 0);
  },
}));

