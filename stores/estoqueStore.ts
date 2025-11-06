import { create } from 'zustand';
import { estoqueService } from '../services';
import { Estoque, Prateleira, ProdutoEstoqueBaixo } from '../types';

interface EstoqueStore {
  estoque: Estoque[];
  prateleiras: Prateleira[];
  produtosEstoqueBaixo: ProdutoEstoqueBaixo[];
  isLoading: boolean;
  
  // Estoque
  carregarEstoqueAtual: (barbeariaId: string) => Promise<void>;
  carregarProdutosEstoqueBaixo: (barbeariaId: string) => Promise<void>;
  consultarEstoqueProduto: (produtoId: string, barbeariaId: string) => Promise<any>;
  
  // Prateleiras
  listarPrateleiras: (barbeariaId: string, filtros?: any) => Promise<void>;
  buscarPrateleira: (id: string) => Promise<Prateleira>;
  criarPrateleira: (data: any) => Promise<void>;
  atualizarPrateleira: (id: string, data: any) => Promise<void>;
  deletarPrateleira: (id: string) => Promise<void>;
  
  // Movimentações
  registrarEntrada: (data: any) => Promise<any>;
  registrarSaida: (data: any) => Promise<any>;
  ajustarEstoque: (data: any) => Promise<any>;
  transferirEstoque: (data: any) => Promise<any>;
  
  // Getters
  totalProdutosEstoque: () => number;
  valorTotalEstoque: () => number;
  prateleirasAtivas: () => Prateleira[];
  estoquePorPrateleira: (prateleiraId: string) => Estoque[];
  quantidadeDisponivel: (produtoId: string, prateleiraId?: string) => number;
}

export const useEstoqueStore = create<EstoqueStore>((set, get) => ({
  estoque: [],
  prateleiras: [],
  produtosEstoqueBaixo: [],
  isLoading: false,

  // Estoque
  carregarEstoqueAtual: async (barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const response = await estoqueService.getEstoque(barbeariaId);
      const estoque = response?.estoque || response || [];
      set({ estoque: Array.isArray(estoque) ? estoque : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, estoque: [] });
      throw error;
    }
  },

  carregarProdutosEstoqueBaixo: async (barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const response = await estoqueService.getEstoqueBaixo(barbeariaId);
      const produtos = response?.produtos || response || [];
      set({ produtosEstoqueBaixo: Array.isArray(produtos) ? produtos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, produtosEstoqueBaixo: [] });
      throw error;
    }
  },

  consultarEstoqueProduto: async (produtoId: string, barbeariaId: string) => {
    try {
      return await estoqueService.consultarEstoqueProduto(produtoId, barbeariaId);
    } catch (error) {
      throw error;
    }
  },

  // Prateleiras
  listarPrateleiras: async (barbeariaId: string, filtros?: any) => {
    set({ isLoading: true });
    try {
      const response = await estoqueService.getPrateleiras(barbeariaId, filtros);
      const prateleiras = response?.prateleiras || response || [];
      set({ prateleiras: Array.isArray(prateleiras) ? prateleiras : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, prateleiras: [] });
      throw error;
    }
  },

  buscarPrateleira: async (id: string) => {
    try {
      return await estoqueService.getPrateleira(id);
    } catch (error) {
      throw error;
    }
  },

  criarPrateleira: async (data: any) => {
    set({ isLoading: true });
    try {
      const prateleira = await estoqueService.createPrateleira(data);
      set((state) => ({
        prateleiras: [...state.prateleiras, prateleira],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  atualizarPrateleira: async (id: string, data: any) => {
    set({ isLoading: true });
    try {
      const prateleira = await estoqueService.updatePrateleira(id, data);
      set((state) => ({
        prateleiras: state.prateleiras.map((p) => (p.id === id ? prateleira : p)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deletarPrateleira: async (id: string) => {
    set({ isLoading: true });
    try {
      await estoqueService.deletePrateleira(id);
      set((state) => ({
        prateleiras: state.prateleiras.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Movimentações
  registrarEntrada: async (data: any) => {
    set({ isLoading: true });
    try {
      const response = await estoqueService.registrarEntrada(data);
      // Recarrega estoque
      await get().carregarEstoqueAtual(data.barbearia_id);
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  registrarSaida: async (data: any) => {
    set({ isLoading: true });
    try {
      const response = await estoqueService.registrarSaida(data);
      // Recarrega estoque
      await get().carregarEstoqueAtual(data.barbearia_id);
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  ajustarEstoque: async (data: any) => {
    set({ isLoading: true });
    try {
      const response = await estoqueService.registrarAjuste(data);
      // Recarrega estoque
      await get().carregarEstoqueAtual(data.barbearia_id);
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  transferirEstoque: async (data: any) => {
    set({ isLoading: true });
    try {
      const response = await estoqueService.registrarTransferencia(data);
      // Recarrega estoque
      await get().carregarEstoqueAtual(data.barbearia_id);
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Getters
  totalProdutosEstoque: () => {
    const { estoque } = get();
    return estoque.reduce((total, item) => total + item.quantidade_atual, 0);
  },

  valorTotalEstoque: () => {
    const { estoque } = get();
    return estoque.reduce((total, item) => {
      const preco = parseFloat(item.produto?.preco_padrao || '0');
      return total + (preco * item.quantidade_atual);
    }, 0);
  },

  prateleirasAtivas: () => {
    const { prateleiras } = get();
    return prateleiras.filter((p) => p.ativa);
  },

  estoquePorPrateleira: (prateleiraId: string) => {
    const { estoque } = get();
    return estoque.filter((e) => e.prateleira_id === prateleiraId);
  },

  quantidadeDisponivel: (produtoId: string, prateleiraId?: string) => {
    const { estoque } = get();
    const itens = estoque.filter((e) => {
      if (prateleiraId) {
        return e.produto_id === produtoId && e.prateleira_id === prateleiraId;
      }
      return e.produto_id === produtoId;
    });
    return itens.reduce((total, item) => {
      return total + (item.quantidade_atual - item.quantidade_reservada);
    }, 0);
  },
}));

