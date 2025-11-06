# Tela de Configuração de Metas

## Visão Geral

Configuração de metas diárias, semanais e mensais para serviços e produtos. Apenas proprietários podem acessar.

## Layout Visual

### Header
- **Título**: "Metas de Vendas"
- **Subtítulo**: "Configure suas metas diárias, semanais e mensais"
- **Botão**: "Voltar" (link para `/configuracoes`)

### Tabs de Período
- **Tab: Metas Diárias** (laranja)
  - Indicador: Bolinha laranja
  - Border inferior laranja quando ativa
- **Tab: Metas Semanais** (roxo)
  - Indicador: Bolinha roxa
  - Border inferior roxa quando ativa
- **Tab: Metas Mensais** (vermelho)
  - Indicador: Bolinha vermelha
  - Border inferior vermelha quando ativa

### Conteúdo da Tab (Card)
- **Grid 3 colunas**:
  - **Meta — R$ Serviços**: Input number, min 0, step 1, atualiza ao perder foco (@blur)
  - **Meta — R$ Produtos**: Input number, min 0, step 1, atualiza ao perder foco (@blur)
  - **Meta — Total**: Exibido (calculado automaticamente: serviços + produtos)
- **Estado Loading**: "Carregando metas {período}..."

## Rotas API

### GET /configuracoes/metas-diarias

**Response:**
```json
{
  "servicos": "0.00",
  "produtos": "0.00",
  "clientes": 0
}
```

### PUT /configuracoes/metas-diarias

**Request Body:**
```json
{
  "servicos": 0.00,
  "produtos": 0.00,
  "clientes": 0
}
```

**Response:** Retorna as metas atualizadas

### GET /configuracoes/metas-semanais

**Response:** Mesmo formato de metas-diarias

### PUT /configuracoes/metas-semanais

**Request Body:** Mesmo formato de metas-diarias

**Response:** Retorna as metas atualizadas

### GET /configuracoes/metas-mensais

**Response:** Mesmo formato de metas-diarias

### PUT /configuracoes/metas-mensais

**Request Body:** Mesmo formato de metas-diarias

**Response:** Retorna as metas atualizadas

**Nota**: O campo `clientes` existe na API mas não é usado no frontend (apenas Serviços e Produtos são exibidos).

## Stores

- `useSettingsStore`:
  - `loadSettings()`: Carrega configurações básicas via `GET /configuracoes` e depois chama `loadGoals()`
  - `loadGoals()`: Carrega todas as metas via `GET /configuracoes/metas-diarias`, `/metas-semanais`, `/metas-mensais`
  - `updateDailyGoals(goals)`: Atualiza via `PUT /configuracoes/metas-diarias`
  - `updateWeeklyGoals(goals)`: Atualiza via `PUT /configuracoes/metas-semanais`
  - `updateMonthlyGoals(goals)`: Atualiza via `PUT /configuracoes/metas-mensais`
  - `updateGoal(period, type, value)`: Atualiza uma meta específica (chama a rota correspondente ao período)
  - `settings.goals.daily`, `settings.goals.weekly`, `settings.goals.monthly`: States com as metas
- `useAppStore`: Notificações

