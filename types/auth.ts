import { TipoUsuario } from './enums';

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  foto_perfil?: string;
  created_at: string;
  updated_at: string;
}

export interface Permissao {
  id: number;
  nome: string;
  descricao: string;
}
