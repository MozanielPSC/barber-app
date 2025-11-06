import { create } from 'zustand';
import { dashboardService, DashboardKPIsParams, DashboardKPIsResponse } from '../services';

interface DashboardStore {
  kpis: DashboardKPIsResponse | null;
  isLoading: boolean;
  filters: {
    periodo: 'hoje' | 'semana' | 'mes' | 'ano' | null;
    colaborador_id: number | null;
    mes: string | null; // YYYY-MM
    ano: number | null;
  };
  loadKPIs: (params?: DashboardKPIsParams) => Promise<void>;
  setFilter: (filter: Partial<DashboardStore['filters']>) => void;
  clearFilters: () => void;
}

const initialFilters = {
  periodo: null as const,
  colaborador_id: null,
  mes: null,
  ano: null,
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  kpis: null,
  isLoading: false,
  filters: initialFilters,

  loadKPIs: async (params?: DashboardKPIsParams) => {
    set({ isLoading: true });
    try {
      const filters = get().filters;
      
      // Converte filtros para parâmetros da API
      const apiParams: DashboardKPIsParams = {};
      
      if (filters.colaborador_id) {
        apiParams.colaborador_id = filters.colaborador_id;
      }
      
      if (filters.mes) {
        apiParams.mes = filters.mes;
      }
      
      if (filters.ano) {
        apiParams.ano = filters.ano;
      }
      
      // Se período rápido foi selecionado, calcula mês/ano
      if (filters.periodo) {
        const now = new Date();
        if (filters.periodo === 'hoje') {
          apiParams.mes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        } else if (filters.periodo === 'semana') {
          apiParams.mes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        } else if (filters.periodo === 'mes') {
          apiParams.mes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        } else if (filters.periodo === 'ano') {
          apiParams.ano = now.getFullYear();
        }
      }
      
      // Merge com parâmetros passados diretamente
      const finalParams = { ...apiParams, ...params };
      
      const kpis = await dashboardService.getKPIs(finalParams);
      set({ kpis, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setFilter: (filter) => {
    set((state) => ({
      filters: { ...state.filters, ...filter },
    }));
  },

  clearFilters: () => {
    set({ filters: initialFilters });
  },
}));

