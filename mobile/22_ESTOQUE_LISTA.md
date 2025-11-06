# Tela de Lista de Estoque

## Visão Geral

Visão geral do estoque com alertas, lista de produtos e ações rápidas para movimentações.

## Layout Visual

### Header
- **Título**: "Estoque"
- **Subtítulo**: "Gerenciamento de produtos e movimentações"
- **Botão**: "Nova Movimentação" (abre modal/tela de movimentações)

### Cards de Alertas (Topo)
- **Card: Produtos em Falta**
  - Background: Vermelho claro
  - Ícone: ExclamationTriangleIcon
  - Contador: Número de produtos
  - Botão: "Ver Lista"
  
- **Card: Estoque Baixo**
  - Background: Amarelo claro
  - Ícone: ExclamationCircleIcon
  - Contador: Número de produtos
  - Botão: "Ver Lista"

### Filtros
- **Busca**: Input de texto (busca por nome do produto)
- **Categoria**: Select (opcional)
- **Status**: Tabs ou select
  - Todos
  - Em Estoque
  - Estoque Baixo
  - Em Falta

### Lista de Produtos
- **Formato**: Cards ou lista
- **Cada Item**:
  - Nome do produto
  - Estoque atual (destaque)
  - Estoque mínimo (se configurado)
  - Prateleira (se aplicável)
  - Status badge (Em Estoque/Estoque Baixo/Em Falta)
  - **Ações**: 
    - Botão "Ajustar" (abre ajuste rápido)
    - Botão "Ver Detalhes"

### Botões de Ação Rápida (FAB ou footer)
- **Entrada**: Ícone Plus
- **Saída**: Ícone Minus
- **Ajuste**: Ícone Pencil
- **Transferência**: Ícone ArrowRightLeft

## Rotas da API

### GET /estoque

**Query Params:**
- `barbearia_id` (obrigatório)
- `busca` (opcional)
- `categoria` (opcional)
- `status` (opcional: "em_estoque" | "estoque_baixo" | "em_falta")

**Response:**
```json
{
  "produtos": [
    {
      "id": "string",
      "nome": "string",
      "estoque_atual": 0,
      "estoque_minimo": 0,
      "prateleira_nome": "string | null",
      "status": "em_estoque" | "estoque_baixo" | "em_falta"
    }
  ]
}
```

### GET /estoque/alertas

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
{
  "em_falta": [
    {
      "id": "string",
      "nome": "string",
      "estoque_atual": 0,
      "estoque_minimo": 0
    }
  ],
  "estoque_baixo": [
    {
      "id": "string",
      "nome": "string",
      "estoque_atual": 0,
      "estoque_minimo": 0
    }
  ],
  "total_em_falta": 0,
  "total_estoque_baixo": 0
}
```

## Stores

- `useEstoqueStore`:
  - `loadEstoque(filters)`: Carrega lista
  - `loadAlertas()`: Carrega alertas
- `useProdutosStore`: Lista de produtos


