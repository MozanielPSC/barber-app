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

### Modo Visualização

#### Card: Informações Pessoais
- **Avatar**: Círculo com iniciais (gradiente azul-roxo)
- **Nome**: Título grande (24px), bold
- **Função**: Texto destacado
- **Email**: Se tiver acesso ao sistema (com ícone)
- **Status**: Badge (Ativo/Inativo)

#### Card: Serviços que Realiza
- **Título**: "Serviços que Realiza" com ícone WrenchScrewdriverIcon
- **Botão**: "Adicionar Serviço" (roxo)
- **Lista**: Grid de cards com nome e preço de cada serviço
- **Ação**: Botão X para remover serviço
- **Estado Vazio**: Ícone + mensagem "Nenhum serviço associado"

#### Card: Disponibilidade
- **Título**: "Horários de Trabalho"
- **Lista**: Dias da semana com horários configurados
- **Botão**: "Gerenciar Disponibilidade" (abre modal)

#### Card: Permissões
- **Título**: "Permissões de Acesso"
- **Lista de Recursos**: Cada recurso mostra:
  - Nome do recurso
  - Ícones de ações permitidas (Visualizar, Criar, Editar, Excluir)
- **Botão**: "Editar Permissões"

### Modo Edição

Formulário simplificado com dados pré-preenchidos:
- Informações básicas (nome, função)
- Status (ativo/inativo - checkbox)

**Nota**: Email, senha e permissões são gerenciados separadamente através de modais/botões específicos.

## Rotas da API

### GET /colaboradores/{id}

**Path Params:**
- `id`: UUID do colaborador

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
  "ativo": true,
  "permissoes": {
    "atendimentos": {
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": true,
      "pode_excluir": false
    },
    "clientes": {
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": true,
      "pode_excluir": false
    },
    "produtos": {
      "pode_visualizar": true,
      "pode_criar": false,
      "pode_editar": false,
      "pode_excluir": false
    },
    "servicos": {
      "pode_visualizar": true,
      "pode_criar": false,
      "pode_editar": false,
      "pode_excluir": false
    },
    "financeiro": {
      "pode_visualizar": false,
      "pode_editar": false
    },
    "configuracoes": {
      "pode_visualizar": false,
      "pode_editar": false
    },
    "pote": {
      "pode_visualizar": false,
      "pode_criar": false,
      "pode_editar": false,
      "pode_excluir": false
    }
  }
}
```

### PUT /colaboradores/{id}

**Path Params:**
- `id`: UUID do colaborador

**Request Body:**
```json
{
  "nome": "string",
  "funcao": "string",
  "ativo": true,
  "barbearia_id": "string"
}
```

**Response:** Retorna o colaborador atualizado

### PUT /colaboradores/{id}/permissoes

**Path Params:**
- `id`: UUID do colaborador

**Request Body:**
```json
{
  "barbearia_id": "string",
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
```

**Response:** Retorna as permissões atualizadas

### DELETE /colaboradores/{id}

**Path Params:**
- `id`: UUID do colaborador

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** 204 No Content

## Stores

- `useColaboradoresStore`: 
  - `buscarColaborador(id, barbeariaId?)`: Carrega detalhes via `GET /colaboradores/{id}`
  - `atualizarColaborador(id, updates)`: Atualiza via `PUT /colaboradores/{id}`
  - `deletarColaborador(id, barbeariaId?)`: Exclui via `DELETE /colaboradores/{id}`
  - `atualizarPermissoes(id, permissoes, barbeariaId?)`: Atualiza permissões via `PUT /colaboradores/{id}/permissoes`
  - `listarDisponibilidades(id)`: Lista horários via `GET /colaboradores/{id}/disponibilidade`
  - `definirDisponibilidade(id, diaSemana, horarioInicio, horarioFim)`: Define horário via `POST /colaboradores/{id}/disponibilidade`
  - `listarServicosColaborador(id)`: Lista serviços via `GET /colaboradores/{id}/servicos`
  - `associarServico(id, servicoId)`: Associa serviço via `POST /colaboradores/{id}/servicos`
  - `desassociarServico(id, servicoId)`: Remove serviço via `DELETE /colaboradores/{id}/servicos/{servicoId}`
- `useServicosStore`: Para listar serviços disponíveis


