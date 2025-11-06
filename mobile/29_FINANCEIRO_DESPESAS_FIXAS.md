# Tela de Despesas Fixas

## Visão Geral

Lista e gerenciamento de despesas fixas mensais.

## Layout

- Lista de despesas fixas
- Botão "Adicionar Despesa"
- Cada item: categoria, valor, ações (editar, excluir)

## Rotas API

- `GET /financeiro/despesas-fixas?barbearia_id=X&mes=YYYY-MM`
- `POST /financeiro/despesas-fixas`
- `PUT /financeiro/despesas-fixas/{id}`
- `DELETE /financeiro/despesas-fixas/{id}`

## Stores

- `useFinanceiroStore`: loadFixedExpenses, addFixedExpense, etc.

