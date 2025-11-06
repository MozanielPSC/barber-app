import { create } from 'zustand';
import { clientesService } from '../services';
import { Cliente } from '../types/clientes';

interface ClientesStore {
  clientes: Cliente[];
  clienteAtual: Cliente | null;
  isLoading: boolean;
  loadClientes: (params?: { barbearia_id?: string | number; busca?: string }) => Promise<void>;
  getCliente: (id: string | number) => Cliente | null;
  createCliente: (data: any) => Promise<Cliente>;
  createClienteAudio: (audioFile: any, barbearia_id: string) => Promise<Cliente>;
  updateCliente: (id: string | number, data: any) => Promise<Cliente>;
  deleteCliente: (id: string | number) => Promise<void>;
}

export const useClientesStore = create<ClientesStore>((set, get) => ({
  clientes: [],
  clienteAtual: null,
  isLoading: false,

  loadClientes: async (params?: { barbearia_id?: string | number; busca?: string }) => {
    set({ isLoading: true });
    try {
      const clientes = await clientesService.getClientes(params);
      set({ clientes: Array.isArray(clientes) ? clientes : [], isLoading: false });
    } catch (error) {
      set({ clientes: [], isLoading: false });
      throw error;
    }
  },

  getCliente: (id: string | number) => {
    const { clientes } = get();
    return clientes.find((c) => c.id === String(id)) || null;
  },

  createCliente: async (data: any) => {
    set({ isLoading: true });
    try {
      const cliente = await clientesService.createCliente(data);
      set((state) => ({
        clientes: [...state.clientes, cliente],
        isLoading: false,
      }));
      return cliente;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createClienteAudio: async (audioFile: any, barbearia_id: string) => {
    set({ isLoading: true });
    try {
      const cliente = await clientesService.createClienteAudio(audioFile, barbearia_id);
      set((state) => ({
        clientes: [...state.clientes, cliente],
        isLoading: false,
      }));
      return cliente;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateCliente: async (id: string | number, data: any) => {
    set({ isLoading: true });
    try {
      const cliente = await clientesService.updateCliente(id, data);
      set((state) => ({
        clientes: state.clientes.map((c) => (c.id === String(id) ? cliente : c)),
        isLoading: false,
      }));
      return cliente;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteCliente: async (id: string | number) => {
    set({ isLoading: true });
    try {
      // Nota: A API não tem DELETE, então apenas remove do state local
      set((state) => ({
        clientes: state.clientes.filter((c) => c.id !== String(id)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
