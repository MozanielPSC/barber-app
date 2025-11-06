# Tela de Detalhes do Atendimento

## Visão Geral

Exibe informações completas do atendimento com modo de visualização e edição. Permite editar, excluir e concluir atendimento.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft, navega para lista
- **Título**: "Detalhes do Atendimento" ou "Editar Atendimento" (modo edição)
- **Subtítulo**: Data do atendimento formatada
- **Botão de Ação** (modo visualização):
  - "Editar" (azul, com ícone PencilIcon)

### Modo Visualização

#### Card Principal
- **Header**:
  - Ícone: Círculo grande (64px) com gradiente azul-roxo, CalendarDaysIcon
  - Nome do cliente: Título grande (20px), bold
  - Data e horário: Data formatada, horário início-fim (se houver)
  - Total: Grande (text-3xl), azul, bold
- **Grid de Informações** (3 colunas):
  - **Canal**: Nome do canal de origem
  - **Status**: Badge "Compareceu" (verde) / "Não compareceu" (amarelo)
  - **Tipo de Visita**: Badge "Primeira Visita" (índigo) ou "Retorno"
- **Serviços Realizados** (se houver):
  - Título: "Serviços Realizados"
  - Lista de cards azuis com nome do serviço, badge "Feito por mim" (se aplicável), preço
- **Produtos Vendidos** (se houver):
  - Título: "Produtos Vendidos"
  - Lista de cards roxos com nome do produto, quantidade, badge "Vendido por mim" (se aplicável), subtotal
- **Observações** (se houver):
  - Título: "Observações"
  - Texto formatado em card cinza

#### Card de Ações
- **Título**: "Ações"
- **Botões**:
  - "Concluir Atendimento" (verde, com ícone CheckCircleIcon) - se não compareceu
  - "Marcar como Não Compareceu" (amarelo) - se compareceu
  - "Excluir" (vermelho, com ícone TrashIcon)

### Modo Edição

Formulário similar ao de cadastro, com campos pré-preenchidos:
- Data *
- Cliente *
- Colaborador *
- Horário (Início, Fim)
- Origem e Status (Canal, Checkboxes)
- Serviços (lista editável)
- Produtos (lista editável)
- Observações

**Botões**:
- Cancelar (outline cinza)
- Salvar Alterações (azul sólido)

## Estados

- **Loading**: Spinner centralizado com texto "Carregando atendimento..."
- **Erro**: Notificação de erro, redireciona para lista

## Rotas API

### GET /atendimentos/{id}

**Path Params:**
- `id`: UUID do atendimento

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** Mesmo formato da lista (objeto único)

**Nota**: Não há rota específica para buscar um atendimento individual. O atendimento é carregado da store que busca todos via `GET /atendimentos?barbearia_id={id}` e filtra localmente pelo ID.

### PUT /atendimentos/{id}

**Path Params:**
- `id`: UUID do atendimento

**Request Body:**
```json
{
  "data": "YYYY-MM-DD",
  "cliente_id": "string",
  "horario_inicio": "HH:MM",
  "horario_fim": "HH:MM",
  "origem": "string",
  "observacoes": "string | null",
  "compareceu": true,
  "primeira_visita": true,
  "barbearia_id": "string",
  "colaborador_id": "string",
  "servicos": [...],
  "produtos": [...]
}
```

**Response:** Retorna o atendimento atualizado

### DELETE /atendimentos/{id}

**Path Params:**
- `id`: UUID do atendimento

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** 204 No Content

## Stores

- `useAtendimentosStore`: 
  - `loadVisits()`: Carrega lista (busca atendimento na store localmente pelo ID)
  - `updateVisit(id, visitData)`: Atualiza via `PUT /atendimentos/{id}`
  - `deleteVisit(id)`: Exclui via `DELETE /atendimentos/{id}?barbearia_id={id}`
- `useClientesStore`: Para buscar nomes dos clientes
- `useAppStore`: Notificações

