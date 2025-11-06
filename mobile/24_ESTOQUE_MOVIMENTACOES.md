# Tela de Movimentações de Estoque

## Visão Geral

Conjunto de telas para realizar diferentes tipos de movimentações de estoque: entrada, saída, ajuste e transferência entre prateleiras.

## Layout Visual

### Navegação
Tabs ou botões para escolher o tipo de movimentação:
- **Entrada**
- **Saída**
- **Ajuste**
- **Transferência**

### Formulário Comum (Card)

#### Tipo: Entrada
- **Título**: "Entrada de Estoque"
- **Campos**:
  - **Produto *** (select/busca)
  - **Quantidade *** (input number, mínimo 1)
  - **Fornecedor** (input text, opcional)
  - **Nota Fiscal** (input text, opcional)
  - **Data da Entrada** (date picker, padrão: hoje)
  - **Observações** (textarea, opcional)
- **Info**: Mostra estoque atual após a entrada
- **Botão**: "Registrar Entrada"

#### Tipo: Saída
- **Título**: "Saída de Estoque"
- **Campos**:
  - **Produto *** (select/busca)
  - **Quantidade *** (input number, máximo: estoque atual)
  - **Motivo *** (select):
    - Venda
    - Perda/Dano
    - Ajuste
    - Outro
  - **Data da Saída** (date picker, padrão: hoje)
  - **Observações** (textarea, opcional)
- **Alerta**: Se quantidade > estoque atual, mostrar erro
- **Info**: Mostra estoque atual e estoque após a saída
- **Botão**: "Registrar Saída"

#### Tipo: Ajuste
- **Título**: "Ajuste de Estoque"
- **Campos**:
  - **Produto *** (select/busca)
  - **Estoque Atual**: Exibido (readonly)
  - **Quantidade Nova *** (input number, mínimo 0)
  - **Diferença**: Calculado automaticamente (Nova - Atual)
  - **Motivo *** (textarea obrigatório)
  - **Data do Ajuste** (date picker, padrão: hoje)
  - **Observações** (textarea, opcional)
- **Info**: Mostra se é aumento ou redução
- **Botão**: "Registrar Ajuste"

#### Tipo: Transferência
- **Título**: "Transferência entre Prateleiras"
- **Campos**:
  - **Produto *** (select/busca)
  - **Quantidade *** (input number, máximo: estoque na prateleira origem)
  - **Prateleira Origem *** (select)
  - **Prateleira Destino *** (select, não pode ser igual à origem)
  - **Data da Transferência** (date picker, padrão: hoje)
  - **Observações** (textarea, opcional)
- **Alerta**: Se quantidade > estoque na origem, mostrar erro
- **Info**: Mostra estoque em cada prateleira
- **Botão**: "Registrar Transferência"

## Validações

### Entrada
- Produto e quantidade obrigatórios
- Quantidade > 0

### Saída
- Produto, quantidade e motivo obrigatórios
- Quantidade <= estoque atual
- Quantidade > 0

### Ajuste
- Produto, quantidade nova e motivo obrigatórios
- Quantidade nova >= 0

### Transferência
- Todos os campos obrigatórios
- Prateleira destino ≠ origem
- Quantidade <= estoque na origem
- Quantidade > 0

## Rotas da API

### POST /estoque/entrada

**Request Body:**
```json
{
  "barbearia_id": "string",
  "produto_id": "string",
  "quantidade": 0,
  "fornecedor": "string | null",
  "nota_fiscal": "string | null",
  "data": "YYYY-MM-DD",
  "observacoes": "string | null"
}
```

**Response:**
```json
{
  "id": "string",
  "estoque_apos": 0,
  "mensagem": "Entrada registrada com sucesso"
}
```

### POST /estoque/saida

**Request Body:**
```json
{
  "barbearia_id": "string",
  "produto_id": "string",
  "quantidade": 0,
  "motivo": "venda",
  "data": "YYYY-MM-DD",
  "observacoes": "string | null"
}
```

### POST /estoque/ajuste

**Request Body:**
```json
{
  "barbearia_id": "string",
  "produto_id": "string",
  "quantidade_nova": 0,
  "motivo": "string",
  "data": "YYYY-MM-DD",
  "observacoes": "string | null"
}
```

### POST /estoque/transferencia

**Request Body:**
```json
{
  "barbearia_id": "string",
  "produto_id": "string",
  "quantidade": 0,
  "prateleira_origem_id": "string",
  "prateleira_destino_id": "string",
  "data": "YYYY-MM-DD",
  "observacoes": "string | null"
}
```

## Stores

- `useEstoqueStore`:
  - `registrarEntrada(data)`
  - `registrarSaida(data)`
  - `registrarAjuste(data)`
  - `registrarTransferencia(data)`
- `useProdutosStore`: Lista de produtos
- `usePrateleirasStore`: Lista de prateleiras (para transferência)


