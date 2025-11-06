# Tela de Prateleiras

## Visão Geral

Lista de prateleiras com filtros, busca e navegação para detalhes, criação e edição.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft, navega para `/estoque`
- **Título**: "Prateleiras"
- **Subtítulo**: "Gerencie as prateleiras da sua barbearia"
- **Botão**: "Nova Prateleira" (azul, com ícone Plus) - navega para `/estoque/prateleiras/novo`

### Filtros (Card)
- **Buscar por nome**: Input de texto, placeholder "Digite o nome da prateleira..."
- **Status**: Select com opções: "Todos", "Ativas", "Inativas"
- **Botão**: "Buscar" (azul, com ícone MagnifyingGlassIcon)

### Lista de Prateleiras
- **Header**: Título "Prateleiras ({count})" + botão "Atualizar" (cinza, com ícone ArrowPathIcon)
- **Loading**: Spinner com texto "Carregando prateleiras..."
- **Estado Vazio**: Ícone BuildingStorefrontIcon, título "Nenhuma prateleira encontrada", mensagem contextual, botão "Criar Prateleira" (se não houver filtros)
- **Grid de Cards** (3 colunas):
  - **Header**: Nome (grande), localização (pequeno), badge de status (Ativa/Inativa)
  - **Estatísticas**: Produtos (quantidade), Valor total (formatado)
  - **Ações**: 
    - "Ver Detalhes" (outline azul) - navega para `/estoque/prateleiras/{id}`
    - "Editar" (outline cinza) - navega para `/estoque/prateleiras/{id}/editar`

## Rotas API

### GET /prateleiras

**Query Params:**
- `barbearia_id` (obrigatório)
- `ativa` (opcional: true/false)
- `nome` (opcional: busca por nome)

**Response:**
```json
{
  "prateleiras": [
    {
      "id": "string",
      "nome": "string",
      "localizacao": "string",
      "capacidade_maxima": 0,
      "ativa": true,
      "criado_em": "YYYY-MM-DDTHH:mm:ss.sssZ",
      "atualizado_em": "YYYY-MM-DDTHH:mm:ss.sssZ"
    }
  ]
}
```

**Nota**: A API pode retornar `{ message: "...", prateleiras: [...] }` ou array direto.

### POST /prateleiras

**Request Body:**
```json
{
  "nome": "string",
  "localizacao": "string",
  "capacidade_maxima": 0,
  "barbearia_id": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "nome": "string",
  "localizacao": "string",
  "capacidade_maxima": 0,
  "ativa": true
}
```

### GET /prateleiras/{id}

**Path Params:**
- `id`: UUID da prateleira

**Response:** Mesmo formato do POST

### PUT /prateleiras/{id}

**Path Params:**
- `id`: UUID da prateleira

**Request Body:** Mesmo formato do POST (todos os campos opcionais)

**Response:** Retorna a prateleira atualizada

### DELETE /prateleiras/{id}

**Path Params:**
- `id`: UUID da prateleira

**Response:** 204 No Content

## Stores

- `useEstoqueStore`:
  - `listarPrateleiras(filtros?)`: Carrega lista via `GET /prateleiras?barbearia_id={id}&...`
  - `criarPrateleira(dados)`: Cria via `POST /prateleiras`
  - `buscarPrateleira(id)`: Busca via `GET /prateleiras/{id}`
  - `atualizarPrateleira(id, dados)`: Atualiza via `PUT /prateleiras/{id}`
  - `deletarPrateleira(id)`: Exclui via `DELETE /prateleiras/{id}`
  - `estoquePorPrateleira(prateleiraId)`: Getter que filtra estoque por prateleira

