# Tela de Lista de Estoque

## Visão Geral

Tela principal de controle de estoque com resumo, tabs de navegação (Estoque Atual, Prateleiras, Alertas) e ações rápidas para movimentações.

## Layout Visual

### Header
- **Título**: "Controle de Estoque"
- **Subtítulo**: "Gerencie produtos, prateleiras e movimentações"
- **Botões**:
  - "Movimentações" (roxo, com ícone ChartBarIcon) - navega para `/estoque/movimentacoes`
  - "Relatório" (azul, com ícone DocumentChartBarIcon) - navega para `/estoque/relatorio`

### Cards de Resumo (Topo)
Grid de 4 colunas:
- **Total Produtos**: Ícone CubeIcon (azul), mostra quantidade total de produtos em estoque
- **Valor Total**: Ícone CurrencyDollarIcon (verde), mostra valor total do estoque
- **Estoque Baixo**: Ícone ExclamationTriangleIcon (amarelo), mostra quantidade de produtos com estoque baixo
- **Prateleiras**: Ícone BuildingStorefrontIcon (roxo), mostra quantidade de prateleiras ativas

### Tabs de Navegação
- **Estoque Atual**: Lista de produtos com estoque (componente `EstoqueAtual`)
- **Prateleiras**: Lista de prateleiras (componente `PrateleirasList`)
- **Alertas**: Lista de produtos com estoque baixo (componente `AlertasEstoque`)

### Tab: Estoque Atual
- Lista de produtos com estoque
- Mostra quantidade atual, prateleira, status
- Ações: Adicionar estoque, Editar estoque, Transferir estoque

### Tab: Prateleiras
- Lista de prateleiras cadastradas
- Mostra nome, localização, status (ativa/inativa), quantidade de produtos
- Ações: Ver prateleira, Editar prateleira, Nova prateleira

### Tab: Alertas
- Lista de produtos com estoque baixo
- Mostra nome do produto, estoque atual, estoque mínimo
- Ação: Repor estoque (navega para entrada)

## Rotas da API

### GET /estoque

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
{
  "estoque": [
    {
      "id": "string",
      "produto_id": "string",
      "prateleira_id": "string",
      "quantidade_atual": 0,
      "quantidade_reservada": 0,
      "produto": {
        "id": "string",
        "nome": "string",
        "preco_padrao": "0.00"
      },
      "prateleira": {
        "id": "string",
        "nome": "string",
        "localizacao": "string"
      }
    }
  ]
}
```

**Nota**: A API pode retornar `{ message: "...", estoque: [...] }` ou array direto.

### GET /estoque/baixo

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
{
  "produtos": [
    {
      "id": "string",
      "nome": "string",
      "estoque_atual": 0,
      "estoque_minimo": 0,
      "alerta": "baixo" | "critico"
    }
  ]
}
```

**Nota**: A API pode retornar `{ message: "...", produtos: [...] }` ou array direto.

### GET /prateleiras

**Query Params:**
- `barbearia_id` (obrigatório)
- `ativa` (opcional: true/false)
- `nome` (opcional: busca por nome)

**Response:**
```json
{
  "prateleiras": [
    {
      "id": "string",
      "nome": "string",
      "localizacao": "string",
      "capacidade_maxima": 0,
      "ativa": true
    }
  ]
}
```

**Nota**: A API pode retornar `{ message: "...", prateleiras: [...] }` ou array direto.

## Stores

- `useEstoqueStore`:
  - `carregarEstoqueAtual()`: Carrega lista via `GET /estoque?barbearia_id={id}`
  - `carregarProdutosEstoqueBaixo()`: Carrega alertas via `GET /estoque/baixo?barbearia_id={id}`
  - `listarPrateleiras(filtros?)`: Carrega prateleiras via `GET /prateleiras?barbearia_id={id}&...`
  - `totalProdutosEstoque`: Getter que calcula total de produtos
  - `valorTotalEstoque`: Getter que calcula valor total do estoque
  - `prateleirasAtivas`: Getter que filtra prateleiras ativas
  - `estoquePorPrateleira(prateleiraId)`: Getter que filtra estoque por prateleira
- `useProdutosStore`: Lista de produtos


