# Tela de Prateleiras

## Visão Geral

Gerenciamento de prateleiras de estoque.

## Layout

- Lista de prateleiras
- Cada prateleira mostra: nome, produtos, capacidade
- Botão "Nova Prateleira"
- Navegação para detalhes da prateleira

## Rotas API

- `GET /estoque/prateleiras?barbearia_id=X`
- `POST /estoque/prateleiras`: Criar
- `PUT /estoque/prateleiras/{id}`: Editar
- `DELETE /estoque/prateleiras/{id}`: Excluir

