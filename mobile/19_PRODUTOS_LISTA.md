# Tela de Lista de Produtos

## Visão Geral

Lista de produtos cadastrados em formato de grid de cards. Permite busca por nome e navegação para detalhes/cadastro.

## Layout Visual

### Header
- **Busca**: Input com ícone de lupa à esquerda, placeholder "Buscar produtos..."
- **Botão**: "Novo Produto" (roxo, com ícone Plus)

### Grid de Cards (Responsivo)
- **Layout**: Grid responsivo (1 coluna mobile, 2 tablet, 3 desktop)
- **Gap**: 16px entre cards

### Card de Produto
- **Header**:
  - Ícone: Círculo com gradiente roxo-pink, ShoppingBagIcon
  - Nome do produto (truncate)
  - Preço padrão (grande, roxo, bold)
- **Informações**:
  - Comissão (percentual)
  - Meta diária (quantidade de unidades)
  - Impostos (percentual)
- **Hover**: Shadow aumentada, borda muda de cor
- **Click**: Navega para `/produtos/{id}`

### Estado Vazio
- **Ícone**: ShoppingBagIcon grande, cinza
- **Título**: "Nenhum produto encontrado"
- **Mensagem**: "Comece adicionando seu primeiro produto"
- **Botão**: "Adicionar Primeiro Produto"

## Funcionalidades

- **Busca**: Filtra produtos por nome em tempo real
- **Navegação**: Cards clicáveis redirecionam para detalhes
- **Visualização**: Mostra informações principais do produto

### Diferenças de Serviços
- Campos adicionais: % Imposto, % Taxa Cartão
- Não tem: % Assistente, % Indicador

## Rotas API

### GET /produtos

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
[
  {
    "id": "string",
    "nome": "string",
    "preco_padrao": "0.00",
    "percentual_comissao": 0.5,
    "percentual_imposto": 0.1,
    "percentual_cartao": 0.05,
    "meta_diaria_qtd": 10
  }
]
```

**Nota**: 
- `percentual_comissao`: Percentual de comissão (0-1, ex: 0.5 = 50%)
- `percentual_imposto`: Percentual de imposto (0-1)
- `percentual_cartao`: Percentual de taxa de cartão (0-1)
- `meta_diaria_qtd`: Quantidade de unidades na meta diária

### POST /produtos

**Request Body:**
```json
{
  "nome": "string",
  "preco_padrao": 0.00,
  "percentual_comissao": 0.5,
  "percentual_imposto": 0.1,
  "percentual_cartao": 0.05,
  "meta_diaria_qtd": 10,
  "barbearia_id": "string"
}
```

**Nota**: Todos os campos percentuais são opcionais (podem ser 0). `meta_diaria_qtd` é opcional.

**Response:**
```json
{
  "id": "string",
  "nome": "string",
  "preco_padrao": "0.00",
  "percentual_comissao": 0.5,
  "percentual_imposto": 0.1,
  "percentual_cartao": 0.05,
  "meta_diaria_qtd": 10
}
```

### PUT /produtos/{id}

**Path Params:**
- `id`: UUID do produto

**Request Body**: Mesmo formato do POST (todos os campos opcionais, apenas os que serão atualizados)

**Response:** Retorna o produto atualizado

### DELETE /produtos/{id}

**Path Params:**
- `id`: UUID do produto

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** 204 No Content

## Stores

- `useProdutosStore`:
  - `loadProducts()`: Carrega lista via `GET /produtos?barbearia_id={id}`
  - `addProduct(data)`: Adiciona via `POST /produtos`
  - `updateProduct(id, updates)`: Atualiza via `PUT /produtos/{id}`
  - `deleteProduct(id)`: Exclui via `DELETE /produtos/{id}?barbearia_id={id}`


