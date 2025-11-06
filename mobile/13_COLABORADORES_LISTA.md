# Tela de Lista de Colaboradores

## Visão Geral

Lista de colaboradores da barbearia (só para proprietários).

## Layout

Similar à lista de clientes: grid de cards com busca e botão "Novo Colaborador".

## Rotas API

- `GET /colaboradores?barbearia_id=X`
- `POST /colaboradores`: Criar
- `PUT /colaboradores/{id}`: Editar
- `DELETE /colaboradores/{id}`: Excluir

## Stores

- `useColaboradoresStore`

