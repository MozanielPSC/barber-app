# Tela de Detalhes do Produto

## Visão Geral

Exibe informações completas do produto com modo de visualização e edição. Permite editar e excluir produto.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft, navega para lista
- **Título**: "Detalhes do Produto" ou "Editar Produto" (modo edição)
- **Subtítulo**: Nome do produto
- **Botões de Ação** (modo visualização):
  - "Editar" (roxo, com ícone PencilIcon)
  - "Excluir" (vermelho, com ícone TrashIcon)

### Modo Visualização

#### Card Principal
- **Header**:
  - Ícone: Círculo grande (80px) com gradiente roxo-pink, ShoppingBagIcon
  - Nome: Título grande (24px), bold
  - Subtítulo: "Produto do Catálogo"
  - Preço padrão: Grande (text-3xl), roxo, bold
- **Grid de Informações** (2 colunas):
  - **Comissão**: Percentual + valor calculado por venda
  - **Meta Diária**: Quantidade + faturamento calculado
  - **Imposto**: Percentual + valor calculado por venda
  - **Taxa de Cartão**: Percentual + valor calculado por venda

#### Card de Estatísticas
- **Título**: "Estatísticas" com ícone ChartBarIcon
- **Conteúdo**: Placeholder informando que estatísticas estarão disponíveis em breve
- **Background**: Gradiente roxo-pink claro

### Modo Edição

Formulário similar ao de cadastro, com campos pré-preenchidos:
- Nome do Produto *
- Preço Padrão (R$) *
- Meta Diária (quantidade)
- Comissão (%)
- Imposto (%)
- Taxa Cartão (%)

**Botões**:
- Cancelar (outline cinza)
- Salvar Alterações (roxo sólido)

## Estados

- **Loading**: Spinner centralizado com texto "Carregando produto..."
- **Erro**: Notificação de erro, redireciona para lista

## Rotas API

### GET /produtos

**Nota**: Não há rota específica para buscar um produto individual. O produto é carregado da store que busca todos os produtos via `GET /produtos?barbearia_id={id}` e filtra localmente pelo ID.

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** Array de produtos (mesmo formato da lista)

### PUT /produtos/{id}

**Path Params:**
- `id`: UUID do produto

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

**Response:** Retorna o produto atualizado

### DELETE /produtos/{id}

**Path Params:**
- `id`: UUID do produto

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** 204 No Content

## Stores

- `useProdutosStore`: 
  - `loadProducts()`: Carrega lista (busca produto na store localmente pelo ID)
  - `updateProduct(id, updates)`: Atualiza via `PUT /produtos/{id}`
  - `deleteProduct(id)`: Exclui via `DELETE /produtos/{id}?barbearia_id={id}`
- `useAppStore`: Notificações

