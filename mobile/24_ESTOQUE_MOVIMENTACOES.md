# Tela de Movimentações de Estoque

## Visão Geral

Conjunto de telas para realizar diferentes tipos de movimentações de estoque: entrada, saída, ajuste e transferência entre prateleiras.

## Layout Visual

### Navegação
Cada tipo de movimentação é uma página separada:
- **Entrada**: `/estoque/entrada`
- **Saída**: `/estoque/saida`
- **Ajuste**: `/estoque/ajuste`
- **Transferência**: `/estoque/transferencia`

Todas as páginas têm:
- **Header**: Botão voltar (ArrowLeft) + Título + Subtítulo
- **Formulário**: Card branco com campos específicos
- **Botões**: Cancelar (outline cinza) + Ação principal (azul)

### Formulário Comum (Card)

#### Tipo: Entrada
- **Título**: "Entrada de Estoque"
- **Subtítulo**: "Registre a entrada de produtos no estoque"
- **Campos**:
  - **Produto *** (select, obrigatório)
  - **Prateleira *** (select, obrigatório)
  - **Quantidade *** (input number, mínimo 1, step 1, apenas inteiros)
  - **Motivo *** (input text, obrigatório, placeholder "Ex: Compra fornecedor")
  - **Observações** (textarea, opcional)
- **Validações**: Quantidade deve ser inteira e maior que 0
- **Botão**: "Registrar Entrada" (azul)

#### Tipo: Saída
- **Título**: "Saída de Estoque"
- **Subtítulo**: "Registre a saída de produtos do estoque"
- **Campos**:
  - **Produto *** (select, obrigatório, carrega estoque ao selecionar)
  - **Prateleira *** (select, obrigatório, mostra quantidade disponível)
  - **Quantidade *** (input number, máximo: quantidade disponível na prateleira, mínimo 1, step 1, apenas inteiros)
  - **Motivo *** (input text, obrigatório)
  - **Observações** (textarea, opcional)
- **Validações**: 
  - Quantidade deve ser inteira e maior que 0
  - Quantidade não pode ser maior que a disponível na prateleira
  - Mostra mensagem "Máximo disponível: {quantidade}"
- **Botão**: "Registrar Saída" (azul)

#### Tipo: Ajuste
- **Título**: "Ajuste de Estoque"
- **Subtítulo**: "Ajuste as quantidades após inventário físico"
- **Campos**:
  - **Produto *** (select, obrigatório, carrega estoque ao selecionar)
  - **Prateleira *** (select, obrigatório, atualiza quantidade atual ao selecionar)
  - **Quantidade Atual no Sistema**: Exibido (readonly, cinza)
  - **Nova Quantidade *** (input number, mínimo 0, step 1, apenas inteiros)
  - **Diferença**: Calculado automaticamente (Nova - Atual), mostra se é aumento ou redução
  - **Motivo *** (textarea obrigatório)
  - **Observações** (textarea, opcional)
- **Validações**: Quantidade nova deve ser inteira e maior ou igual a 0
- **Botão**: "Registrar Ajuste" (azul)

#### Tipo: Transferência
- **Título**: "Transferência de Estoque"
- **Subtítulo**: "Transfira produtos entre prateleiras"
- **Campos**:
  - **Produto *** (select, obrigatório, carrega estoque ao selecionar)
  - **Prateleira Origem *** (select, obrigatório, mostra quantidade disponível, atualiza destino ao selecionar)
  - **Prateleira Destino *** (select, obrigatório, não pode ser igual à origem)
  - **Quantidade *** (input number, máximo: quantidade disponível na origem, mínimo 1, step 1, apenas inteiros)
  - **Motivo *** (input text, obrigatório)
  - **Observações** (textarea, opcional)
- **Validações**: 
  - Quantidade deve ser inteira e maior que 0
  - Quantidade não pode ser maior que a disponível na origem
  - Prateleira destino não pode ser igual à origem
- **Botão**: "Registrar Transferência" (azul)

## Validações

### Entrada
- Produto, prateleira, quantidade e motivo obrigatórios
- Quantidade deve ser inteira e > 0

### Saída
- Produto, prateleira, quantidade e motivo obrigatórios
- Quantidade deve ser inteira e > 0
- Quantidade <= quantidade disponível na prateleira (atual - reservada)

### Ajuste
- Produto, prateleira, quantidade nova e motivo obrigatórios
- Quantidade nova deve ser inteira e >= 0

### Transferência
- Produto, prateleiras origem/destino, quantidade e motivo obrigatórios
- Quantidade deve ser inteira e > 0
- Prateleira destino ≠ origem
- Quantidade <= quantidade disponível na prateleira origem

## Rotas da API

### POST /estoque/entrada

**Request Body:**
```json
{
  "barbearia_id": "string",
  "produto_id": "string",
  "prateleira_id": "string",
  "quantidade": 0,
  "motivo": "string",
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
  "prateleira_id": "string",
  "quantidade": 0,
  "motivo": "string",
  "observacoes": "string | null"
}
```

**Response:**
```json
{
  "id": "string",
  "estoque_apos": 0,
  "mensagem": "Saída registrada com sucesso"
}
```

### POST /estoque/ajuste

**Request Body:**
```json
{
  "barbearia_id": "string",
  "produto_id": "string",
  "prateleira_id": "string",
  "quantidade_nova": 0,
  "motivo": "string",
  "observacoes": "string | null"
}
```

**Response:**
```json
{
  "id": "string",
  "estoque_apos": 0,
  "mensagem": "Ajuste registrado com sucesso"
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
  "motivo": "string",
  "observacoes": "string | null"
}
```

**Response:**
```json
{
  "id": "string",
  "estoque_origem_apos": 0,
  "estoque_destino_apos": 0,
  "mensagem": "Transferência registrada com sucesso"
}
```

## Stores

- `useEstoqueStore`:
  - `registrarEntrada(data)`: Registra entrada via `POST /estoque/entrada`, recarrega estoque do produto
  - `registrarSaida(data)`: Registra saída via `POST /estoque/saida`, recarrega estoque do produto
  - `ajustarEstoque(data)`: Registra ajuste via `POST /estoque/ajuste`, recarrega estoque do produto
  - `transferirEstoque(data)`: Registra transferência via `POST /estoque/transferencia`, recarrega estoque do produto
  - `consultarEstoqueProduto(produtoId)`: Consulta estoque via `GET /estoque/produto/{produtoId}?barbearia_id={id}`
  - `prateleirasAtivas`: Getter que filtra prateleiras ativas
  - `quantidadeDisponivel(produtoId)`: Getter que calcula quantidade disponível (atual - reservada)
- `useProdutosStore`: Lista de produtos para seleção


