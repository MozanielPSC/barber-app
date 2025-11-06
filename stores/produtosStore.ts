import { create } from 'zustand';
import { produtosService } from '../services';
import { Product } from '../types';

interface ProdutosStore {
  produtos: Product[];
  isLoading: boolean;
  loadProdutos: (barbeariaId: string) => Promise<void>;
  getProduto: (id: string) => Product | undefined;
  createProduto: (data: any) => Promise<void>;
  updateProduto: (id: string, data: any) => Promise<void>;
  deleteProduto: (id: string, barbeariaId: string) => Promise<void>;
}

export const useProdutosStore = create<ProdutosStore>((set, get) => ({
  produtos: [],
  isLoading: false,

  loadProdutos: async (barbeariaId: string) => {
    set({ isLoading: true });
    try {
      const produtos = await produtosService.getProdutos(barbeariaId);
      set({ produtos: Array.isArray(produtos) ? produtos : [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, produtos: [] });
      throw error;
    }
  },

  getProduto: (id: string) => {
    const { produtos } = get();
    return produtos.find((p) => p.id === id);
  },

  createProduto: async (data: any) => {
    set({ isLoading: true });
    try {
      const produto = await produtosService.createProduto(data);
      set((state) => ({
        produtos: [...state.produtos, produto],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProduto: async (id: string, data: any) => {
    set({ isLoading: true });
    try {
      const produto = await produtosService.updateProduto(id, data);
      set((state) => ({
        produtos: state.produtos.map((p) => (p.id === id ? produto : p)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteProduto: async (id: string, barbeariaId: string) => {
    set({ isLoading: true });
    try {
      await produtosService.deleteProduto(id, barbeariaId);
      set((state) => ({
        produtos: state.produtos.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

