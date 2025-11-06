# Tela de Gastos de Colaboradores

## Visão Geral

Lista de gastos/reembolsos de colaboradores.

## Layout

- Lista de gastos
- Filtros por colaborador, período
- Botão "Novo Gasto"
- Cada item: colaborador, descrição, valor, data, status

## Rotas API

- `GET /gastos?barbearia_id=X`
- `POST /gastos`
- `PUT /gastos/{id}`
- `DELETE /gastos/{id}`

## Stores

- `useGastosStore`

