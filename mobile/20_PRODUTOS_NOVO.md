# Tela de Cadastro de Produto

## Visão Geral

Formulário completo para cadastrar novo produto com configuração de comissões, impostos e taxas.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft
- **Título**: "Novo Produto"
- **Subtítulo**: "Cadastre um novo produto do catálogo"

### Formulário (Card)

#### Seção: Informações do Produto
- **Nome do Produto** * (obrigatório)
  - Placeholder: "Ex: Pomada, Cera, Shampoo"
- **Preço Padrão (R$)** * (obrigatório)
  - Tipo: text (com formatação de moeda)
  - Placeholder: "Ex: 25.50"
- **Meta Diária (quantidade)** (opcional)
  - Tipo: number, min="0", step="1"
  - Placeholder: "0"

#### Seção: Percentuais e Taxas
- **Grid 3 colunas**:
  - **Comissão (%)**: Input text com formatação
  - **Imposto (%)**: Input text com formatação
  - **Taxa Cartão (%)**: Input text com formatação (placeholder: "0.00")

**Info Box**: Explica que os percentuais de imposto e taxa de cartão ajudam a calcular o lucro líquido real do produto.

### Botões de Ação
- **Cancelar**: Outline cinza
- **Salvar Produto**: Roxo sólido

## Validações

- Nome e Preço Padrão obrigatórios
- Percentuais são opcionais (podem ser 0)

## Rotas API

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

## Stores

- `useProdutosStore`: 
  - `addProduct(data)`: Cria produto via `POST /produtos`
- `useBarbeariasStore`: Para obter `barbearia_id`
- `useAppStore`: Notificações

