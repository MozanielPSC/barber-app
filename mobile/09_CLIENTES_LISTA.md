# Tela de Lista de Clientes

## Visão Geral

Lista de clientes cadastrados em formato de cards em grid. Permite busca por nome ou telefone e navegação para detalhes/cadastro.

## Layout Visual

### Header
- **Busca**: Input com ícone de lupa à esquerda, placeholder "Buscar por nome ou telefone..."
- **Botão Novo Cliente**: Azul, com ícone Plus, texto "Novo Cliente" (só se tiver permissão)

### Grid de Cards
- **Layout**: Grid responsivo (1 coluna mobile, 2 tablet, 3 desktop)
- **Gap**: 16px entre cards

### Card de Cliente
- **Avatar**: Círculo com gradiente azul-roxo, iniciais do nome
- **Nome**: Fonte semibold, truncate
- **Telefone**: Ícone de telefone + número
- **Origem**: Label + valor
- **Última visita**: Label + data formatada
- **Total de visitas**: Se houver, destacado em azul
- **Hover**: Shadow aumentada, borda muda de cor

### Estado Vazio
- **Ícone**: UserGroupIcon grande, cinza
- **Título**: "Nenhum cliente cadastrado" ou "Nenhum cliente encontrado"
- **Mensagem**: Texto explicativo
- **Botão**: "Adicionar Primeiro Cliente" (se não houver busca)

## Cores

- **Card Background**: Branco (dark: gray-800)
- **Card Border**: gray-200 (dark: gray-700)
- **Avatar Gradient**: from-blue-500 to-purple-600
- **Botão Novo**: bg-blue-600 hover:bg-blue-700

## Rotas da API

### GET /clientes

**Query Params:**
- `barbearia_id` (obrigatório)
- `busca` (opcional, busca por nome ou telefone)

**Response:**
```json
[
  {
    "id": "string",
    "nome": "string",
    "telefone": "string",
    "origem": "string",
    "quem_indicou": "string | null",
    "observacoes": "string | null",
    "criado_em": "string (ISO 8601)",
    "ultima_visita": "string | null (ISO 8601)",
    "ultima_compra_produto": "string | null (ISO 8601)"
  }
]
```

## Stores

- `useClientesStore`: 
  - `loadClients(searchQuery)`: Carrega lista
  - `filteredClients(query)`: Getter para busca local
- `usePermissions`: Verifica `canViewClientes`, `canCreateClientes`


