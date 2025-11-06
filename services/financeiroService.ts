import apiClient from './apiClient';

export const financeiroService = {
  // Dashboard
  getMetricasDashboard: (mes: string, barbeariaId: string) => {
    return apiClient.get('/financeiro/dashboard/metricas', {
      params: { mes, barbearia_id: barbeariaId }
    });
  },

  getHistoricoFaturamento: (ano: string, barbeariaId: string) => {
    return apiClient.get('/financeiro/dashboard/historico-faturamento', {
      params: { ano, barbearia_id: barbeariaId }
    });
  },

  getFaturamentoCategoria: (mes: string, barbeariaId: string) => {
    return apiClient.get('/financeiro/dashboard/faturamento-categoria', {
      params: { mes, barbearia_id: barbeariaId }
    });
  },

  getDespesasCategoria: (mes: string, barbeariaId: string) => {
    return apiClient.get('/financeiro/dashboard/despesas-categoria', {
      params: { mes, barbearia_id: barbeariaId }
    });
  },

  // Despesas Fixas
  getDespesasFixas: (barbeariaId: string) => {
    return apiClient.get('/financeiro/despesas-fixas', {
      params: { barbearia_id: barbeariaId }
    });
  },

  createDespesaFixa: (data: any) => {
    return apiClient.post('/financeiro/despesas-fixas', data);
  },

  // Despesas Variáveis
  getDespesasVariaveis: (barbeariaId: string) => {
    return apiClient.get('/financeiro/despesas-variaveis', {
      params: { barbearia_id: barbeariaId }
    });
  },

  createDespesaVariavel: (data: any) => {
    return apiClient.post('/financeiro/despesas-variaveis', data);
  },

  // Canais de Marketing
  getCanais: (barbeariaId: string) => {
    return apiClient.get('/financeiro/canais', {
      params: { barbearia_id: barbeariaId }
    });
  },

  createCanal: (data: any) => {
    return apiClient.post('/financeiro/canais', data);
  },
};

export const gastosService = {
  getGastos: (barbeariaId: string, filtros?: any) => {
    return apiClient.get('/gastos-colaborador', {
      params: { barbearia_id: barbeariaId, ...filtros }
    });
  },

  getGasto: (id: string, barbeariaId: string) => {
    return apiClient.get(`/gastos-colaborador/${id}`, {
      params: { barbearia_id: barbeariaId }
    });
  },

  createGasto: (data: any, barbeariaId: string) => {
    return apiClient.post('/gastos-colaborador', data, {
      params: { barbearia_id: barbeariaId }
    });
  },

  updateGasto: (id: string, data: any, barbeariaId: string) => {
    return apiClient.put(`/gastos-colaborador/${id}`, data, {
      params: { barbearia_id: barbeariaId }
    });
  },

  marcarComoPago: (id: string, dataPagamento: string, barbeariaId: string) => {
    return apiClient.put(`/gastos-colaborador/${id}/pagar`, 
      { data_pagamento: dataPagamento },
      { params: { barbearia_id: barbeariaId } }
    );
  },

  deleteGasto: (id: string, barbeariaId: string) => {
    return apiClient.delete(`/gastos-colaborador/${id}`, {
      params: { barbearia_id: barbeariaId }
    });
  },

  getTotais: (barbeariaId: string, mes?: string) => {
    return apiClient.get('/gastos-colaborador/totais', {
      params: { barbearia_id: barbeariaId, mes }
    });
  },

  getGastosPendentes: (colaboradorId: string, barbeariaId: string) => {
    return apiClient.get(`/gastos-colaborador/pendentes/${colaboradorId}`, {
      params: { barbearia_id: barbeariaId }
    });
  },

  getGastosAtrasados: (barbeariaId: string) => {
    return apiClient.get('/gastos-colaborador/atrasados', {
      params: { barbearia_id: barbeariaId }
    });
  },
};

