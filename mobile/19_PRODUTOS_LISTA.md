# Tela de Lista de Produtos

## Visão Geral

Lista de produtos cadastrados em formato de tabela editável inline, similar a serviços mas com campos adicionais de impostos e taxas.

## Layout Visual

### Tabela (Desktop)
- **Colunas**:
  1. Nome (input editável)
  2. Preço (R$) (input number)
  3. % Comissão (input number, 0-1)
  4. % Imposto (input number, 0-1)
  5. % Cartão (input number, 0-1)
  6. Meta q/dia (input number)
  7. Ações (botão salvar/excluir)

### Diferenças de Serviços
- Campos adicionais: % Imposto, % Cartão
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
    "preco_padrao": 0,
    "percentual_comissao": 0,
    "percentual_imposto": 0,
    "percentual_taxa_cartao": 0,
    "meta_diaria": 0,
    "estoque_atual": 0
  }
]
```

### POST /produtos

**Request Body:**
```json
{
  "nome": "string",
  "preco_padrao": 0,
  "percentual_comissao": 0,
  "percentual_imposto": 0,
  "percentual_taxa_cartao": 0,
  "meta_diaria": 0,
  "estoque_inicial": 0,
  "barbearia_id": "string"
}
```

## Stores

- `useProdutosStore`: Similar a serviços

## Implementação React Native

Similar a serviços, mas com campos adicionais de impostos e taxas.

