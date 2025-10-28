# Barber App - Modelos de Dados

## Visão Geral

Este documento descreve todos os modelos de dados (interfaces TypeScript) utilizados na aplicação, incluindo relacionamentos entre entidades, enums e exemplos de dados.

## Enums

### StatusAgendamento
```typescript
export enum StatusAgendamento {
  AGENDADO = 'agendado',
  CONFIRMADO = 'confirmado',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado',
  NAO_COMPARECEU = 'nao_compareceu'
}
```

### DiasSemana
```typescript
export enum DiasSemana {
  DOMINGO = 0,
  SEGUNDA = 1,
  TERCA = 2,
  QUARTA = 3,
  QUINTA = 4,
  SEXTA = 5,
  SABADO = 6
}
```

### TipoUsuario
```typescript
export type TipoUsuario = 'proprietario' | 'colaborador'
```

## Interfaces Principais

### 1. Autenticação e Usuários

#### User
```typescript
export interface User {
  id: string
  email: string
  tipo: TipoUsuario
  // Campos para proprietário
  nome_barbearia?: string
  nome_proprietario?: string
  telefone?: string
  endereco?: string
  // Campos para colaborador
  nome?: string
  funcao?: string
  colaborador_id?: string
  barbearia_id?: string
  barbearia_nome?: string
  barbearia_codigo?: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
  // Foto de perfil
  foto_perfil_url_assinada?: string
}
```

**Exemplo de Proprietário:**
```json
{
  "id": "uuid-proprietario",
  "email": "joao@barbearia.com",
  "tipo": "proprietario",
  "nome_barbearia": "Barbearia do João",
  "nome_proprietario": "João Silva",
  "telefone": "11999999999",
  "endereco": "Rua das Flores, 123",
  "ativo": true,
  "criado_em": "2024-01-01T00:00:00Z",
  "atualizado_em": "2024-01-01T00:00:00Z",
  "foto_perfil_url_assinada": "https://s3.../foto.jpg"
}
```

**Exemplo de Colaborador:**
```json
{
  "id": "uuid-colaborador",
  "email": "maria@barbearia.com",
  "tipo": "colaborador",
  "nome": "Maria Santos",
  "funcao": "Barbeiro",
  "colaborador_id": "uuid-colaborador-entidade",
  "barbearia_id": "uuid-barbearia",
  "barbearia_nome": "Barbearia do João",
  "barbearia_codigo": "BARB001",
  "ativo": true,
  "criado_em": "2024-01-01T00:00:00Z",
  "atualizado_em": "2024-01-01T00:00:00Z",
  "foto_perfil_url_assinada": "https://s3.../foto.jpg"
}
```

#### Permissao
```typescript
export interface Permissao {
  id: string
  colaborador_id: string
  recurso: string
  pode_visualizar: boolean
  pode_criar: boolean
  pode_editar: boolean
  pode_excluir: boolean
}
```

**Exemplo:**
```json
{
  "id": "uuid-permissao",
  "colaborador_id": "uuid-colaborador",
  "recurso": "clientes",
  "pode_visualizar": true,
  "pode_criar": true,
  "pode_editar": false,
  "pode_excluir": false
}
```

#### AuthResponse
```typescript
export interface AuthResponse {
  user: User
  token: string
  permissoes?: Permissao[]
}
```

### 2. Barbearias

#### Barbearia
```typescript
export interface Barbearia {
  id: string
  nome: string
  codigo?: string
  endereco?: string
  telefone?: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
}
```

**Exemplo:**
```json
{
  "id": "uuid-barbearia",
  "nome": "Barbearia Central",
  "codigo": "BARB001",
  "endereco": "Rua das Flores, 123",
  "telefone": "11999999999",
  "ativo": true,
  "criado_em": "2024-01-01T00:00:00Z",
  "atualizado_em": "2024-01-01T00:00:00Z"
}
```

#### BarbeariaSelecionada
```typescript
export interface BarbeariaSelecionada {
  id: string
  nome: string
  codigo?: string
}
```

### 3. Colaboradores

#### Colaborador
```typescript
export interface Colaborador {
  id: string
  nome: string
  funcao: string
  usuario_id?: string
  barbearia_id: string
  ativo?: boolean
  criado_em: string
  atualizado_em: string
  permissoes?: Permissao[]
  usuario?: {
    foto_perfil_url?: string
  }
}
```

**Exemplo:**
```json
{
  "id": "uuid-colaborador",
  "nome": "Maria Santos",
  "funcao": "Barbeiro",
  "usuario_id": "uuid-usuario",
  "barbearia_id": "uuid-barbearia",
  "ativo": true,
  "criado_em": "2024-01-01T00:00:00Z",
  "atualizado_em": "2024-01-01T00:00:00Z",
  "permissoes": [
    {
      "id": "uuid-permissao",
      "colaborador_id": "uuid-colaborador",
      "recurso": "clientes",
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": false,
      "pode_excluir": false
    }
  ],
  "usuario": {
    "foto_perfil_url": "https://s3.../foto.jpg"
  }
}
```

#### DisponibilidadeColaborador
```typescript
export interface DisponibilidadeColaborador {
  id: string
  colaborador_id: string
  dia_semana: number
  horario_inicio: string
  horario_fim: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
}
```

**Exemplo:**
```json
{
  "id": "uuid-disponibilidade",
  "colaborador_id": "uuid-colaborador",
  "dia_semana": 1,
  "horario_inicio": "08:00",
  "horario_fim": "18:00",
  "ativo": true,
  "criado_em": "2024-01-01T00:00:00Z",
  "atualizado_em": "2024-01-01T00:00:00Z"
}
```

### 4. Clientes

#### Client
```typescript
export interface Client {
  id: string
  name: string
  phone?: string
  createdAt: string
  source?: string
  referredBy?: string
  notes?: string
  lastVisit?: string
  lastProductPurchase?: string
}
```

**Exemplo:**
```json
{
  "id": "uuid-cliente",
  "name": "João Silva",
  "phone": "11999999999",
  "createdAt": "2024-01-01T00:00:00Z",
  "source": "Instagram",
  "referredBy": "Maria Santos",
  "notes": "Cliente preferencial",
  "lastVisit": "2024-01-15T10:00:00Z",
  "lastProductPurchase": "2024-01-10T15:30:00Z"
}
```

### 5. Serviços

#### Service
```typescript
export interface Service {
  id: string
  name: string
  defaultPrice: number
  commissionPct: number
  commissionPctAssistente?: number
  commissionPctIndicador?: number
  goalDailyQty: number
}
```

**Exemplo:**
```json
{
  "id": "uuid-servico",
  "name": "Corte Masculino",
  "defaultPrice": 30.00,
  "commissionPct": 0.20,
  "commissionPctAssistente": 0.05,
  "commissionPctIndicador": 0.10,
  "goalDailyQty": 10
}
```

### 6. Produtos

#### Product
```typescript
export interface Product {
  id: string
  name: string
  defaultPrice: number
  commissionPct: number
  taxPct: number
  cardPct: number
  goalDailyQty: number
}
```

**Exemplo:**
```json
{
  "id": "uuid-produto",
  "name": "Pomada Modeladora",
  "defaultPrice": 25.00,
  "commissionPct": 0.15,
  "taxPct": 0.18,
  "cardPct": 0.03,
  "goalDailyQty": 5
}
```

### 7. Agendamentos

#### Agendamento
```typescript
export interface Agendamento {
  id: string
  usuario_id: string
  barbearia_id: string
  colaborador_id: string
  cliente_id: string
  data_atendimento: string
  horario_inicio: string
  horario_fim: string
  duracao_minutos: number
  status: StatusAgendamento
  origem: string
  observacoes?: string
  cliente: {
    id: string
    nome: string
    telefone?: string
  }
  colaborador?: {
    id: string
    nome: string
    funcao: string
    foto_perfil_url_assinada?: string
    usuario?: {
      foto_perfil_url?: string
    }
  }
  servicos: Array<{
    id: string
    servico_id: string
    nome: string
    preco: string
  }>
  produtos?: Array<{
    id: string
    produto_id: string
    nome: string
    preco: string
    quantidade: number
  }>
}
```

**Exemplo:**
```json
{
  "id": "uuid-agendamento",
  "usuario_id": "uuid-usuario",
  "barbearia_id": "uuid-barbearia",
  "colaborador_id": "uuid-colaborador",
  "cliente_id": "uuid-cliente",
  "data_atendimento": "2024-01-15",
  "horario_inicio": "10:00:00",
  "horario_fim": "11:00:00",
  "duracao_minutos": 60,
  "status": "agendado",
  "origem": "Instagram",
  "observacoes": "Primeira visita",
  "cliente": {
    "id": "uuid-cliente",
    "nome": "João Silva",
    "telefone": "11999999999"
  },
  "colaborador": {
    "id": "uuid-colaborador",
    "nome": "Maria Santos",
    "funcao": "Barbeiro",
    "foto_perfil_url_assinada": "https://s3.../foto.jpg",
    "usuario": {
      "foto_perfil_url": "https://s3.../foto.jpg"
    }
  },
  "servicos": [
    {
      "id": "uuid-servico-agendamento",
      "servico_id": "uuid-servico",
      "nome": "Corte Masculino",
      "preco": "30.00"
    }
  ],
  "produtos": [
    {
      "id": "uuid-produto-agendamento",
      "produto_id": "uuid-produto",
      "nome": "Pomada",
      "preco": "20.00",
      "quantidade": 1
    }
  ]
}
```

#### HorarioDisponivel
```typescript
export interface HorarioDisponivel {
  horario: string
  horario_formatado: string
}
```

#### HorariosDisponiveisResponse
```typescript
export interface HorariosDisponiveisResponse {
  colaborador_id: string
  data: string
  servico_id: string
  duracao_servico: number
  horarios_disponiveis: HorarioDisponivel[]
}
```

### 8. Atendimentos

#### Visit
```typescript
export interface Visit {
  id: string
  date: string
  clientId: string
  start?: string
  end?: string
  source?: string
  notes?: string
  durationMin?: number
  services: VisitService[]
  products: VisitProduct[]
  attended: boolean
  isFirstVisit: boolean
  colaborador?: {
    id: string
    nome: string
    funcao: string
  }
}
```

#### VisitService
```typescript
export interface VisitService {
  id: string
  name: string
  price: number
  byMe: boolean
}
```

#### VisitProduct
```typescript
export interface VisitProduct {
  id: string
  name: string
  price: number
  qty: number
  byMe: boolean
}
```

**Exemplo de Atendimento:**
```json
{
  "id": "uuid-atendimento",
  "date": "2024-01-15",
  "clientId": "uuid-cliente",
  "start": "10:00",
  "end": "11:00",
  "source": "Walk-in",
  "notes": "Atendimento realizado com sucesso",
  "durationMin": 60,
  "attended": true,
  "isFirstVisit": false,
  "colaborador": {
    "id": "uuid-colaborador",
    "nome": "Maria Santos",
    "funcao": "Barbeiro"
  },
  "services": [
    {
      "id": "uuid-servico",
      "name": "Corte Masculino",
      "price": 30.00,
      "byMe": true
    }
  ],
  "products": [
    {
      "id": "uuid-produto",
      "name": "Pomada",
      "price": 20.00,
      "qty": 1,
      "byMe": true
    }
  ]
}
```

### 9. Sistema de Comissões

#### ComissaoServico
```typescript
export interface ComissaoServico {
  id: string
  nome: string
  valor: number
  comissao: number
  percentual_comissao: number
  data: string
  colaborador_id: string
  colaborador_nome?: string
}
```

#### ComissaoProduto
```typescript
export interface ComissaoProduto {
  id: string
  nome: string
  valor: number
  quantidade: number
  comissao: number
  percentual_comissao: number
  data: string
  colaborador_id: string
  colaborador_nome?: string
}
```

#### Debito
```typescript
export interface Debito {
  id: string
  descricao: string
  tipo: 'Produto' | 'Adiantamento' | 'Outro'
  valor: number
  data: string
  colaborador_id: string
}
```

#### Indicacao
```typescript
export interface Indicacao {
  id: string
  cliente: string
  data: string
  status: 'Ativo' | 'Primeira Visita' | 'Inativo'
  visitas: number
  colaborador_id: string
}
```

#### ResumoComissoes
```typescript
export interface ResumoComissoes {
  total_vendas: number
  total_comissoes: number
  total_debitos: number
  saldo_liquido: number
  vendas_servicos: number
  vendas_produtos: number
  comissao_servicos: number
  comissao_produtos: number
  indicacoes_count: number
  indicacoes_ativas: number
}
```

**Exemplo de Resumo:**
```json
{
  "total_vendas": 1000.00,
  "total_comissoes": 200.00,
  "total_debitos": 50.00,
  "saldo_liquido": 150.00,
  "vendas_servicos": 800.00,
  "vendas_produtos": 200.00,
  "comissao_servicos": 160.00,
  "comissao_produtos": 30.00,
  "indicacoes_count": 5,
  "indicacoes_ativas": 3
}
```

#### ProjecaoComissoes
```typescript
export interface ProjecaoComissoes {
  servicos_vendidos: number
  produtos_vendidos: number
  indicacoes_feitas: number
  assinaturas_vendidas: number
  projecao_servicos: number
  projecao_produtos: number
  projecao_indicacoes: number
  projecao_assinaturas: number
  comissao_servicos: number
  comissao_produtos: number
  comissao_indicacoes: number
  comissao_assinaturas: number
  projecao_total: number
}
```

### 10. Sistema de Estoque

#### Prateleira
```typescript
export interface Prateleira {
  id: string
  barbearia_id: string
  nome: string
  localizacao: string
  capacidade_maxima?: number
  ativa: boolean
  criado_em: string
  atualizado_em: string
}
```

#### EstoqueProduto
```typescript
export interface EstoqueProduto {
  id: string
  barbearia_id: string
  produto_id: string
  quantidade_atual: number
  quantidade_reservada: number
  prateleira_id: string
  lote?: string
  data_validade?: string
  criado_em: string
  atualizado_em: string
  produto?: {
    id: string
    nome: string
    preco: number
    preco_padrao?: string
    unidade_medida: string
    estoque_minimo?: number
  }
  prateleira?: {
    id: string
    nome: string
    localizacao: string
  }
}
```

#### MovimentacaoEstoque
```typescript
export interface MovimentacaoEstoque {
  id: string
  barbearia_id: string
  produto_id: string
  estoque_produto_id: string
  tipo: 'entrada' | 'saida' | 'ajuste' | 'transferencia' | 'venda'
  quantidade: number
  quantidade_anterior: number
  quantidade_nova: number
  prateleira_origem_id?: string
  prateleira_destino_id?: string
  motivo: string
  observacoes?: string
  colaborador_id: string
  atendimento_produto_id?: string
  criado_em: string
  produto?: {
    id: string
    nome: string
  }
  colaborador?: {
    id: string
    nome: string
  }
  prateleira_origem?: {
    id: string
    nome: string
  }
  prateleira_destino?: {
    id: string
    nome: string
  }
}
```

**Exemplo de Movimentação:**
```json
{
  "id": "uuid-movimentacao",
  "barbearia_id": "uuid-barbearia",
  "produto_id": "uuid-produto",
  "estoque_produto_id": "uuid-estoque-produto",
  "tipo": "entrada",
  "quantidade": 10,
  "quantidade_anterior": 5,
  "quantidade_nova": 15,
  "motivo": "Compra",
  "observacoes": "Fornecedor ABC",
  "colaborador_id": "uuid-colaborador",
  "criado_em": "2024-01-15T10:00:00Z",
  "produto": {
    "id": "uuid-produto",
    "nome": "Pomada Modeladora"
  },
  "colaborador": {
    "id": "uuid-colaborador",
    "nome": "Maria Santos"
  }
}
```

#### ProdutoEstoqueBaixo
```typescript
export interface ProdutoEstoqueBaixo {
  id: string
  nome: string
  quantidade_atual: number
  estoque_minimo: number
  prateleira_id: string
  prateleira_nome: string
  alerta: 'baixo' | 'critico'
}
```

### 11. Sistema Financeiro

#### FinanceItem
```typescript
export interface FinanceItem {
  cat: string
  value: number
}
```

#### Chair
```typescript
export interface Chair {
  id: string
  name: string
  costMonthly: number
  colaborador?: {
    id: string
    nome: string
    funcao: string
  }
}
```

#### Channel
```typescript
export interface Channel {
  name: string
  spend: number
}
```

#### FinanceDefaults
```typescript
export interface FinanceDefaults {
  taxPct: number
  cardPct: number
  varPctExtra: number
}
```

#### Finance
```typescript
export interface Finance {
  fixed: FinanceItem[]
  variable: FinanceItem[]
  monthRef: string
  defaults: FinanceDefaults
  chairs: Chair[]
  channels: Channel[]
}
```

### 12. Sistema de Gastos

#### GastoColaborador
```typescript
export interface GastoColaborador {
  id: string
  barbearia_id: string
  colaborador_id: string
  descricao: string
  valor_total: number
  data_vencimento: string
  status: 'pendente' | 'pago' | 'atrasado'
  data_pagamento?: string
  observacoes?: string
  criado_em: string
  atualizado_em: string
  colaborador?: {
    id: string
    nome: string
    funcao: string
  }
}
```

**Exemplo:**
```json
{
  "id": "uuid-gasto",
  "barbearia_id": "uuid-barbearia",
  "colaborador_id": "uuid-colaborador",
  "descricao": "Compra de produtos",
  "valor_total": 100.00,
  "data_vencimento": "2024-01-31",
  "status": "pendente",
  "observacoes": "Produtos para estoque",
  "criado_em": "2024-01-15T10:00:00Z",
  "atualizado_em": "2024-01-15T10:00:00Z",
  "colaborador": {
    "id": "uuid-colaborador",
    "nome": "Maria Santos",
    "funcao": "Barbeiro"
  }
}
```

#### CriarGastoForm
```typescript
export interface CriarGastoForm {
  colaborador_id: string
  descricao: string
  valor_total: number
  data_vencimento: string
  observacoes?: string
}
```

#### GastoParcelado
```typescript
export interface GastoParcelado {
  colaborador_id: string
  descricao: string
  valor_total: number
  numero_parcelas: number
  data_vencimento_primeira: string
  observacoes?: string
}
```

### 13. Dashboard e KPIs

#### DashboardKPIs
```typescript
export interface DashboardKPIs {
  revenue: number
  services: number
  products: number
  clients: number
  avgTicket: number
  conversionRate: number
}
```

#### ClientAtRisk
```typescript
export interface ClientAtRisk {
  id: string
  name: string
  lastVisit: string
  daysSinceLastVisit: number
}
```

#### ChannelStats
```typescript
export interface ChannelStats {
  channel: string
  clients: number
  revenue: number
  conversionRate: number
}
```

### 14. Formulários

#### LoginForm
```typescript
export interface LoginForm {
  email: string
  senha: string
}
```

#### LoginColaboradorForm
```typescript
export interface LoginColaboradorForm {
  email: string
  senha: string
  codigo_barbearia: string
}
```

#### RegisterForm
```typescript
export interface RegisterForm {
  email: string
  senha: string
  confirmar_senha: string
  nome_barbearia: string
  nome_proprietario: string
  telefone?: string
  endereco?: string
}
```

#### ColaboradorForm
```typescript
export interface ColaboradorForm {
  nome: string
  funcao: string
  email?: string
  senha?: string
  barbearia_id: string
  permissoes?: PermissoesForm
}
```

#### PermissoesForm
```typescript
export interface PermissoesForm {
  [recurso: string]: {
    pode_visualizar: boolean
    pode_criar: boolean
    pode_editar: boolean
    pode_excluir: boolean
  }
}
```

#### CriarAgendamentoForm
```typescript
export interface CriarAgendamentoForm {
  colaborador_id: string
  cliente_id: string
  servico_id: string
  data: string
  horario_inicio: string
  observacoes?: string
  barbearia_id: string
}
```

### 15. Estados das Stores

#### AuthState
```typescript
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  permissoes: Permissao[]
}
```

#### BarbeariasState
```typescript
export interface BarbeariasState {
  barbearias: Barbearia[]
  barbeariaSelecionada: BarbeariaSelecionada | null
  isLoading: boolean
}
```

#### ColaboradoresState
```typescript
export interface ColaboradoresState {
  colaboradores: Colaborador[]
  isLoading: boolean
}
```

### 16. Notificações

#### Notification
```typescript
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}
```

## Relacionamentos Principais

### Hierarquia de Entidades
```
User (Proprietário/Colaborador)
├── Barbearia (1:N)
│   ├── Colaborador (1:N)
│   │   ├── Permissao (1:N)
│   │   ├── DisponibilidadeColaborador (1:N)
│   │   └── GastoColaborador (1:N)
│   ├── Client (1:N)
│   ├── Service (1:N)
│   ├── Product (1:N)
│   ├── Agendamento (1:N)
│   ├── Visit (1:N)
│   ├── Prateleira (1:N)
│   └── Finance (1:1)
└── AuthState (1:1)
```

### Relacionamentos de Dados
- **Barbearia** → **Colaborador**: Uma barbearia tem muitos colaboradores
- **Colaborador** → **Permissao**: Um colaborador tem muitas permissões
- **Colaborador** → **DisponibilidadeColaborador**: Um colaborador tem muitas disponibilidades
- **Cliente** → **Agendamento**: Um cliente pode ter muitos agendamentos
- **Cliente** → **Visit**: Um cliente pode ter muitos atendimentos
- **Colaborador** → **Agendamento**: Um colaborador pode ter muitos agendamentos
- **Serviço** → **Agendamento**: Um serviço pode estar em muitos agendamentos
- **Produto** → **EstoqueProduto**: Um produto pode estar em muitas prateleiras
- **EstoqueProduto** → **MovimentacaoEstoque**: Um produto em estoque pode ter muitas movimentações

## Validações e Regras

### Campos Obrigatórios
- **User**: id, email, tipo, ativo, criado_em, atualizado_em
- **Barbearia**: id, nome, ativo, criado_em, atualizado_em
- **Colaborador**: id, nome, funcao, barbearia_id, criado_em, atualizado_em
- **Client**: id, name, createdAt
- **Service**: id, name, defaultPrice, commissionPct, goalDailyQty
- **Product**: id, name, defaultPrice, commissionPct, taxPct, cardPct, goalDailyQty

### Validações de Formato
- **Email**: Formato válido de email
- **Telefone**: Formato brasileiro (11) 99999-9999
- **Data**: Formato ISO 8601 (YYYY-MM-DD)
- **Horário**: Formato HH:MM
- **Valores monetários**: Números decimais com 2 casas
- **Percentuais**: Números decimais entre 0 e 1

### Regras de Negócio
- **Barbearia**: Deve ter pelo menos um proprietário
- **Colaborador**: Deve estar vinculado a uma barbearia
- **Agendamento**: Não pode conflitar com outros agendamentos do mesmo colaborador
- **Comissão**: Deve ser calculada baseada nos percentuais definidos
- **Estoque**: Quantidade não pode ser negativa
- **Gasto**: Valor deve ser positivo
