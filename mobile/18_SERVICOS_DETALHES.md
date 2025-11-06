# Tela de Detalhes do Serviço

## Visão Geral

Exibe informações completas do serviço com modo de visualização e edição. Permite editar e excluir serviço.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft, navega para lista
- **Título**: "Detalhes do Serviço" ou "Editar Serviço" (modo edição)
- **Subtítulo**: Nome do serviço
- **Botões de Ação** (modo visualização):
  - "Editar" (azul, com ícone PencilIcon)
  - "Excluir" (vermelho, com ícone TrashIcon)

### Modo Visualização

#### Card Principal
- **Header**:
  - Ícone: Círculo grande (80px) com gradiente azul-cyan, WrenchScrewdriverIcon
  - Nome: Título grande (24px), bold
  - Subtítulo: "Serviço do Catálogo"
  - Preço padrão: Grande (text-3xl), azul, bold
- **Grid de Informações** (2 colunas):
  - **Comissão Principal**: Percentual + valor calculado por serviço
  - **Comissão Assistente**: Se houver, verde, percentual + valor
  - **Comissão Indicador**: Se houver, roxo, percentual + valor
  - **Meta Diária**: Quantidade + faturamento calculado

#### Card de Estatísticas
- **Título**: "Estatísticas" com ícone ChartBarIcon
- **Conteúdo**: Placeholder informando que estatísticas estarão disponíveis em breve
- **Background**: Gradiente azul-cyan claro

### Modo Edição

Formulário similar ao de cadastro, com campos pré-preenchidos:
- Nome do Serviço *
- Preço Padrão (R$) *
- Meta Diária (quantidade)
- Comissão Principal (%)
- Comissão Assistente (%) (opcional)
- Comissão Indicador (%) (opcional)

**Botões**:
- Cancelar (outline cinza)
- Salvar Alterações (azul sólido)

## Estados

- **Loading**: Spinner centralizado com texto "Carregando serviço..."
- **Erro**: Notificação de erro, redireciona para lista

## Rotas API

### GET /servicos

**Nota**: Não há rota específica para buscar um serviço individual. O serviço é carregado da store que busca todos os serviços via `GET /servicos?barbearia_id={id}` e filtra localmente pelo ID.

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** Array de serviços (mesmo formato da lista)

### PUT /servicos/{id}

**Path Params:**
- `id`: UUID do serviço

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

**Response:** Retorna o serviço atualizado

### DELETE /servicos/{id}

**Path Params:**
- `id`: UUID do serviço

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** 204 No Content

## Stores

- `useServicosStore`: 
  - `loadServices()`: Carrega lista (busca serviço na store localmente pelo ID)
  - `updateService(id, updates)`: Atualiza via `PUT /servicos/{id}`
  - `deleteService(id)`: Exclui via `DELETE /servicos/{id}?barbearia_id={id}`
- `useAppStore`: Notificações

