# Tela de Assinaturas Ativas

## Visão Geral

Lista e gerenciamento de assinaturas de clientes. Permite criar, renovar, cancelar e visualizar detalhes de assinaturas.

## Layout Visual

### Header
- **Título**: "Assinaturas"
- **Subtítulo**: "Gerencie as assinaturas dos clientes"
- **Filtro**: Select de status (padrão: "ativa")
  - Todos os status
  - Apenas ativas
  - Canceladas
  - Expiradas
- **Botão**: "Nova Assinatura" (azul, com ícone Plus) - navega para `/pote/assinaturas/novo`

### Lista de Assinaturas
- **Loading**: Spinner com texto "Carregando assinaturas..."
- **Estado Vazio**: Ícone GiftIcon, título "Nenhuma assinatura encontrada", mensagem, botão "Criar Primeira Assinatura"
- **Grid de Cards** (3 colunas):
  - **Card de Assinatura** (componente `AssinaturaCard`):
    - **Header**: Nome do cliente, nome do plano, badge de status (Ativa/Cancelada/Expirada)
    - **Informações**:
      - Valor Pago (grande, azul, bold)
      - Período (data início - data fim)
      - Fichas (se aplicável): "X/Y" com barra de progresso
      - Tipo Ilimitado (se aplicável): Mensagem informativa
    - **Ações**: 
      - "Ver Detalhes" (azul) - navega para `/pote/assinaturas/{id}`
      - "Renovar" (verde) - se status = "ativa"
      - "Cancelar" (vermelho) - se status = "ativa"

### Página de Nova Assinatura (`/pote/assinaturas/novo`)
- **Header**: "Nova Assinatura", subtítulo, botão "Voltar"
- **Formulário**:
  - **Cliente *** (select obrigatório)
  - **Plano *** (select obrigatório, mostra valor)
  - **Valor Pago (R$)** (input number opcional, se não informado usa valor do plano)
  - **Botões**: Cancelar (outline cinza), "Comprar Assinatura" (azul)

### Página de Detalhes (`/pote/assinaturas/{id}`)
- **Header**: Informações da assinatura, botão "Voltar"
- **Informações**: Cliente, plano, status, período, fichas, consumos
- **Ações**: Renovar, Cancelar

## Rotas API

### GET /pote/assinaturas

**Query Params:**
- `barbearia_id` (obrigatório)
- `cliente_id` (opcional)
- `status` (opcional: "ativa" | "cancelada" | "expirada")
- `apenas_ativas` (opcional: true/false)

**Response:**
```json
[
  {
    "id": "string",
    "cliente_id": "string",
    "cliente": {
      "id": "string",
      "nome": "string",
      "name": "string"
    },
    "plano_id": "string",
    "plano": {
      "id": "string",
      "nome": "string",
      "valor": 0.00,
      "tipo_plano": "ilimitado" | "fichas_fixas" | "valor_manual"
    },
    "valor_pago": 0.00,
    "data_inicio": "YYYY-MM-DD",
    "data_fim": "YYYY-MM-DD",
    "status": "ativa" | "cancelada" | "expirada",
    "fichas_iniciais": 0,
    "fichas_consumidas": 0,
    "tipo_plano": "ilimitado" | "fichas_fixas" | "valor_manual"
  }
]
```

### GET /pote/assinaturas/{assinatura_id}

**Path Params:**
- `assinatura_id`: UUID da assinatura

**Response:** Mesmo formato do array acima (objeto único)

### POST /pote/assinaturas/{barbearia_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia

**Request Body:**
```json
{
  "cliente_id": "string",
  "plano_id": "string",
  "valor_pago": 0.00
}
```

**Nota**: `valor_pago` é opcional. Se não informado, usa o valor padrão do plano.

**Response:** Retorna a assinatura criada

### POST /pote/assinaturas/{assinatura_id}/renovar

**Path Params:**
- `assinatura_id`: UUID da assinatura

**Response:** Retorna a assinatura renovada (data_fim atualizada)

### POST /pote/assinaturas/{assinatura_id}/cancelar

**Path Params:**
- `assinatura_id`: UUID da assinatura

**Response:** Retorna a assinatura cancelada (status = "cancelada")

### GET /pote/assinaturas/saldo/{cliente_id}/{barbearia_id}

**Path Params:**
- `cliente_id`: UUID do cliente
- `barbearia_id`: UUID da barbearia

**Response:**
```json
{
  "saldo_fichas": 0,
  "assinaturas_ativas": 0
}
```

### GET /pote/consumos/{assinatura_id}

**Path Params:**
- `assinatura_id`: UUID da assinatura

**Response:**
```json
[
  {
    "id": "string",
    "assinatura_id": "string",
    "servico_id": "string",
    "servico": {
      "id": "string",
      "nome": "string"
    },
    "fichas_consumidas": 1.0,
    "data_consumo": "YYYY-MM-DDTHH:mm:ss.sssZ"
  }
]
```

## Stores

- `usePoteStore`:
  - `loadAssinaturas(filtros?)`: Carrega lista via `GET /pote/assinaturas?barbearia_id={id}&...`
  - `loadAssinatura(assinaturaId)`: Busca via `GET /pote/assinaturas/{assinatura_id}`
  - `buscarSaldoFichas(clienteId, barbeariaId)`: Busca saldo via `GET /pote/assinaturas/saldo/{cliente_id}/{barbearia_id}`
  - `comprarAssinatura(barbeariaId, dados)`: Cria via `POST /pote/assinaturas/{barbearia_id}`
  - `renovarAssinatura(assinaturaId)`: Renova via `POST /pote/assinaturas/{assinatura_id}/renovar`
  - `cancelarAssinatura(assinaturaId)`: Cancela via `POST /pote/assinaturas/{assinatura_id}/cancelar`
  - `loadConsumos(assinaturaId)`: Carrega consumos via `GET /pote/consumos/{assinatura_id}`
  - `assinaturasAtivas`: Getter que filtra assinaturas ativas
- `useClientesStore`: Lista de clientes para select
- `useAppStore`: Notificações
- `usePermissions`: Verificação de permissões (canCreatePote, canEditPote)

