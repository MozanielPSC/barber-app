# Tela de Lista de Atendimentos

## Visão Geral

Lista de atendimentos realizados com filtros por data, colaborador, cliente.

## Layout

- Filtros no topo (data, colaborador, cliente)
- Lista ou cards de atendimentos
- Cada item mostra: data, cliente, colaborador, serviços, produtos, total

## Rotas API

- `GET /atendimentos?barbearia_id=X&data_inicio=&data_fim=&colaborador_id=&cliente_id=`

## Stores

- `useAtendimentosStore`

