# Tela de Comissões

## Visão Geral

Visualização detalhada de comissões do colaborador logado. Mostra resumo, histórico e detalhamento por serviço/produto.

## Layout Visual

### Header
- **Título**: "Minhas Comissões"
- **Subtítulo**: Nome do colaborador

### Filtros
- **Período**: Select de mês/ano
- **Tipo**: Todos, Serviços, Produtos (tabs ou select)

### Cards de Resumo
- **Card: Hoje**
  - Valor: Grande, verde
  - Label: "Comissão Hoje"
  - Ícone: CalendarIcon
  
- **Card: Este Mês**
  - Valor: Grande, azul
  - Label: "Comissão do Mês"
  - Ícone: CalendarIcon

- **Card: Total**
  - Valor: Grande, roxo
  - Label: "Total Acumulado"
  - Ícone: CurrencyDollarIcon

### Lista Detalhada
- **Agrupamento**: Por data (mais recente primeiro)
- **Cada Item**:
  - Data formatada
  - Tipo (Serviço/Produto)
  - Nome do serviço/produto
  - Cliente (se disponível)
  - Valor da venda
  - Percentual de comissão
  - **Valor da comissão** (destaque)
  - Status (Pago/Pendente)

### Totalizadores
- **Total de Serviços**: Quantidade + Valor
- **Total de Produtos**: Quantidade + Valor
- **Total de Comissão**: Valor final destacado

## Rotas da API

### GET /comissoes

**Query Params:**
- `colaborador_id` (obrigatório)
- `mes` (opcional, formato: YYYY-MM)
- `tipo` (opcional: "servico" | "produto")

**Response:**
```json
{
  "resumo": {
    "hoje": 0,
    "mes": 0,
    "total": 0
  },
  "detalhes": [
    {
      "id": "string",
      "data": "YYYY-MM-DD",
      "tipo": "servico" | "produto",
      "nome": "string",
      "cliente_nome": "string | null",
      "valor_venda": 0,
      "percentual_comissao": 0,
      "valor_comissao": 0,
      "status": "pago" | "pendente"
    }
  ],
  "totalizadores": {
    "servicos": {
      "quantidade": 0,
      "valor": 0
    },
    "produtos": {
      "quantidade": 0,
      "valor": 0
    },
    "total_comissao": 0
  }
}
```

## Stores

- `useComissoesStore`:
  - `loadComissoes(filters)`: Carrega comissões
- `useAuthStore`: Para obter `colaborador_id` do usuário logado


