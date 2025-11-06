# Tela de Dashboard Financeiro

## Visão Geral

Dashboard completo com métricas principais, cards de acesso rápido e gráficos neon. Suporta modo claro e escuro com cores vibrantes.

## Layout Visual

### 1. Filtro de Período (Card no topo)
- **Título**: "Período de Análise"
- **Selects**: Mês e Ano lado a lado
- **Background**: Branco (dark: gray-800)
- **Padding**: 16px

### 2. Cards de Acesso Rápido (Grid 4 colunas)
- **Despesas Fixas**: 
  - Ícone: SVG de calendário em círculo vermelho
  - Título: "Despesas Fixas"
  - Valor: Grande, vermelho
  - Subtítulo: "X itens cadastrados"
  - Link: `/financeiro/despesas-fixas`
- **Despesas Variáveis**: Similar, cor laranja
- **Canais de Marketing**: Similar, cor índigo
- **Gastos Colaboradores**: Similar, cor roxa

### 3. Cards de Métricas Principais (Grid 4 colunas, 2 linhas)

#### Card 1: Faturamento Bruto
- Label: "FATURAMENTO BRUTO" (uppercase, small, gray)
- Valor: Grande (text-3xl), bold
- Sem variação

#### Card 2: Lucro Bruto
- Label: "LUCRO BRUTO"
- Valor: Grande, bold
- Variação: Percentual (verde se positivo, vermelho se negativo)
- Margem: Percentual abaixo da variação

#### Card 3: Margem de Contribuição
- Label: "MARGEM DE CONTRIBUIÇÃO"
- Valor: Grande, bold
- Variação: Percentual
- Percentual: Da margem

#### Card 4: EBITDA
- Label: "EBITDA"
- Valor: Grande, bold
- Variação: Percentual

#### Card 5: Custos e Deduções
- Label: "CUSTOS E DEDUÇÕES"
- Valor: Grande, bold
- Variação: Percentual (invertido: vermelho se aumento)
- Percentual: Do total

#### Card 6: Despesas Variáveis
- Similar ao anterior

#### Card 7: Despesas Fixas
- Similar ao anterior

#### Card 8: Despesas Não Operacionais
- Similar ao anterior

### 4. Gráficos em Grid (2 colunas)

#### Gráfico 1: Histórico de Faturamento
- **Tipo**: Barras verticais
- **Altura**: 280px
- **Cores**: 
  - Light: Verde `#10B981`
  - Dark: Verde neon `#00FF88`
- **Dados**: 12 meses
- **Eixo X**: Meses formatados (ex: "Jan 2024")
- **Eixo Y**: Valores em R$ (formato: "R$ Xk")

#### Gráfico 2: Faturamento por Categoria
- **Tipo**: Barras + Linha (Pareto)
- **Altura**: 280px
- **Cores**: 
  - Barras: Verde (light: `#10B981`, dark: `#00FF88`)
  - Linha: Azul (light: `#3B82F6`, dark: `#00AAFF`)
- **Eixo Y Esquerdo**: Valores em R$
- **Eixo Y Direito**: Percentual acumulado (0-100%)
- **Dados**: Categorias ordenadas por valor

#### Gráfico 3: Despesas por Categoria
- **Tipo**: Barras + Linha (Pareto)
- **Altura**: 280px
- **Largura**: 2 colunas (lg:col-span-2)
- **Cores**: 
  - Barras: Vermelho (light: `#EF4444`, dark: `#FF3366`)
  - Linha: Azul (light: `#3B82F6`, dark: `#00AAFF`)
- **Estrutura**: Similar ao anterior

## Cores por Tema

### Modo Claro
- **Verde**: `#10B981`
- **Vermelho**: `#EF4444`
- **Azul**: `#3B82F6`

### Modo Escuro (Neon)
- **Verde Neon**: `#00FF88`
- **Vermelho Neon**: `#FF3366`
- **Azul Neon**: `#00AAFF`

## Rotas da API

### GET /financeiro/dashboard/metricas

**Query Params:**
- `mes` (obrigatório): YYYY-MM
- `barbearia_id` (obrigatório)

**Response:**
```json
{
  "faturamento_bruto": {
    "valor": 294910.00,
    "variacao_percentual": null
  },
  "lucro_bruto": {
    "valor": 227631.00,
    "variacao_percentual": -23.3,
    "margem_percentual": 64.2
  },
  "margem_contribuicao": {
    "valor": 189391.00,
    "variacao_percentual": -21.3,
    "percentual": 51.3
  },
  "ebitda": {
    "valor": 31100.00,
    "variacao_percentual": -70.3
  },
  "custos_deducoes": {
    "valor": 67278.00,
    "variacao_percentual": 1.1,
    "percentual": 26.6
  },
  "despesas_variaveis": {
    "valor": 38240.00,
    "variacao_percentual": -32.0,
    "percentual": 15.1
  },
  "despesas_fixas": {
    "valor": 158291.00,
    "variacao_percentual": 0.5,
    "percentual": 62.6
  },
  "despesas_nao_operacionais": {
    "valor": 3135.00,
    "variacao_percentual": -40.5,
    "percentual": 1.2
  }
}
```

### GET /financeiro/dashboard/historico-faturamento

**Query Params:**
- `ano` (obrigatório): YYYY
- `barbearia_id` (obrigatório)

**Response:**
```json
{
  "historico": [
    {
      "mes": "2024-01",
      "mes_formatado": "Jan 2024",
      "valor": 150000.00,
      "valor_sem_outras_receitas": 145000.00
    }
    // ... mais 11 meses
  ]
}
```

### GET /financeiro/dashboard/faturamento-categoria

**Query Params:**
- `mes` (obrigatório): YYYY-MM
- `barbearia_id` (obrigatório)

**Response:**
```json
{
  "categorias": [
    {
      "nome": "Venda Produtos",
      "valor": 120000.00,
      "percentual": 45.5,
      "percentual_acumulado": 45.5
    },
    {
      "nome": "Venda Serviços",
      "valor": 100000.00,
      "percentual": 37.9,
      "percentual_acumulado": 83.4
    },
    {
      "nome": "Outras receitas",
      "valor": 44000.00,
      "percentual": 16.6,
      "percentual_acumulado": 100.0
    }
  ],
  "total": 264000.00
}
```

### GET /financeiro/dashboard/despesas-categoria

**Query Params:**
- `mes` (obrigatório): YYYY-MM
- `barbearia_id` (obrigatório)

**Response:**
```json
{
  "categorias": [
    {
      "nome": "Salários",
      "valor": 80000.00,
      "percentual": 50.3,
      "percentual_acumulado": 50.3
    },
    {
      "nome": "Outras Despesas",
      "valor": 30000.00,
      "percentual": 18.9,
      "percentual_acumulado": 69.2
    }
    // ... mais categorias
  ],
  "total": 159000.00
}
```

## Stores

- `useFinanceiroStore`:
  - `loadMetricasDashboard(mes)`: Carrega métricas
  - `loadHistoricoFaturamento(ano)`: Carrega histórico
  - `loadFaturamentoCategoria(mes)`: Carrega faturamento por categoria
  - `loadDespesasCategoria(mes)`: Carrega despesas por categoria
  - `loadFixedExpenses()`: Carrega despesas fixas (para card)
  - `loadVariableExpenses()`: Carrega despesas variáveis (para card)
  - `loadChannels()`: Carrega canais (para card)
- `useGastosStore`:
  - `listarGastos({ barbearia_id })`: Carrega gastos (para card)

## Formatação de Variação

Função para formatar variação percentual:
- Se valor for `null` ou `undefined`, retorna `"—"`
- Se valor >= 0, adiciona sinal `+`
- Formato: `+X.X%` ou `-X.X%`

