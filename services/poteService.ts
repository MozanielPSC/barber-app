import apiClient from './apiClient';

export const poteService = {
  // Configurações
  getConfiguracoes: (barbeariaId: string) => {
    return apiClient.get(`/pote/configuracoes/${barbeariaId}`);
  },

  getConfiguracao: (barbeariaId: string, configuracaoId: string) => {
    return apiClient.get(`/pote/configuracoes/${barbeariaId}/${configuracaoId}`);
  },

  createConfiguracao: (barbeariaId: string, data: any) => {
    return apiClient.post(`/pote/configuracoes/${barbeariaId}`, data);
  },

  updateConfiguracao: (barbeariaId: string, configuracaoId: string, data: any) => {
    return apiClient.put(`/pote/configuracoes/${barbeariaId}/${configuracaoId}`, data);
  },

  deleteConfiguracao: (barbeariaId: string, configuracaoId: string) => {
    return apiClient.delete(`/pote/configuracoes/${barbeariaId}/${configuracaoId}`);
  },

  // Pesos de Serviços
  getPesosServicos: (barbeariaId: string, configuracaoPoteId: string) => {
    return apiClient.get(`/pote/pesos/${barbeariaId}/${configuracaoPoteId}`);
  },

  savePesoServico: (barbeariaId: string, configuracaoPoteId: string, data: any) => {
    return apiClient.post(`/pote/pesos/${barbeariaId}/${configuracaoPoteId}`, data);
  },

  deletePesoServico: (barbeariaId: string, configuracaoPoteId: string, servicoId: string) => {
    return apiClient.delete(`/pote/pesos/${barbeariaId}/${configuracaoPoteId}/${servicoId}`);
  },

  // Planos
  getPlanos: (barbeariaId: string, apenasAtivos?: boolean) => {
    return apiClient.get(`/pote/planos/${barbeariaId}`, {
      params: apenasAtivos ? { apenas_ativos: true } : {}
    });
  },

  getPlano: (barbeariaId: string, planoId: string) => {
    return apiClient.get(`/pote/planos/${barbeariaId}/${planoId}`);
  },

  createPlano: (barbeariaId: string, data: any) => {
    return apiClient.post(`/pote/planos/${barbeariaId}`, data);
  },

  updatePlano: (barbeariaId: string, planoId: string, data: any) => {
    return apiClient.put(`/pote/planos/${barbeariaId}/${planoId}`, data);
  },

  deletePlano: (barbeariaId: string, planoId: string) => {
    return apiClient.delete(`/pote/planos/${barbeariaId}/${planoId}`);
  },

  // Assinaturas
  getAssinaturas: (barbeariaId: string, filtros?: any) => {
    return apiClient.get('/pote/assinaturas', {
      params: { barbearia_id: barbeariaId, ...filtros }
    });
  },

  getAssinatura: (assinaturaId: string) => {
    return apiClient.get(`/pote/assinaturas/${assinaturaId}`);
  },

  createAssinatura: (barbeariaId: string, data: any) => {
    return apiClient.post(`/pote/assinaturas/${barbeariaId}`, data);
  },

  renovarAssinatura: (assinaturaId: string) => {
    return apiClient.post(`/pote/assinaturas/${assinaturaId}/renovar`);
  },

  cancelarAssinatura: (assinaturaId: string) => {
    return apiClient.post(`/pote/assinaturas/${assinaturaId}/cancelar`);
  },

  getSaldoFichas: (clienteId: string, barbeariaId: string) => {
    return apiClient.get(`/pote/assinaturas/saldo/${clienteId}/${barbeariaId}`);
  },

  getConsumos: (assinaturaId: string) => {
    return apiClient.get(`/pote/consumos/${assinaturaId}`);
  },

  // Distribuições
  getDistribuicoes: (barbeariaId: string, limite?: number) => {
    return apiClient.get(`/pote/distribuicoes/${barbeariaId}`, {
      params: limite ? { limite } : {}
    });
  },

  getDistribuicao: (barbeariaId: string, distribuicaoId: string) => {
    return apiClient.get(`/pote/distribuicoes/${barbeariaId}/${distribuicaoId}`);
  },

  getDistribuicoesColaborador: (colaboradorId: string, limite?: number) => {
    return apiClient.get(`/pote/distribuicoes/colaborador/${colaboradorId}`, {
      params: limite ? { limite } : {}
    });
  },

  processarDistribuicao: (barbeariaId: string, periodo: string) => {
    return apiClient.post(`/pote/distribuir/${barbeariaId}/${periodo}`);
  },

  // Potes
  getPotes: (barbeariaId: string, limite?: number) => {
    return apiClient.get(`/pote/${barbeariaId}`, {
      params: limite ? { limite } : {}
    });
  },

  getPotePeriodo: (barbeariaId: string, periodo: string) => {
    return apiClient.get(`/pote/${barbeariaId}/${periodo}`);
  },

  getMovimentacoes: (barbeariaId: string, periodo: string) => {
    return apiClient.get(`/pote/${barbeariaId}/${periodo}/movimentacoes`);
  },
};

