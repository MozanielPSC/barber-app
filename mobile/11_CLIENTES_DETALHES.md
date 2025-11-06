# Tela de Detalhes do Cliente

## Visão Geral

Exibe informações completas do cliente com modo de visualização e edição. Permite ver histórico e criar novos atendimentos.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft, navega para lista
- **Título**: "Detalhes do Cliente" ou "Editar Cliente" (modo edição)
- **Subtítulo**: Nome do cliente
- **Botões de Ação** (modo visualização):
  - "Ver Histórico" (verde, com ícone de relógio)
  - "Editar" (azul, com ícone de lápis)

### Modo Visualização

#### Card de Informações
- **Avatar**: Círculo grande (80px) com gradiente azul-roxo, iniciais do nome
- **Nome**: Título grande (24px), bold
- **Telefone**: Com ícone PhoneIcon

#### Grid de Dados (2 colunas)
- **Origem**: Label uppercase + valor
- **Indicado por**: Label uppercase + valor
- **Última Visita**: Label uppercase + data formatada
- **Total de Visitas**: Label uppercase + número
- **Observações**: Span 2 colunas, texto formatado (whitespace-pre-wrap)

### Modo Edição

Formulário similar ao de cadastro, com campos pré-preenchidos:
- Nome Completo *
- Telefone *
- Origem (select)
- Quem Indicou?
- Observações (textarea)

**Botões**:
- Cancelar (outline cinza)
- Salvar Alterações (azul sólido)

## Estados

- **Loading**: Spinner centralizado com texto "Carregando cliente..."
- **Erro**: Notificação de erro, redireciona para lista

## Rotas API

### GET /clientes/{id}

**Response:**
```json
{
  "id": "string",
  "nome": "string",
  "telefone": "string",
  "origem": "string",
  "quem_indicou": "string | null",
  "observacoes": "string | null",
  "criado_em": "string",
  "ultima_visita": "string | null",
  "ultima_compra_produto": "string | null",
  "total_visitas": 0
}
```

### PUT /clientes/{id}

**Request Body:**
```json
{
  "nome": "string",
  "telefone": "string",
  "origem": "string",
  "quem_indicou": "string | null",
  "observacoes": "string | null",
  "barbearia_id": "string"
}
```

### DELETE /clientes/{id}

**Query Params:**
- `barbearia_id` (obrigatório)

## Stores

- `useClientesStore`: 
  - `loadClients()`: Carrega lista (busca cliente na store)
  - `updateClient(id, data)`: Atualiza cliente
  - `deleteClient(id)`: Exclui cliente
- `useAppStore`: Notificações


