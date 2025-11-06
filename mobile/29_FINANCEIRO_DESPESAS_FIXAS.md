# Tela de Despesas Fixas

## Visão Geral

Lista e gerenciamento de despesas fixas mensais. Permite adicionar, editar inline e excluir despesas.

## Layout Visual

### Header
- **Título**: "Despesas Fixas"
- **Subtítulo**: "Gerencie suas despesas fixas mensais"
- **Botão**: "Voltar" (link para `/financeiro`)

### Formulário (Card)
- **Título**: "Adicionar Despesa Fixa"
- **Grid 3 colunas**:
  - **Categoria**: Input text, placeholder "Categoria (ex: Aluguel, Energia)"
  - **Valor**: Input number, step 0.01, placeholder "Valor (R$)"
  - **Botão**: "Adicionar" (azul, com ícone Plus)

### Lista (Card)
- **Header**: Título "Despesas Cadastradas" + Badge "Total: {valor}" (vermelho)
- **Estado Vazio**: Ícone SVG, texto "Nenhuma despesa fixa cadastrada"
- **Lista de Despesas** (editável inline):
  - **Categoria**: Título (bold)
  - **Valor**: Input number editável (max-width: 320px), atualiza ao perder foco (@blur)
  - **Valor Exibido**: Grande (text-2xl), bold
  - **Botão**: Excluir (vermelho, ícone lixeira)

## Rotas API

### GET /financeiro/despesas-fixas

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
[
  {
    "categoria": "string",
    "valor": 0.00
  }
]
```

### POST /financeiro/despesas-fixas

**Request Body:**
```json
{
  "categoria": "string",
  "valor": 0.00,
  "mes_referencia": "YYYY-MM",
  "barbearia_id": "string"
}
```

**Response:**
```json
{
  "categoria": "string",
  "valor": 0.00
}
```

**Nota**: `mes_referencia` é gerado automaticamente (mês atual).

## Stores

- `useFinanceiroStore`:
  - `loadFixedExpenses()`: Carrega lista via `GET /financeiro/despesas-fixas?barbearia_id={id}`
  - `addFixedExpense(expense)`: Adiciona via `POST /financeiro/despesas-fixas`
  - `updateFixedExpense(index, updates)`: Atualiza localmente (não há PUT na API, edição é apenas local)
  - `deleteFixedExpense(index)`: Remove localmente (não há DELETE na API, exclusão é apenas local)
- `useAppStore`: Notificações

