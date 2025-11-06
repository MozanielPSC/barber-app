# Tela de Configurações Gerais

## Visão Geral

Página principal de configurações com cards de acesso rápido para diferentes seções. Exibe resumo das configurações atuais.

## Layout Visual

### Cards de Acesso Rápido (Grid 3 colunas)

#### Card: Dados da Barbearia
- **Ícone**: Info (índigo)
- **Título**: "Dados da Barbearia"
- **Descrição**: "Código de acesso e informações da barbearia"
- **Link**: `/configuracoes/barbearia`
- **Hover**: Border índigo, shadow aumentada

#### Card: Configurações Básicas
- **Ícone**: Cog (azul)
- **Título**: "Configurações Básicas"
- **Descrição**: "Nome, dias de risco e parâmetros gerais"
- **Link**: `/configuracoes/basicas`
- **Hover**: Border azul, shadow aumentada

#### Card: Metas de Vendas
- **Ícone**: Check circle (gradiente laranja-vermelho)
- **Título**: "Metas de Vendas"
- **Descrição**: "Configure suas metas diárias, semanais e mensais"
- **Link**: `/configuracoes/metas`
- **Hover**: Border azul, shadow aumentada

### Resumo das Configurações (Card)
- **Título**: "Resumo das Configurações"
- **Grid 2 colunas**:
  - **Nome do Barbeiro**: Valor grande, label pequeno
  - **Período de Risco**: Valor grande com "dias", label pequeno

## Páginas Relacionadas

### `/configuracoes/barbearia`
- Exibe e edita código da barbearia
- Permite copiar código
- Permite editar código (6 caracteres, alfanumérico, uppercase)

### `/configuracoes/basicas`
- **Campos**:
  - **Seu nome**: Input text, atualiza ao perder foco (@blur)
  - **Dias para risco de churn**: Input number, min 1, atualiza ao perder foco (@blur)
- **Preview**: Card com valores atuais

### `/configuracoes/metas`
- Ver documentação em `39_METAS.md`

## Rotas API

### GET /configuracoes

**Response:**
```json
{
  "myName": "string",
  "churnDays": 30,
  "serviceCommissionPct": 0.00,
  "productCommissionPct": 0.00
}
```

**Nota**: As metas são carregadas separadamente via `/configuracoes/metas-diarias`, `/metas-semanais`, `/metas-mensais`.

### PUT /configuracoes

**Request Body:**
```json
{
  "myName": "string",
  "churnDays": 30,
  "serviceCommissionPct": 0.00,
  "productCommissionPct": 0.00
}
```

**Response:** Retorna as configurações atualizadas

## Stores

- `useSettingsStore`:
  - `loadSettings()`: Carrega configurações básicas via `GET /configuracoes` e depois chama `loadGoals()`
  - `updateSettings(updates)`: Atualiza via `PUT /configuracoes`
  - `settings`: State com as configurações
- `useAppStore`: Notificações

