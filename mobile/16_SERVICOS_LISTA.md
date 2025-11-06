# Tela de Lista de Serviços

## Visão Geral

Lista de serviços cadastrados em formato de grid de cards. Permite busca por nome e navegação para detalhes/cadastro.

## Layout Visual

### Header
- **Busca**: Input com ícone de lupa à esquerda, placeholder "Buscar serviços..."
- **Botão**: "Novo Serviço" (azul, com ícone Plus)

### Grid de Cards (Responsivo)
- **Layout**: Grid responsivo (1 coluna mobile, 2 tablet, 3 desktop)
- **Gap**: 16px entre cards

### Card de Serviço
- **Header**:
  - Ícone: Círculo com gradiente azul-cyan, WrenchScrewdriverIcon
  - Nome do serviço (truncate)
  - Preço padrão (grande, azul, bold)
- **Informações**:
  - Comissão Principal (percentual)
  - Comissão Assistente (se houver, verde)
  - Comissão Indicador (se houver, roxo)
  - Meta diária (quantidade de unidades)
- **Hover**: Shadow aumentada, borda muda de cor
- **Click**: Navega para `/servicos/{id}`

### Estado Vazio
- **Ícone**: WrenchScrewdriverIcon grande, cinza
- **Título**: "Nenhum serviço encontrado"
- **Mensagem**: "Comece adicionando seu primeiro serviço"
- **Botão**: "Adicionar Primeiro Serviço"

## Funcionalidades

- **Busca**: Filtra serviços por nome em tempo real
- **Navegação**: Cards clicáveis redirecionam para detalhes
- **Visualização**: Mostra todas as informações principais do serviço

## Rotas API

### GET /servicos

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
[
  {
    "id": "string",
    "nome": "string",
    "preco_padrao": "0.00",
    "percentual_comissao_executor": 0.5,
    "percentual_comissao_assistente": 0.1,
    "percentual_comissao_indicacao": 0.05,
    "meta_diaria_qtd": 10
  }
]
```

**Nota**: 
- `percentual_comissao_executor`: Percentual do executor (0-1, ex: 0.5 = 50%)
- `percentual_comissao_assistente`: Percentual do assistente (opcional, 0-1)
- `percentual_comissao_indicacao`: Percentual do indicador (opcional, 0-1)
- `meta_diaria_qtd`: Quantidade de unidades na meta diária

### POST /servicos

**Request Body:**
```json
{
  "nome": "string",
  "preco_padrao": 0.00,
  "percentual_comissao_executor": 0.5,
  "percentual_comissao_assistente": 0.1,
  "percentual_comissao_indicacao": 0.05,
  "meta_diaria_qtd": 10,
  "barbearia_id": "string"
}
```

**Nota**: 
- `percentual_comissao_assistente` e `percentual_comissao_indicacao` são opcionais
- `meta_diaria_qtd` é opcional (pode ser 0)

### PUT /servicos/{id}

**Path Params:**
- `id`: UUID do serviço

**Request Body**: Mesmo formato do POST (todos os campos opcionais, apenas os que serão atualizados)

**Response:** Retorna o serviço atualizado

### DELETE /servicos/{id}

**Path Params:**
- `id`: UUID do serviço

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** 204 No Content

## Stores

- `useServicosStore`:
  - `loadServices()`: Carrega lista via `GET /servicos?barbearia_id={id}`
  - `addService(data)`: Adiciona via `POST /servicos`
  - `updateService(id, updates)`: Atualiza via `PUT /servicos/{id}`
  - `deleteService(id)`: Exclui via `DELETE /servicos/{id}?barbearia_id={id}`


