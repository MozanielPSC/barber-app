import { TipoUsuario } from './enums';

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  foto_perfil?: string;
  created_at: string;
  updated_at: string;
  // Campos para colaboradores
  barbearia_id?: number;
  nome_barbearia?: string;
  // Campos para proprietários
  nome_proprietario?: string;
}

export interface Permissao {
  id: number;
  nome: string;
  descricao: string;
}
