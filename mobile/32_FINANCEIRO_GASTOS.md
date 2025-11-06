# Tela de Gastos de Colaboradores

## Visão Geral

Gerenciamento completo de gastos e reembolsos de colaboradores. Suporta gastos simples e parcelados, com controle de status (pendente, pago, atrasado).

## Layout Visual

### Header
- **Título**: "Gastos por Colaborador"
- **Subtítulo**: "Gerencie os gastos individuais dos colaboradores"
- **Botão**: "Voltar" (link para `/financeiro`)

### Cards de Resumo (Grid 4 colunas)
- **Total Pendente**: Badge amarelo, valor grande
- **Total Pago**: Badge verde, valor grande
- **Total Atrasado**: Badge vermelho, valor grande
- **Total Geral**: Badge cinza, valor grande

### Formulário (Card)
- **Título**: "Registrar Gasto"
- **Tipo de Gasto**: Radio buttons
  - **Gasto Simples**: Uma parcela única
  - **Gasto Parcelado**: Múltiplas parcelas
- **Campos Comuns**:
  - **Colaborador *** (select obrigatório)
  - **Descrição *** (input text obrigatório)
  - **Valor Total (R$) *** (input number obrigatório)
- **Campos Gasto Simples**:
  - **Data de Vencimento *** (date picker)
- **Campos Gasto Parcelado**:
  - **Número de Parcelas *** (input number, min 2, max 12)
  - **Data da Primeira Parcela *** (date picker)
  - **Valor por Parcela**: Exibido (calculado automaticamente)
- **Observações**: Textarea opcional
- **Botão**: "Registrar Gasto" (azul)

### Lista de Gastos
- **Filtros**: Por colaborador, período, status
- **Cada Item**:
  - Colaborador
  - Descrição
  - Valor total
  - Data de vencimento
  - Status (badge colorido)
  - Ações: Editar, Marcar como Pago, Excluir

## Rotas API

### GET /gastos-colaborador

**Query Params:**
- `barbearia_id` (obrigatório)
- `colaborador_id` (opcional)
- `mes` (opcional: YYYY-MM)
- `status` (opcional: "pendente" | "pago" | "atrasado")
- `data_inicio` (opcional: YYYY-MM-DD)
- `data_fim` (opcional: YYYY-MM-DD)
- `page` (opcional)
- `limit` (opcional)

**Response:**
```json
{
  "gastos": [
    {
      "id": "string",
      "colaborador_id": "string",
      "colaborador": {
        "id": "string",
        "nome": "string"
      },
      "descricao": "string",
      "valor_total": "0.00",
      "data_vencimento": "YYYY-MM-DD",
      "status": "pendente" | "pago" | "atrasado",
      "data_pagamento": "YYYY-MM-DD | null",
      "observacoes": "string | null"
    }
  ],
  "total": 0,
  "page": 1,
  "totalPages": 1
}
```

### POST /gastos-colaborador

**Query Params:**
- `barbearia_id` (obrigatório)

**Request Body:**
```json
{
  "colaborador_id": "string",
  "descricao": "string",
  "valor_total": 0.00,
  "data_vencimento": "YYYY-MM-DD",
  "observacoes": "string | null"
}
```

**Response:** Retorna o gasto criado

**Nota**: Para gastos parcelados, o frontend cria múltiplas chamadas POST (uma por parcela).

### GET /gastos-colaborador/{id}

**Path Params:**
- `id`: UUID do gasto

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** Retorna o gasto

### PUT /gastos-colaborador/{id}

**Path Params:**
- `id`: UUID do gasto

**Query Params:**
- `barbearia_id` (obrigatório)

**Request Body:** Mesmo formato do POST (todos os campos opcionais)

**Response:** Retorna o gasto atualizado

### PUT /gastos-colaborador/{id}/pagar

**Path Params:**
- `id`: UUID do gasto

**Query Params:**
- `barbearia_id` (obrigatório)

**Request Body:**
```json
{
  "data_pagamento": "YYYY-MM-DD"
}
```

**Response:** Retorna o gasto atualizado (status = "pago")

### DELETE /gastos-colaborador/{id}

**Path Params:**
- `id`: UUID do gasto

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** 204 No Content

### GET /gastos-colaborador/totais

**Query Params:**
- `barbearia_id` (obrigatório)
- `mes` (opcional: YYYY-MM)

**Response:** Array de totais

### GET /gastos-colaborador/pendentes/{colaborador_id}

**Path Params:**
- `colaborador_id`: UUID do colaborador

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** Array de gastos pendentes

### GET /gastos-colaborador/atrasados

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** Array de gastos atrasados

## Stores

- `useGastosStore`:
  - `listarGastos(filtros)`: Carrega lista via `GET /gastos-colaborador?barbearia_id={id}&...`
  - `criarGasto(gastoData)`: Cria via `POST /gastos-colaborador?barbearia_id={id}`
  - `criarGastosParcelados(dados)`: Cria múltiplas parcelas (chama `criarGasto` várias vezes)
  - `buscarGasto(id)`: Busca via `GET /gastos-colaborador/{id}?barbearia_id={id}`
  - `atualizarGasto(id, updates)`: Atualiza via `PUT /gastos-colaborador/{id}?barbearia_id={id}`
  - `marcarComoPago(id, dataPagamento?)`: Marca como pago via `PUT /gastos-colaborador/{id}/pagar?barbearia_id={id}`
  - `deletarGasto(id)`: Exclui via `DELETE /gastos-colaborador/{id}?barbearia_id={id}`
  - `carregarTotais(mes?)`: Carrega totais via `GET /gastos-colaborador/totais?barbearia_id={id}&...`
  - `carregarGastosPendentes(colaboradorId)`: Carrega via `GET /gastos-colaborador/pendentes/{colaboradorId}?barbearia_id={id}`
  - `carregarGastosAtrasados()`: Carrega via `GET /gastos-colaborador/atrasados?barbearia_id={id}`
  - `totalPendente`, `totalPago`, `totalAtrasado`, `totalGeral`: Getters que calculam totais
- `useAppStore`: Notificações

