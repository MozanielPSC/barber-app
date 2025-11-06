# Tela de Detalhes do Colaborador

## Visão Geral

Exibe informações completas do colaborador, estatísticas de desempenho, permissões e permite edição.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft
- **Título**: "Detalhes do Colaborador"
- **Subtítulo**: Nome do colaborador
- **Botões de Ação**:
  - "Editar" (azul)
  - "Excluir" (vermelho, com confirmação)
  - "Resetar Senha" (laranja, se tiver acesso)

### Modo Visualização

#### Card: Informações Pessoais
- **Avatar**: Círculo com iniciais ou foto
- **Nome**: Título grande
- **Função**: Badge ou texto destacado
- **Email**: Se tiver acesso ao sistema
- **Status**: Ativo/Inativo

#### Card: Estatísticas
- **Período**: Filtro (Hoje, Semana, Mês, Ano)
- **Métricas**:
  - Total de Serviços Realizados
  - Total de Produtos Vendidos
  - Comissão Total
  - Meta vs Realizado (gráfico de progresso)

#### Card: Permissões
- **Título**: "Permissões de Acesso"
- **Lista de Recursos**: Cada recurso mostra:
  - Nome do recurso
  - Ícones de ações permitidas (Visualizar, Criar, Editar, Excluir)
- **Botão**: "Editar Permissões"

### Modo Edição

Similar ao formulário de cadastro, mas com dados pré-preenchidos:
- Informações básicas (nome, função)
- Acesso ao sistema (email, senha - opcional)
- Permissões (checkboxes)

## Rotas da API

### GET /colaboradores/{id}

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
{
  "id": "string",
  "nome": "string",
  "funcao": "string",
  "email": "string | null",
  "barbearia_id": "string",
  "permissoes": {
    "atendimentos": {
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": true,
      "pode_excluir": false
    }
    // ... outros recursos
  },
  "estatisticas": {
    "servicos_hoje": 0,
    "servicos_mes": 0,
    "produtos_hoje": 0,
    "produtos_mes": 0,
    "comissao_hoje": 0,
    "comissao_mes": 0
  }
}
```

### PUT /colaboradores/{id}

**Request Body**: Mesmo formato do POST (cadastro)

### POST /colaboradores/{id}/reset-password

**Request Body:**
```json
{
  "nova_senha": "string"
}
```

**Response:**
```json
{
  "mensagem": "Senha resetada com sucesso"
}
```

### DELETE /colaboradores/{id}

**Query Params:**
- `barbearia_id` (obrigatório)

## Stores

- `useColaboradoresStore`: 
  - `loadColaborador(id)`: Carrega detalhes
  - `updateColaborador(id, data)`: Atualiza
  - `deleteColaborador(id)`: Exclui
  - `resetPassword(id, novaSenha)`: Reseta senha


