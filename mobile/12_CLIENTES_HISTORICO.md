# Tela de Histórico do Cliente

## Visão Geral

Lista completa e cronológica de histórico de atendimentos e compras do cliente. Permite visualizar todas as interações com o cliente.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft
- **Título**: "Histórico do Cliente"
- **Subtítulo**: Nome do cliente

### Filtros
- **Tipo**: Tabs ou select
  - Todos
  - Atendimentos
  - Compras
- **Período**: 
  - Data Início (date picker)
  - Data Fim (date picker)
- **Botão**: "Limpar Filtros"

### Resumo
- **Card**: Total de Atendimentos
- **Card**: Total de Compras
- **Card**: Valor Total Gasto

### Lista Cronológica
- **Agrupamento**: Por data (mais recente primeiro)
- **Cada Item**:
  - **Data**: Formato "DD/MM/YYYY"
  - **Tipo**: Badge (Atendimento/Compra)
  - **Informações**:
    - **Atendimento**: Colaborador, Serviços realizados, Total
    - **Compra**: Produtos, Quantidades, Total
  - **Ações**: Botão "Ver Detalhes" (navega para detalhes do atendimento)

## Rotas da API

### GET /clientes/{id}/historico

**Query Params:**
- `tipo` (opcional: "atendimento" | "compra")
- `data_inicio` (opcional, formato: YYYY-MM-DD)
- `data_fim` (opcional, formato: YYYY-MM-DD)

**Response:**
```json
{
  "resumo": {
    "total_atendimentos": 0,
    "total_compras": 0,
    "valor_total_gasto": 0
  },
  "historico": [
    {
      "id": "string",
      "tipo": "atendimento" | "compra",
      "data": "YYYY-MM-DD",
      "colaborador_nome": "string | null",
      "servicos": [
        {
          "nome": "string",
          "preco": 0
        }
      ],
      "produtos": [
        {
          "nome": "string",
          "quantidade": 0,
          "preco_unitario": 0
        }
      ],
      "total": 0,
      "atendimento_id": "string | null"
    }
  ]
}
```

## Stores

- `useClientesStore`: `loadHistorico(id, filters)`
- `useAtendimentosStore`: Para navegar para detalhes


