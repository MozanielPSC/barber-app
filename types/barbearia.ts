import { DiasSemana } from './enums';

export interface Barbearia {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email?: string;
  horario_funcionamento: string;
  dias_funcionamento: DiasSemana[];
  foto?: string;
  ativa: boolean;
  proprietario_id: number;
  created_at: string;
  updated_at: string;
}

export interface Permissao {
  id: string;
  colaborador_id: string;
  recurso: string;
  pode_visualizar: boolean;
  pode_criar: boolean;
  pode_editar: boolean;
  pode_excluir: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Colaborador {
  id: string;
  nome: string;
  barbearia_id: string;
  usuario_id: string;
  funcao?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  permissoes: Permissao[];
  usuario?: {
    foto_perfil_url?: string | null;
  };
  // Campos opcionais para compatibilidade
  email?: string;
  telefone?: string;
  foto_perfil?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  data_nascimento?: string;
  observacoes?: string;
  barbearia_id: number;
  created_at: string;
  updated_at: string;
}
