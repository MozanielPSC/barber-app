import { create } from 'zustand';
import { poteService } from '../services';
import {
  ConfiguracaoPote,
  PesoServico,
  PlanoAssinatura,
  Assinatura,
  DistribuicaoCompleta,
  ConsumoAssinatura,
  SaldoFichas,
  Pote,
} from '../types';

interface PoteStore {
  // Configurações
  configuracoes: ConfiguracaoPote[];
  pesosServicos: PesoServico[];
  
  // Planos
  planos: PlanoAssinatura[];
  
  // Assinaturas
  assinaturas: Assinatura[];
  consumos: ConsumoAssinatura[];
  
  // Distribuições
  distribuicoes: DistribuicaoCompleta[];
  potes: Pote[];
  
  isLoading: boolean;

  // Configurações
  loadConfiguracoes: (barbeariaId: string) => Promise<void>;
  loadConfiguracao: (barbeariaId: string, configuracaoId: string) => Promise<ConfiguracaoPote>;
  createConfiguracao: (barbeariaId: string, data: any) => Promise<void>;
  updateConfiguracao: (barbeariaId: string, configuracaoId: string, data: any) => Promise<void>;
  deleteConfiguracao: (barbeariaId: string, configuracaoId: string) => Promise<void>;
  
  // Pesos
  loadPesosServicos: (barbeariaId: string, configuracaoPoteId: string) => Promise<void>;
  salvarPesoServico: (barbeariaId: string, configuracaoPoteId: string, servicoId: string, pesoEmFichas: number) => Promise<void>;
  deletarPesoServico: (barbeariaId: string, configuracaoPoteId: string, servicoId: string) => Promise<void>;
  
  // Planos
  loadPlanos: (barbeariaId: string, apenasAtivos?: boolean) => Promise<void>;
  loadPlano: (barbeariaId: string, planoId: string) => Promise<PlanoAssinatura>;
  criarPlano: (barbeariaId: string, data: any) => Promise<void>;
  atualizarPlano: (barbeariaId: string, planoId: string, data: any) => Promise<void>;
  deletarPlano: (barbeariaId: string, planoId: string) => Promise<void>;
  
  // Assinaturas
  loadAssinaturas: (barbeariaId: string, filtros?: any) => Promise<void>;
  loadAssinatura: (assinaturaId: string) => Promise<Assinatura>;
  comprarAssinatura: (barbeariaId: string, data: any) => Promise<void>;
  renovarAssinatura: (assinaturaId: string) => Promise<void>;
  cancelarAssinatura: (assinaturaId: string) => Promise<void>;
  buscarSaldoFichas: (clienteId: string, barbeariaId: string) => Promise<SaldoFichas>;
  loadConsumos: (assinaturaId: string) => Promise<void>;
  
  // Distribuições
  loadDistribuicoes: (barbeariaId: string, limite?: number) => Promise<void>;
  loadDistribuicao: (barbeariaId: string, distribuicaoId: string) => Promise<DistribuicaoCompleta>;
  loadDistribuicoesColaborador: (colaboradorId: string, limite?: number) => Promise<void>;
  processarDistribuicao: (barbeariaId: string, periodo: string) => Promise<void>;
  
  // Potes
  loadPotes: (barbeariaId: string, limite?: number) => Promise<void>;
  loadPotePeriodo: (barbeariaId: string, periodo: string) => Promise<any>;
  loadMovimentacoes: (barbeariaId: string, periodo: string) => Promise<any>;
  
  // Getters
  configuracoesAtivas: () => ConfiguracaoPote[];
  planosAtivos: () => PlanoAssinatura[];
  assinaturasAtivas: () => Assinatura[];
}

export const usePoteStore = create<PoteStore>((set, get) => ({
  configuracoes: [],
  pesosServicos: [],
  planos: [],
  assinaturas: [],
  consumos: [],
  distribuicoes: [],
  potes: [],
  isLoading: false,

  // Configurações
  loadConfiguracoes: async (barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const configuracoes = await poteService.getConfiguracoes(barbeariaId);
      set({ configuracoes: Array.isArray(configuracoes) ? configuracoes : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, configuracoes: [] });
      throw error;
    }
  },

  loadConfiguracao: async (barbeariaId: string, configuracaoId: string) => {
    try {
      return await poteService.getConfiguracao(barbeariaId, configuracaoId);
    } catch (error) {
      throw error;
    }
  },

  createConfiguracao: async (barbeariaId: string, data: any) => {
    set({ isLoading: true });
    try {
      const configuracao = await poteService.createConfiguracao(barbeariaId, data);
      set((state) => ({
        configuracoes: [...state.configuracoes, configuracao],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateConfiguracao: async (barbeariaId: string, configuracaoId: string, data: any) => {
    set({ isLoading: true });
    try {
      const configuracao = await poteService.updateConfiguracao(barbeariaId, configuracaoId, data);
      set((state) => ({
        configuracoes: state.configuracoes.map((c) => (c.id === configuracaoId ? configuracao : c)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteConfiguracao: async (barbeariaId: string, configuracaoId: string) => {
    set({ isLoading: true });
    try {
      await poteService.deleteConfiguracao(barbeariaId, configuracaoId);
      set((state) => ({
        configuracoes: state.configuracoes.filter((c) => c.id !== configuracaoId),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Pesos
  loadPesosServicos: async (barbeariaId: string, configuracaoPoteId: string) => {
    set({ isLoading: true });
    try {
      const pesos = await poteService.getPesosServicos(barbeariaId, configuracaoPoteId);
      set({ pesosServicos: Array.isArray(pesos) ? pesos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, pesosServicos: [] });
      throw error;
    }
  },

  salvarPesoServico: async (barbeariaId: string, configuracaoPoteId: string, servicoId: string, pesoEmFichas: number) => {
    set({ isLoading: true });
    try {
      const peso = await poteService.savePesoServico(barbeariaId, configuracaoPoteId, {
        servico_id: servicoId,
        peso_em_fichas: pesoEmFichas,
      });
      set((state) => ({
        pesosServicos: [...state.pesosServicos.filter((p) => p.servico_id !== servicoId), peso],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deletarPesoServico: async (barbeariaId: string, configuracaoPoteId: string, servicoId: string) => {
    set({ isLoading: true });
    try {
      await poteService.deletePesoServico(barbeariaId, configuracaoPoteId, servicoId);
      set((state) => ({
        pesosServicos: state.pesosServicos.filter((p) => p.servico_id !== servicoId),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Planos
  loadPlanos: async (barbeariaId: string, apenasAtivos?: boolean) => {
    set({ isLoading: true });
    try {
      const planos = await poteService.getPlanos(barbeariaId, apenasAtivos);
      set({ planos: Array.isArray(planos) ? planos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, planos: [] });
      throw error;
    }
  },

  loadPlano: async (barbeariaId: string, planoId: string) => {
    try {
      return await poteService.getPlano(barbeariaId, planoId);
    } catch (error) {
      throw error;
    }
  },

  criarPlano: async (barbeariaId: string, data: any) => {
    set({ isLoading: true });
    try {
      const plano = await poteService.createPlano(barbeariaId, data);
      set((state) => ({
        planos: [...state.planos, plano],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  atualizarPlano: async (barbeariaId: string, planoId: string, data: any) => {
    set({ isLoading: true });
    try {
      const plano = await poteService.updatePlano(barbeariaId, planoId, data);
      set((state) => ({
        planos: state.planos.map((p) => (p.id === planoId ? plano : p)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deletarPlano: async (barbeariaId: string, planoId: string) => {
    set({ isLoading: true });
    try {
      await poteService.deletePlano(barbeariaId, planoId);
      set((state) => ({
        planos: state.planos.filter((p) => p.id !== planoId),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Assinaturas
  loadAssinaturas: async (barbeariaId: string, filtros?: any) => {
    set({ isLoading: true });
    try {
      const assinaturas = await poteService.getAssinaturas(barbeariaId, filtros);
      set({ assinaturas: Array.isArray(assinaturas) ? assinaturas : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, assinaturas: [] });
      throw error;
    }
  },

  loadAssinatura: async (assinaturaId: string) => {
    try {
      return await poteService.getAssinatura(assinaturaId);
    } catch (error) {
      throw error;
    }
  },

  comprarAssinatura: async (barbeariaId: string, data: any) => {
    set({ isLoading: true });
    try {
      const assinatura = await poteService.createAssinatura(barbeariaId, data);
      set((state) => ({
        assinaturas: [assinatura, ...state.assinaturas],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  renovarAssinatura: async (assinaturaId: string) => {
    set({ isLoading: true });
    try {
      const assinatura = await poteService.renovarAssinatura(assinaturaId);
      set((state) => ({
        assinaturas: state.assinaturas.map((a) => (a.id === assinaturaId ? assinatura : a)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  cancelarAssinatura: async (assinaturaId: string) => {
    set({ isLoading: true });
    try {
      const assinatura = await poteService.cancelarAssinatura(assinaturaId);
      set((state) => ({
        assinaturas: state.assinaturas.map((a) => (a.id === assinaturaId ? assinatura : a)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  buscarSaldoFichas: async (clienteId: string, barbeariaId: string) => {
    try {
      return await poteService.getSaldoFichas(clienteId, barbeariaId);
    } catch (error) {
      throw error;
    }
  },

  loadConsumos: async (assinaturaId: string) => {
    set({ isLoading: true });
    try {
      const consumos = await poteService.getConsumos(assinaturaId);
      set({ consumos: Array.isArray(consumos) ? consumos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, consumos: [] });
      throw error;
    }
  },

  // Distribuições
  loadDistribuicoes: async (barbeariaId: string, limite?: number) => {
    set({ isLoading: true });
    try {
      const distribuicoes = await poteService.getDistribuicoes(barbeariaId, limite);
      set({ distribuicoes: Array.isArray(distribuicoes) ? distribuicoes : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, distribuicoes: [] });
      throw error;
    }
  },

  loadDistribuicao: async (barbeariaId: string, distribuicaoId: string) => {
    try {
      return await poteService.getDistribuicao(barbeariaId, distribuicaoId);
    } catch (error) {
      throw error;
    }
  },

  loadDistribuicoesColaborador: async (colaboradorId: string, limite?: number) => {
    set({ isLoading: true });
    try {
      const distribuicoes = await poteService.getDistribuicoesColaborador(colaboradorId, limite);
      set({ distribuicoes: Array.isArray(distribuicoes) ? distribuicoes : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, distribuicoes: [] });
      throw error;
    }
  },

  processarDistribuicao: async (barbeariaId: string, periodo: string) => {
    set({ isLoading: true });
    try {
      const distribuicao = await poteService.processarDistribuicao(barbeariaId, periodo);
      set((state) => ({
        distribuicoes: [distribuicao, ...state.distribuicoes],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Potes
  loadPotes: async (barbeariaId: string, limite?: number) => {
    set({ isLoading: true });
    try {
      const potes = await poteService.getPotes(barbeariaId, limite);
      set({ potes: Array.isArray(potes) ? potes : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, potes: [] });
      throw error;
    }
  },

  loadPotePeriodo: async (barbeariaId: string, periodo: string) => {
    try {
      return await poteService.getPotePeriodo(barbeariaId, periodo);
    } catch (error) {
      throw error;
    }
  },

  loadMovimentacoes: async (barbeariaId: string, periodo: string) => {
    try {
      return await poteService.getMovimentacoes(barbeariaId, periodo);
    } catch (error) {
      throw error;
    }
  },

  // Getters
  configuracoesAtivas: () => {
    const { configuracoes } = get();
    return configuracoes.filter((c) => c.ativo);
  },

  planosAtivos: () => {
    const { planos } = get();
    return planos.filter((p) => p.ativo);
  },

  assinaturasAtivas: () => {
    const { assinaturas } = get();
    return assinaturas.filter((a) => a.status === 'ativa');
  },
}));

