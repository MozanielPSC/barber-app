# Tela de Canais de Marketing

## Visão Geral

Gerenciamento de gastos com canais de marketing. Permite adicionar, editar inline e excluir canais.

## Layout Visual

### Header
- **Título**: "Canais de Marketing"
- **Subtítulo**: "Gerencie seus canais e gastos com marketing"
- **Botão**: "Voltar" (link para `/financeiro`)

### Formulário (Card)
- **Título**: "Adicionar Canal"
- **Grid 3 colunas**:
  - **Nome do Canal**: Input text, placeholder "Nome do Canal (ex: Google Ads, Facebook)"
  - **Gasto Mensal**: Input number, step 0.01, placeholder "Gasto Mensal (R$)"
  - **Botão**: "Adicionar" (azul, com ícone Plus)

### Lista (Card)
- **Header**: Título "Canais Cadastrados" + Badge "Total: {valor}" (índigo)
- **Estado Vazio**: Ícone SVG, texto "Nenhum canal cadastrado"
- **Lista de Canais** (editável inline):
  - **Nome**: Input text editável, atualiza ao perder foco (@blur)
  - **Gasto Mensal**: Input number editável, atualiza ao perder foco (@blur)
  - **Valor Exibido**: Grande (text-2xl), bold
  - **Botão**: Excluir (vermelho, ícone lixeira)

## Rotas API

### GET /financeiro/canais

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
[
  {
    "nome": "string",
    "gasto": 0.00
  }
]
```

### POST /financeiro/canais

**Request Body:**
```json
{
  "nome": "string",
  "gasto": 0.00,
  "mes_referencia": "YYYY-MM",
  "barbearia_id": "string"
}
```

**Response:**
```json
{
  "nome": "string",
  "gasto": 0.00
}
```

**Nota**: `mes_referencia` é gerado automaticamente (mês atual).

## Stores

- `useFinanceiroStore`:
  - `loadChannels()`: Carrega lista via `GET /financeiro/canais?barbearia_id={id}`
  - `addChannel(channel)`: Adiciona via `POST /financeiro/canais`
  - `updateChannel(index, updates)`: Atualiza localmente (não há PUT na API, edição é apenas local)
  - `deleteChannel(index)`: Remove localmente (não há DELETE na API, exclusão é apenas local)
- `useAppStore`: Notificações

