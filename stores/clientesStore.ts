import { create } from 'zustand';
import { clientesService } from '../services';
import { Client } from '../types';

interface ClientesStore {
  clientes: Client[];
  isLoading: boolean;
  loadClientes: (params?: any) => Promise<void>;
  createCliente: (data: any) => Promise<void>;
  updateCliente: (id: number, data: any) => Promise<void>;
  deleteCliente: (id: number) => Promise<void>;
}

export const useClientesStore = create<ClientesStore>((set, get) => ({
  clientes: [],
  isLoading: false,

  loadClientes: async (params?: any) => {
    set({ isLoading: true });
    try {
      const clientes = await clientesService.getClientes(params);
      set({ clientes, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createCliente: async (data: any) => {
    set({ isLoading: true });
    try {
      const cliente = await clientesService.createCliente(data);
      set((state) => ({
        clientes: [...state.clientes, cliente],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateCliente: async (id: number, data: any) => {
    set({ isLoading: true });
    try {
      const cliente = await clientesService.updateCliente(id, data);
      set((state) => ({
        clientes: state.clientes.map((c) => (c.id === id ? cliente : c)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteCliente: async (id: number) => {
    set({ isLoading: true });
    try {
      await clientesService.deleteCliente(id);
      set((state) => ({
        clientes: state.clientes.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
