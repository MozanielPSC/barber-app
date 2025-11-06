import apiClient from './apiClient';

export interface DashboardKPIsResponse {
  servicesToday?: number;
  productsToday?: number;
  servicesMonth?: number;
  productsMonth?: number;
  commissionToday?: number;
  commissionMonth?: number;
  servicesProgress?: number;
  productsProgress?: number;
  indicationsCount?: number;
}

export interface DashboardKPIsParams {
  colaborador_id?: number;
  mes?: string; // YYYY-MM
  ano?: number;
}

export const dashboardService = {
  getKPIs: (params?: DashboardKPIsParams): Promise<DashboardKPIsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.colaborador_id) {
      queryParams.append('colaborador_id', params.colaborador_id.toString());
    }
    if (params?.mes) {
      queryParams.append('mes', params.mes);
    }
    if (params?.ano) {
      queryParams.append('ano', params.ano.toString());
    }

    const queryString = queryParams.toString();
    const url = `/dashboard/kpis${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(url);
  },
};

