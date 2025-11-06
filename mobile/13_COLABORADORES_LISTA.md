# Tela de Lista de Colaboradores

## Visão Geral

Lista de colaboradores da barbearia (só para proprietários).

## Layout

Similar à lista de clientes: grid de cards com busca e botão "Novo Colaborador".

## Rotas API

### GET /colaboradores

**Query Params:**
- `barbearia_id` (obrigatório)
- `busca` (opcional, busca por nome ou função)

**Response:**
```json
[
  {
    "id": "string",
    "nome": "string",
    "funcao": "string",
    "email": "string | null",
    "barbearia_id": "string",
    "ativo": true,
    "permissoes": {
      "atendimentos": {
        "pode_visualizar": true,
        "pode_criar": true,
        "pode_editar": true,
        "pode_excluir": false
      }
      // ... outros recursos
    }
  }
]
```

## Stores

- `useColaboradoresStore`: 
  - `loadColaboradores(barbeariaId?, busca?)`: Carrega lista de colaboradores
  - `filtrarColaboradores(filtro)`: Filtra colaboradores localmente

