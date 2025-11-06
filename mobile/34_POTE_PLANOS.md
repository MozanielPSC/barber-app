# Tela de Planos de Assinatura

## Visão Geral

Lista e gerenciamento de planos de assinatura. Permite criar, editar e excluir planos.

## Layout Visual

### Header
- **Título**: "Planos de Assinatura"
- **Subtítulo**: "Gerencie os planos disponíveis para venda"
- **Checkbox**: "Apenas ativos" (filtra planos ativos)
- **Botão**: "Novo Plano" (azul, com ícone Plus) - navega para `/pote/planos/novo`

### Lista de Planos
- **Loading**: Spinner com texto "Carregando planos..."
- **Estado Vazio**: Ícone GiftIcon, título "Nenhum plano encontrado", mensagem, botão "Criar Primeiro Plano"
- **Grid de Cards** (3 colunas):
  - **Card de Plano** (componente `PlanoCard`):
    - **Header**: Nome do plano, badge de status (Ativo/Inativo)
    - **Informações**: Valor, duração, tipo, fichas (se aplicável)
    - **Ações**: 
      - "Ver Detalhes" (azul) - navega para `/pote/planos/{id}`
      - "Editar" (cinza) - navega para `/pote/planos/{id}`
      - "Excluir" (vermelho) - com confirmação

### Página de Detalhes/Edição (`/pote/planos/{id}`)
- **Header**: Nome do plano, botão "Voltar"
- **Formulário**: Componente `FormPlano` com campos editáveis

## Rotas API

### GET /pote/planos/{barbearia_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia

**Query Params:**
- `apenas_ativos` (opcional: true/false)

**Response:**
```json
[
  {
    "id": "string",
    "nome": "string",
    "barbearia_id": "string",
    "configuracao_pote_id": "string",
    "valor": 0.00,
    "duracao_meses": 1,
    "fichas_iniciais": 0,
    "tipo_plano": "ilimitado" | "fichas_fixas" | "valor_manual",
    "ativo": true,
    "criado_em": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "atualizado_em": "YYYY-MM-DDTHH:mm:ss.sssZ"
  }
]
```

### GET /pote/planos/{barbearia_id}/{plano_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `plano_id`: UUID do plano

**Response:** Mesmo formato do array acima (objeto único)

### POST /pote/planos/{barbearia_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia

**Request Body:**
```json
{
  "nome": "string",
  "configuracao_pote_id": "string",
  "valor": 0.00,
  "duracao_meses": 1,
  "fichas_iniciais": 0,
  "tipo_plano": "ilimitado" | "fichas_fixas" | "valor_manual",
  "ativo": true
}
```

**Response:** Retorna o plano criado

### PUT /pote/planos/{barbearia_id}/{plano_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `plano_id`: UUID do plano

**Request Body:** Mesmo formato do POST (todos os campos opcionais)

**Response:** Retorna o plano atualizado

### DELETE /pote/planos/{barbearia_id}/{plano_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `plano_id`: UUID do plano

**Response:** 204 No Content

## Stores

- `usePoteStore`:
  - `loadPlanos(barbeariaId?, apenasAtivos?)`: Carrega lista via `GET /pote/planos/{barbearia_id}?apenas_ativos={true}`
  - `loadPlano(barbeariaId, planoId)`: Busca via `GET /pote/planos/{barbearia_id}/{plano_id}`
  - `criarPlano(barbeariaId, planoData)`: Cria via `POST /pote/planos/{barbearia_id}`
  - `atualizarPlano(barbeariaId, planoId, updates)`: Atualiza via `PUT /pote/planos/{barbearia_id}/{plano_id}`
  - `deletarPlano(barbeariaId, planoId)`: Exclui via `DELETE /pote/planos/{barbearia_id}/{plano_id}`
  - `planosAtivos`: Getter que filtra planos ativos
- `useAppStore`: Notificações
- `usePermissions`: Verificação de permissões (canCreatePote, canEditPote, canDeletePote)

