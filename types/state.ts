import { User } from './auth';
import { Barbearia, Colaborador } from './barbearia';

// Interfaces de estado
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface BarbeariasState {
  barbearias: Barbearia[];
  barbeariaAtual: Barbearia | null;
  isLoading: boolean;
}

export interface ColaboradoresState {
  colaboradores: Colaborador[];
  isLoading: boolean;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}
